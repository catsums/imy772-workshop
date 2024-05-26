
import {describe, test, expect, jest} from "@jest/globals";
import _ from "lodash";

interface ISock {
	emit: jest.Mock<(ev:string,data?:any)=>void>;
	on: jest.Mock<(ev:string,func:(str:any)=>void)=>void>;
}

let socketOpen = jest.fn((url:string)=>{
	return {
		emit: jest.fn((ev:string, data?:any)=>{
			console.log(JSON.parse(data));
		}),
		on: jest.fn((ev:string, func:(str:any)=>void)=>{
			func('{id:123}');
		}),
	};
});

describe("Access API functions", () => {
	let socket:ISock;
	let id = "Abcd1234";
	test("Test open and connect socket", async() => {
		socket = socketOpen("example.com");

		expect(socketOpen).toBeCalled();
	});
	test("Test creating Data using API", async () => {
		let expected = {
			success: true,
			message: "Created History",
			data: {
				id,
			}
		}

		let actual = await new Promise((resolve, reject) => {

			socket.emit("Create", {id});
	
			socket.on("Create", (res)=>{
				resolve(res);
			});
		});

		expect(actual).toBe(expected);

	});
	test("Test set Data using API", async () => {
		let expected = {
			success: true,
			message: "Appended History",
			data: {
				id,
			}
		}
		let data = {
			input: "F+B",
			output: "1A",
			inTime: 0,
			outTime: 1,
		};

		let actual = await new Promise((resolve, reject) => {

			socket.emit("Append", {
				id, data,
			});
	
			socket.on("Append", (res)=>{
				resolve(res);
			});
		});

		expect(actual).toBe(expected);

	});
	test("Test get Data using API", async () => {
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
			}
		}

		let actual = await new Promise((resolve, reject) => {

			socket.emit("Get", {
				id,
			});
	
			socket.on("Get", (res)=>{
				resolve(res);
			});
		});

		expect(actual).toBe(expected);

	});
	test("Test clear Data using API", async () => {
		let expected = {
			success: true,
			message: "Deleted History",
			data: {
				id,
			}
		}

		let actual = await new Promise((resolve, reject) => {

			socket.emit("Clear", {
				id,
			});
	
			socket.on("Clear", (res)=>{
				resolve(res);
			});
		});

		expect(actual).toBe(expected);

	});
	test("Test close Socket", async () => {
		let res = await new Promise((resolve, reject) => {

			socket.emit("Close");
	
			socket.on("disconnect", (res)=>{
				resolve(true);
			});
		});

		expect(res).toBe(true);

	});
})
