
import {describe, test, expect, jest} from "@jest/globals";
import _ from "lodash";

interface ISock {
	emit: jest.Mock<(ev:string,data:string)=>void>;
	on: jest.Mock<(ev:string,func:(str:string)=>void)=>void>;
}

let socketOpen = jest.fn((url:string)=>{
	return {
		emit: jest.fn((ev:string, data:string)=>{
			console.log(JSON.parse(data));
		}),
		on: jest.fn((ev:string, func:(str:string)=>void)=>{
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

			socket.emit("Create", JSON.stringify({id}));
	
			socket.on("Create", (str:string)=>{
				let res = JSON.parse(str);
				
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

			socket.emit("Append", JSON.stringify({
				id, data,
			}));
	
			socket.on("Append", (str:string)=>{
				let res = JSON.parse(str);
				
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

			socket.emit("Get", JSON.stringify({
				id,
			}));
	
			socket.on("Get", (str:string)=>{
				let res = JSON.parse(str);
				
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

			socket.emit("Clear", JSON.stringify({
				id,
			}));
	
			socket.on("Clear", (str:string)=>{
				let res = JSON.parse(str);
				
				resolve(res);
			});
		});

		expect(actual).toBe(expected);

	});
})
