
import {describe, test, expect, jest} from "@jest/globals";
import _ from "lodash";

let closeDB = jest.fn(async () => {});
let connectDB = jest.fn(async () => {
	return {
		close: closeDB,
	}
});

let createHistoryOption = jest.fn(async (data,db) => {});
let getHistoryOption = jest.fn(async (query,db) => {return ["3"]});
let getDBData = jest.fn(async (coll,db) => { return {"1":["3"]}});
let resetDB = jest.fn(async () => {});

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

	test("Open DB and insert storage", async () => {
		try{
			db = await connectDB();

			let id = randomID();
			let time = new Date().getTime();

			await createHistoryOption({
				id: id,
				input: "F+B",
				output: "1A",
				time: time,
			}, db);
			let res = await getHistoryOption({
				id: id,
			}, db);

			let expected = {
				id: id,
				history: [
					{
						input: "F+B",
						output: "1A",
						time: time,
					},
				],
			}
			
			expect(res).toEqual(expected);

			db.close();
		}catch(err){
			throw err;
		}
	})

})