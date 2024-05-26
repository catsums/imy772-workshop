
import {describe, test, expect, jest, beforeAll, afterAll} from "@jest/globals";
import _ from "lodash";
import { Db, MongoClient } from "mongodb";

import {
	connectDB, closeDB,
	insertDBData, getDBData, updateDBData, deleteDBData,
	createHistory, retrieveHistory, appendHistory, deleteHistory, clearHistory,
	clearCollection, resetDB,
	DB
} from "./db"

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

describe("Connect to DB and test functionality", () => {
	let dbClient:MongoClient;
	let db:Db;

	beforeAll(async ()=>{

		try{
			dbClient = await connectDB();
			db = dbClient.db();
		}catch(err){
			throw err;
		}
	});
	afterAll(async (done)=>{
		try{
			await resetDB();
			await closeDB();
		}catch(err){
			throw err;
		}
	});

	test("Test create history", async () => {
		try{
			dbClient = await connectDB();
			let id = randomID();

			await createHistory(id);

			let res = await retrieveHistory(id);

			let expected = {
				id: id,
				history: [],
			};
			
			expect(res).toEqual(expected);

			await resetDB();
		}catch(err){
			throw err;
		}
	})
	test("Test insert history", async () => {
		try{
			dbClient = await connectDB();
			let id = randomID();

			await createHistory(id);

			let data = {
				input: "F+B",
				output: "1A",
				inTime: 0,
				outTime: 1,
			};

			await appendHistory(id, data);
			let res = await retrieveHistory(id);

			let expected = {
				id: id,
				history: [ data ],
			};
			
			expect(res).toEqual(expected);

			await resetDB();
		}catch(err){
			throw err;
		}
	})

	test("Test Fetch History", async () => {
		try{
			dbClient = await connectDB();
			let id = randomID();

			await createHistory(id);
			let data = [
				{
					input: "C-1",
					output: "B",
					inTime: 1, outTime: 2,
				},
				{
					input: "F2+4",
					output: "F4",
					inTime: 3, outTime: 4,
				},
				{
					input: "@-1",
					output: "F3",
					inTime: 5, outTime: 6,
				}
			]
			for(let d of data){
				await appendHistory(id,d);
			}

			let res = await retrieveHistory(id);

			let expected = {
				id: id,
				history: data,
			};
			
			expect(res).toEqual(expected);

			await resetDB();
		}catch(err){
			throw err;
		}
	})

	
	test("Test Reset History", async () => {
		try{
			dbClient = await connectDB();
			let id = randomID();

			await createHistory(id);
			await appendHistory(id, {
				input: "C-1",
				output: "B",
				inTime: 1, outTime: 2,
			},);

			await clearHistory(id);

			let res = await retrieveHistory(id);

			let expected = {
				id: id,
				history: [],
			};
			
			expect(res).toEqual(expected);

			await resetDB();
		}catch(err){
			throw err;
		}
	})
	

});