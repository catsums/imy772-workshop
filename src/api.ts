
import { Server, Socket } from "socket.io";
import express from "express";
import path from "path";
import { appendHistory, clearHistory, closeDB, connectDB, createHistory, retrieveHistory, deleteHistory, resetDB, ICalculatorInputTokens, ICalculatorInputStream, ICalculatorOutput } from "./db";
import http from 'http';

import * as MY from "@catsums/my";
import { StoreType, Calculator, processStore } from './storage';
import { CalcError } from "./calc_errors";

export const app = express();
export const PORT = Number(process.env.PORT) || 8081;
export const server = http.createServer(app);

export function changePort(newPort:number, callback:()=>void){
	server.close();
	server.listen(newPort, callback);
}
changePort(PORT, () => {
	console.log(`Listening on Port: ${PORT}`);
});

export const ioServer = new Server(server);

export interface IClient {
	id: string;
	socket: Socket;
	calculator:Calculator;
}

export const clients = new Map<string, IClient>();

export async function DBreset(){
	let dbClient = await connectDB();
	if(!dbClient){
		return false;
	}
	
	await resetDB();

	return true;
}
export async function DBdelete(id:string){
	let dbClient = await connectDB();
	if(!dbClient){
		return false;
	}
	
	return await deleteHistory(id);
}

async function getHistory(id){
	await connectDB();
	let history = await retrieveHistory(id);
	
	return history;
}

ioServer.on("connection", (socket) => {

	// let clientID = `${MY.randomString(4)}-${MY.randomString(4)}`;
	let clientID = socket.id;
	let client:IClient = {
		id: clientID,
		socket: socket,
		calculator: new Calculator(),
	}
	
	clients.set(clientID, client);

	console.log(`New Client: ${clientID}`)

	socket.on("Input", async ({id, sync, data})=>{
		console.log(`Client-${clientID} Input`);
		if(!id){
			socket.emit("Input", {
				success: false,
				message: "Missing ID",
				sync,
			});
			return;
		}

		let calc = client.calculator;

		try {
			if(data.tokens){
				let tokens = (data as ICalculatorInputTokens).tokens;
				for(let token of tokens){
					calc.processStream(token);
				}
			}
	
			if(data.stream){
				let stream = (data as ICalculatorInputStream).stream;
				calc.processStream(stream);
			}
	
			let cache = calc.getStore();

			socket.emit("Input", {
				success: true,
				message: `Input Data`,
				data: { id, cache},
				sync,
			});
		}catch(err){
			if(err instanceof CalcError){
				socket.emit("Input", {
					success: false,
					message: err.message,
					data: {
						value: err.value,
					},
					sync,
				});
				return;
			}
			socket.emit("Input", {
				success: false,
				message: `${err}`,
				sync,
			})
		}
	}).on("Calculate", async ({id, sync})=>{
		console.log(`Client-${clientID} Calculate`);
		if(!id){
			socket.emit("Calculate", {
				success: false,
				message: "Missing ID",
				sync,
			});
			return;
		}

		let calc = client.calculator;

		try {
			let store = calc.getStore();
			let historyData = await getHistory(id);

			let history = historyData.history.map((hist)=>(hist.output))

			let res = processStore(store, history);

			let output:ICalculatorOutput = {
				input: store.join(""),
				output: res,
				inTime: sync.time,
				outTime: Date.now(),
			}

			socket.emit("Calculate", {
				success: true,
				message: `Calculated Data`,
				data: { id, output },
				sync,
			});
		}catch(err){
			if(err instanceof CalcError){
				socket.emit("Calculate", {
					success: false,
					message: err.message,
					data: {
						value: err.value,
					},
					sync,
				});
				return;
			}
			socket.emit("Calculate", {
				success: false,
				message: `${err}`,
				sync,
			})
		}
	}).on("ClearInput", async ({id, sync})=>{
		console.log(`Client-${clientID} ClearInput`);
		if(!id){
			socket.emit("ClearInput", {
				success: false,
				message: "Missing ID",
				sync,
			});
			return;
		}

		let calc = client.calculator;

		try {
			calc.clearInput();

			let cache = calc.getStore();

			socket.emit("ClearInput", {
				success: true,
				message: `Cleared Input`,
				data: { id, cache },
				sync,
			});
		}catch(err){
			if(err instanceof CalcError){
				socket.emit("ClearInput", {
					success: false,
					message: err.message,
					data: {
						value: err.value,
					},
					sync,
				});
				return;
			}
			socket.emit("ClearInput", {
				success: false,
				message: `${err}`,
				sync,
			})
		}
	}).on("AllClear", async ({id, sync})=>{
		console.log(`Client-${clientID} AllClear`);
		if(!id){
			socket.emit("AllClear", {
				success: false,
				message: "Missing ID",
				sync,
			});
			return;
		}

		let calc = client.calculator;

		try {
			calc.clearCache();

			let cache = calc.getStore();

			socket.emit("AllClear", {
				success: true,
				message: `Cleared Input`,
				data: { id, cache },
				sync,
			});
		}catch(err){
			if(err instanceof CalcError){
				socket.emit("AllClear", {
					success: false,
					message: err.message,
					data: {
						value: err.value,
					},
					sync,
				});
				return;
			}
			socket.emit("AllClear", {
				success: false,
				message: `${err}`,
				sync,
			})
		}
	})

	//Database functions
	socket.on("Create", async ({id, sync})=>{
		console.log(`Client-${clientID} Create`);
		if(!id){
			socket.emit("Create", {
				success: false,
				message: "Missing ID",
				sync,
			});
			return;
		}

		let dbClient = await connectDB();

		if(!dbClient){
			socket.emit("Create", {
				success: false,
				message: "Database Error",
				sync,
			});
			return;
		}

		let res = await createHistory(id);

		socket.emit("Create", {
			success: res,
			message: (res ? `Created History` : `Failed to create history`),
			data: { id },
			sync,
		})
		return;
	}).on("Append", async ({id, data, sync})=>{
		console.log(`Client-${clientID} Append`);
		if(!id){
			socket.emit("Append", {
				success: false,
				message: "Missing ID",
				sync,
			});
			return;
		}

		let dbClient = await connectDB();

		if(!dbClient){
			socket.emit("Append", {
				success: false,
				message: "Database Error",
				sync,
			});
			return;
		}

		let res = await appendHistory(id, data);

		socket.emit("Append", {
			success: res,
			message: (res ? `Appended History` : `Failed to append history`),
			data: { id },
			sync,
		})
		return;
	}).on("Get", async ({id, sync})=>{
		console.log(`Client-${clientID} Get`);
		if(!id){
			socket.emit("Get", {
				success: false,
				message: "Missing ID",
				sync,
			});
			return;
		}

		let dbClient = await connectDB();

		if(!dbClient){
			socket.emit("Get", {
				success: false,
				message: "Database Error",
				sync,
			});
			return;
		}

		let history = await retrieveHistory(id);
		let res = (history?.history?.length ? true : false);

		socket.emit("Get", {
			success: res,
			message: (res ? `Got History` : `Failed to get history`),
			data: { id:history.id, history: history.history },
			sync,
		})
		return;
	}).on("Clear", async ({id, sync})=>{
		console.log(`Client-${clientID} Clear`);

		if(!id){
			socket.emit("Clear", {
				success: false,
				message: "Missing ID",
				sync,
			});
			return;
		}

		let dbClient = await connectDB();

		if(!dbClient){
			socket.emit("Clear", {
				success: false,
				message: "Database Error",
				sync,
			});
			return;
		}

		let res = await clearHistory(id);

		socket.emit("Clear", {
			success: res,
			message: (res ? `Deleted History` : `Failed to delete history`),
			data: { id },
			sync,
		})
		return;
	}).on("Close", async ()=>{
		console.log(`Client-${clientID} Close`);

		socket.disconnect();
		return;
	})

	socket.on("disconnect", (reason)=>{
		clients.delete(clientID);

		console.log(`Client-${clientID} disconnected`)

		if(clients.size <= 0){
			closeDB();
		}
	});

});