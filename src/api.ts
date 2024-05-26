
import { Server, Socket } from "socket.io";
import express from "express";
import path from "path";
import { appendHistory, clearHistory, closeDB, connectDB, createHistory, retrieveHistory, deleteHistory, resetDB } from "./db";
import http from 'http';

import * as MY from "@catsums/my";

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

export const clients = new Map<string, Socket>();

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

ioServer.on("connection", (socket) => {

	let socketID = socket.id;
	
	clients.set(socketID, socket);

	console.log(`New Client: ${socketID}`)

	socket.on("Create", async ({id, sync})=>{
		console.log(`Client-${socketID} Create`);
		if(!id){
			socket.emit("Create", {
				success: false,
				message: "Missing ID",
			});
			return;
		}

		let dbClient = await connectDB();

		if(!dbClient){
			socket.emit("Create", {
				success: false,
				message: "Database Error",
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
		console.log(`Client-${socketID} Append`);
		if(!id){
			socket.emit("Append", {
				success: false,
				message: "Missing ID",
			});
			return;
		}

		let dbClient = await connectDB();

		if(!dbClient){
			socket.emit("Append", {
				success: false,
				message: "Database Error",
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
		console.log(`Client-${socketID} Get`);
		if(!id){
			socket.emit("Get", {
				success: false,
				message: "Missing ID",
			});
			return;
		}

		let dbClient = await connectDB();

		if(!dbClient){
			socket.emit("Get", {
				success: false,
				message: "Database Error",
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
		console.log(`Client-${socketID} Clear`);

		if(!id){
			socket.emit("Clear", {
				success: false,
				message: "Missing ID",
			});
			return;
		}

		let dbClient = await connectDB();

		if(!dbClient){
			socket.emit("Clear", {
				success: false,
				message: "Database Error",
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
		console.log(`Client-${socketID} Close`);

		socket.disconnect();
		return;
	})

	socket.on("disconnect", (reason)=>{
		clients.delete(socket.id);

		console.log(`Client-${socketID} disconnected`)

		if(clients.size <= 0){
			closeDB();
		}
	});

});