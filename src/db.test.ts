
import {describe, test, expect, jest} from "@jest/globals";
import _ from "lodash";

let closeDB = jest.fn(async () => {});
let connectDB = jest.fn(async () => {
	return {
		close: closeDB,
	}
});

let createHistory = jest.fn(async (data,db) => {});
let appendHistory = jest.fn(async (data,db) => {});
let getHistory = jest.fn(async (query,db) => {return ["3"]});
let clearHistory = jest.fn(async (query,db) => {return ["3"]});
let getDBData = jest.fn(async (coll,db) => { return {"1":["3"]}});
let resetDB = jest.fn(async (db) => {});

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function randomID(len:number=8){
	let id = "";
	let alpha = "0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
	for(let i=0;i<len;i++){
		id += alpha[_.random(alpha.length)];
	}
	return id;
}

describe("Connect to DB and Close DB", () => {
	let db;
	test("Open and close DB", async () => {
		try{
			db = await connectDB();

			expect(connectDB).toReturn();

			await timeout(3000);

			db.close();
		}catch(err){
			throw err;
		}
	});

	test("Test create history", async () => {
		try{
			db = await connectDB();

			let id = randomID();
			let time = new Date().getTime();

			await createHistory({
				id: id,
			}, db);
			let res = await getDBData('history',db);

			let expected = [{
				id: id,
				history: [
				],
			}];
			
			expect(res).toEqual(expected);

			resetDB(db);

			db.close();
		}catch(err){
			throw err;
		}
	})
	test("Test insert history", async () => {
		try{
			db = await connectDB();

			let id = randomID();
			let time = new Date().getTime();

			await createHistory({
				id: id,
			}, db);
			await appendHistory({
				id: id,
				input: "F+B",
				output: "1A",
				time: time,
			}, db);
			let res = await getDBData('history',db);

			let expected = [{
				id: id,
				history: [
					{
						input: "F+B",
						output: "1A",
						time: time,
					},
				],
			}];
			
			expect(res).toEqual(expected);

			resetDB(db);

			db.close();
		}catch(err){
			throw err;
		}
	})

	test("Test Fetch History", async () => {
		try{
			db = await connectDB();

			let id = randomID();
			let time = new Date().getTime();

			await createHistory({
				id: id
			}, db);
			await appendHistory({
				id: id,
				input: "C-1",
				output: "B",
				time: time,
			}, db);
			await appendHistory({
				id: id,
				input: "F2+4",
				output: "F4",
				time: time,
			}, db);
			await appendHistory({
				id: id,
				input: "@-1",
				output: "F3",
				time: time,
			}, db);

			let res = await getHistory({
				id: id,
			}, db);

			let expected = [{
				id: id,
				history: [],
			}];
			
			expect(res).toEqual(expected);

			resetDB(db);

			db.close();
		}catch(err){
			throw err;
		}
	})

	
	test("Test Reset History", async () => {
		try{
			db = await connectDB();

			let id = randomID();
			let time = new Date().getTime();

			await createHistory({
				id: id
			}, db);
			await appendHistory({
				id: id,
				input: "C-1",
				output: "B",
				time: time,
			}, db);

			await clearHistory({
				id: id,
			}, db);

			let res = await getDBData('history',db);

			let expected = [{
				id: id,
				history: [],
			}];
			
			expect(res).toEqual(expected);

			resetDB(db);

			db.close();
		}catch(err){
			throw err;
		}
	})

})