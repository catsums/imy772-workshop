
import { Server, Socket } from "socket.io";
import express from "express";
import path from "path";
import { appendHistory, clearHistory, closeDB, connectDB, createHistory, retrieveHistory } from "./db";
import http from 'http';

import * as MY from "@catsums/my";

const app = express();
const port = process.env.PORT || 8081;
const server = http.createServer(app);

const io = new Server(server);

const clients = new Map<string, Socket>();

io.on("connection", (socket) => {
	
	clients.set(socket.id, socket);

	socket.emit("Open", {
		time: Date.now(),
	})

	socket.on("Create", async ({id})=>{
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
			data: { id }
		})
		return;
	}).on("Append", async ({id, data})=>{
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
		})
		return;
	}).on("Get", async ({id, data})=>{
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
		})
		return;
	}).on("Clear", async ({id, data})=>{
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

		socket.emit("Get", {
			success: res,
			message: (res ? `Deleted History` : `Failed to delete history`),
			data: { id },
		})
		return;
	}).on("Close", async ({id, data})=>{
		socket.disconnect();
		return;
	})

	socket.on("disconnect", async (data)=>{
		clients.delete(socket.id);

		if(clients.size <= 0){
			await closeDB();
		}
	});

});
