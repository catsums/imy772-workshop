
import {describe, test, expect, jest, beforeAll, afterAll, beforeEach, afterEach} from "@jest/globals";
import _, { reject } from "lodash";

process.env.NODE_ENV = "development";

import { io, Socket } from "socket.io-client";

import {app, changePort, clients, server, ioServer, DBdelete, DBreset, createSync} from "./api";
import { StoreType } from "./storage";
import { randomID } from '@catsums/my';


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

	describe("Testing Socket and Server", () => {
		test("Test open and connect socket", async () => {
			
			socket = io(testURL);
			
			let res = await new Promise((resolve, reject)=>{
				socket.on("connect", ()=>{
					resolve(true);
				});
			})
			expect(socket.connected).toBe(true);
			expect(clients.get(socket.id).id).toBe(socket.id);
			expect(clients.size).toBe(1);
		});
	})

	describe("Testing Calculator API functions", () => {
		afterEach(async () => {
			clients.forEach((client) => {
				let calc = client.calculator;
				calc.clearCache();
			});
		})
		// test caching current input
		test("Test send current input to the server", async () => {
			let syncList = [];

			let inputs:[string, string[]][] = [
				["5", ["5"]],
				["A", ["5A"]],
				["F", ["5AF"]],
			]

			let inputsKeys:string[] = [];
			let inputsVals:string[][] = [];
			inputs.forEach((input) => {
				let [inputI, inputO] = input;
				inputsKeys.push(inputI);
				inputsVals.push(inputO);
			});

			let promises = [];

			for(let input of inputsKeys) {
				promises.push(new Promise((resolve, reject) => {
					let sync = createSync();
					syncList.push(sync);

					socket.emit("Input", { id, sync, data: {
						stream: input,
						inTime: sync.time,
					}});

					function onInput(res){
						if(res.sync.id != sync.id) return;
						socket.off("Input", onInput);
						resolve(res);
					}
					socket.on("Input", onInput);
				}))
			}

			let results = [];
			for(let promise of promises){
				results.push(await promise);
			}

			for(let i=0;i<results.length;i++) {
				let res = results[i];
				let sync = syncList[i];

				let expected = {
					success: true,
					message: "Input Data",
					data: {
						id,
						cache: inputsVals[i],
					},
					sync,
				}

				expect(res).toEqual(expected);
			}
	
		});
		//test caching current tokens
		test("Test send current multiple tokens to the server", async () => {
			let syncList = [];

			let inputs:[string, string[]][] = [
				[ "1", ["1"] ],
				[ "5", ["15"] ],
				[ "+", ["15","+"] ],
				[ "2", ["15","+","2"] ],
				[ "A", ["15","+","2A"]] ,
			];

			let inputsKeys:string[] = [];
			let inputsVals:string[][] = [];
			inputs.forEach((input) => {
				let [inputI, inputO] = input;
				inputsKeys.push(inputI);
				inputsVals.push(inputO);
			});

			let promises = [];

			for(let input of inputsKeys) {

				promises.push(new Promise((resolve, reject) => {
					let sync = createSync();
					syncList.push(sync);

					socket.emit("Input", { id, sync, data: {
						stream: input,
						inTime: sync.time,
					}});
					
					function onInput(res){
						if(res.sync.id != sync.id) return;
						socket.off("Input", onInput);
						resolve(res);
					}
					socket.on("Input", onInput);
				}))
			}

			let results = [];
			for(let promise of promises){
				results.push(await promise);
			}

			for(let i=0;i<results.length;i++) {
				let res = results[i];
				let sync = syncList[i];

				let expected = {
					success: true,
					message: "Input Data",
					data: {
						id,
						cache: inputsVals[i],
					},
					sync,
				}

				// console.log({exp: inputsVals[i], act: res.data.cache, key: inputsKeys[i], syncID:sync.id});
				expect(res).toEqual(expected);
			}
	
		});
		//test calculate on server and return answer
		test("Test calculate values on the server", async () => {
			let syncList = [];

			let inputs:StoreType = ["11","-","A"];

			let promises = [];

			promises.push(new Promise((resolve, reject) => {
				let sync = createSync();
				syncList.push(sync);

				socket.emit("Input", { id, sync, data: {
					tokens: inputs,
					inTime: sync.time,
				}});
				socket.on("Input", (res)=>{
					if(res.sync.id != sync.id) return;
					resolve(res);
				});
			}), new Promise((resolve, reject) => {
				let sync = createSync();
				syncList.push(sync);

				socket.emit("Calculate", { id, sync });
				socket.on("Calculate", (res)=>{
					if(res.sync.id != sync.id) return;
					resolve(res);
				});
			}));

			let results = [];
			for(let promise of promises){
				results.push(await promise);
			}
			let res = results.at(-1);

			let expected = {
				success: true,
				message: "Calculated Data",
				data: {
					id,
					output: {
						input: inputs.join(""),
						output: "7",
						inTime: syncList.at(-1),
					}
				},
				sync: syncList.at(-1),
			}

			expect(res.success).toEqual(expected.success);
			expect(res.message).toEqual(expected.message);
			expect(res.data?.output?.inTime).toEqual(expected.data.output.inTime);
			expect(res.data?.output?.input).toEqual(expected.data.output.input);
			expect(res.data?.output?.output).toEqual(expected.data.output.output);
	
		});
		//test clear current input
		test("Test clear input on the server", async () => {
			let syncList = [];

			let inputs:StoreType = ["11","-","A"];

			let promises = [];

			promises.push(new Promise((resolve, reject) => {
				let sync = createSync();
				syncList.push(sync);

				socket.emit("Input", { id, sync, data: {
					tokens: inputs,
					inTime: sync.time,
				}});
				socket.on("Input", (res)=>{
					if(res.sync.id != sync.id) return;
					resolve(res);
				});
			}), new Promise((resolve, reject) => {
				let sync = createSync();
				syncList.push(sync);

				socket.emit("ClearInput", { id, sync,});
				socket.on("ClearInput", (res)=>{
					if(res.sync.id != sync.id) return;
					resolve(res);
				});
			}));

			let results = [];
			for(let promise of promises){
				results.push(await promise);
			}
			let res = results.at(-1);

			let expected = {
				success: true,
				message: "Cleared Input",
				data: {
					id,
					cache: ["11", "-", ""]
				},
				sync: syncList.at(-1),
			}

			expect(res).toEqual(expected);
	
		});
		//test clear current tokens (all cache)
		test("Test clear all cache on the server", async () => {
			let syncList = [];

			let inputs:StoreType = ["11","-","A"];

			let promises = [];

			promises.push(new Promise((resolve, reject) => {
				let sync = createSync();
				syncList.push(sync);

				socket.emit("Input", { id, sync, data: {
					tokens: inputs,
					inTime: sync.time,
				}});
				socket.on("Input", (res)=>{
					if(res.sync.id != sync.id) return;
					resolve(res);
				});
			}), new Promise((resolve, reject) => {
				let sync = createSync();
				syncList.push(sync);

				socket.emit("AllClear", { id, sync,});
				socket.on("AllClear", (res)=>{
					if(res.sync.id != sync.id) return;
					resolve(res);
				});
			}));

			let results = [];
			for(let promise of promises){
				results.push(await promise);
			}
			let res = results.at(-1);

			let expected = {
				success: true,
				message: "Cleared Cache",
				data: {
					id,
					cache: []
				},
				sync: syncList.at(-1),
			}

			expect(res).toEqual(expected);
	
		});
		//test receive error
		test("Test clear input on the server", async () => {
			let syncList = [];

			let inputs:StoreType = ["1","/","0"];

			let promises = [];

			promises.push(new Promise((resolve, reject) => {
				let sync = createSync();
				syncList.push(sync);

				socket.emit("Input", { id, sync, data: {
					tokens: inputs,
					inTime: sync.time,
				}});
				socket.on("Input", (res)=>{
					if(res.sync.id != sync.id) return;
					resolve(res);
				});
			}), new Promise((resolve, reject) => {
				let sync = createSync();
				syncList.push(sync);

				socket.emit("Calculate", { id, sync,});
				socket.on("Calculate", (res)=>{
					if(res.sync.id != sync.id) return;
					resolve(res);
				});
			}));

			let results = await Promise.all(promises);
			let res = results.at(-1);

			let expected = {
				success: false,
				message: "Infinity can't be processed",
				sync: syncList.at(-1),
				data: {
					value: Infinity,
				}
			}

			expect(res).toEqual(expected);
	
		});
	});

	describe("Testing Database API functions", () => {
		test("Test creating Data using API", async () => {
			let sync = createSync();

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
					if(res.sync.id != sync.id) return;
					resolve(res);
				});
			});
	
			expect(actual).toEqual(expected);
	
		});
		test("Test set Data using API", async () => {
			let sync = createSync();

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
					if(res.sync.id != sync.id) return;
					resolve(res);
				});
			});
	
			expect(actual).toEqual(expected);
	
		});
		test("Test get Data using API", async () => {
			let sync = createSync();

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
					if(res.sync.id != sync.id) return;
					resolve(res);
				});
			});
	
			expect(actual).toEqual(expected);
	
		});
		test("Test clear Data using API", async () => {
			let sync = createSync();

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
					if(res.sync.id != sync.id) return;
					resolve(res);
				});
			});
	
			expect(actual).toEqual(expected);
	
		});
		test("Test close Socket", async () => {
			let sync = createSync();

			let res = await new Promise((resolve, reject) => {
	
				socket.emit("Close");
		
				socket.on("disconnect", (res)=>{
					resolve(true);
				});
			});
	
			expect(res).toBe(true);
	
		});
	});

})
