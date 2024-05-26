
import {describe, test, expect, jest, beforeAll, afterAll} from "@jest/globals";
import _ from "lodash";

import { io, Socket } from "socket.io-client";

import {app, changePort, clients, server, ioServer, DBdelete, DBreset} from "./api";

let port = 8082;

const testURL = `http://localhost:${port}/`;


function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe("Access API functions", () => {
	let socket:Socket;
	let id = "Abcd1234";

	beforeAll(() => {
		server.close();
		server.listen(port, ()=>{
			console.log(`Test Listening on Port ${port}`);
		})
	});

	afterAll(async () => {
		await DBdelete(id);
		if(socket.connected){
			socket.disconnect();
		}
		ioServer.close();
		server.close();
	});

	test("Test open and connect socket", async () => {
		
		socket = io(testURL);
		
		let res = await new Promise((resolve, reject)=>{
			socket.on("connect", ()=>{
				resolve(true);
			});
		})
		expect(res).toBeTruthy();
	});
	test("Test creating Data using API", async () => {
		let sync = {
			time: Date.now(),
		}
		let expected = {
			success: true,
			message: "Created History",
			data: {
				id,
			},
			sync,
		}

		let actual = await new Promise((resolve, reject) => {

			socket.emit("Create", { id, sync});
	
			socket.on("Create", (res)=>{
				if(res.sync.time != sync.time) return;
				resolve(res);
			});
		});

		expect(actual).toEqual(expected);

	});
	test("Test set Data using API", async () => {
		let sync = {
			time: Date.now(),
		}
		let expected = {
			success: true,
			message: "Appended History",
			data: {
				id,
			},
			sync,
		}
		let data = {
			input: "F+B",
			output: "1A",
			inTime: 0,
			outTime: 1,
		};

		let actual = await new Promise((resolve, reject) => {

			socket.emit("Append", {
				id, data, sync,
			});
	
			socket.on("Append", (res)=>{
				if(res.sync.time != sync.time) return;
				resolve(res);
			});
		});

		expect(actual).toEqual(expected);

	});
	test("Test get Data using API", async () => {
		let sync = {
			time: Date.now(),
		}
		let expected = {
			success: true,
			message: "Got History",
			data: {
				id,
				history:[
					{
						input: "F+B",
						output: "1A",
						inTime: 0,
						outTime: 1,
					}
				]
			},
			sync,
		}

		let actual = await new Promise((resolve, reject) => {

			socket.emit("Get", {
				id, sync,
			});
	
			socket.on("Get", (res)=>{
				if(res.sync.time != sync.time) return;
				resolve(res);
			});
		});

		expect(actual).toEqual(expected);

	});
	test("Test clear Data using API", async () => {
		let sync = {
			time: Date.now(),
		}
		let expected = {
			success: true,
			message: "Deleted History",
			data: {
				id,
			},
			sync,
		}

		let actual = await new Promise((resolve, reject) => {

			socket.emit("Clear", {
				id, sync,
			});
	
			socket.on("Clear", (res)=>{
				if(res.sync.time != sync.time) return;
				resolve(res);
			});
		});

		expect(actual).toEqual(expected);

	});
	test("Test close Socket", async () => {
		let sync = {
			time: Date.now(),
		}
		let res = await new Promise((resolve, reject) => {

			socket.emit("Close");
	
			socket.on("disconnect", (res)=>{
				resolve(true);
			});
		});

		expect(res).toBe(true);

	});
})
