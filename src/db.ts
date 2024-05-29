import { MongoClient, ServerApiVersion } from "mongodb";

import { InputStream, StoreType } from "./storage";

import dotenv from "dotenv";
dotenv.config({
	path: "./src/db.dev.env",
});

let DB_NAME = process.env.NODE_ENV === "production" ? process.env.DB_NAME : process.env.TEST_DB_NAME;
export interface ICalculatorInput {
	stream?: string;
	tokens?: StoreType;
	inTime: number;
}
export interface ICalculatorInputStream extends ICalculatorInput {
	stream: InputStream;
}
export interface ICalculatorInputTokens extends ICalculatorInput {
	tokens: StoreType;
}

export interface ICalculatorOutput {
	input: string;
	output: string;
	inTime: number;
	outTime: number;
}

export interface IHistoryData {
	id: string;
	history: ICalculatorOutput[];
	lastModified: Date;
}

export const DB : {
	client: MongoClient;
	conn: MongoClient;
	connected: boolean;
	config : {
		dbname: string;
		url: string;
	}
} = {
	client: null,
	conn: null,
	config: {
		dbname: DB_NAME || "",
		url: process.env.DB_URL || "",
	},
	connected: false,
}

console.log(`DB_NAME: ${DB.config.dbname}`);

export const collections = {
	history: "history",
}

DB.client = new MongoClient(DB.config.url, {
	serverApi: ServerApiVersion.v1,
});

if(DB.client){
	DB.client.on("open", ()=>{
		DB.connected = true;
	});
	DB.client.on("topologyClosed", ()=>{
		DB.connected = false;
		DB.conn = null;
	});
}

export async function connectDB(){
	if(!DB.connected){
		DB.conn = await DB.client.connect();
	}
	return DB.conn;
}

export async function closeDB(){
	if(DB.connected){
		DB.client.close();
	}
	DB.conn = null;
}

export async function insertDBData(coll:string, data:any, db=DB.conn.db(DB.config.dbname)){
	let res = await db.collection(coll).insertOne(data);

	return res;
}
export async function getDBData(coll:string, query:any, opts?, db=DB.conn.db(DB.config.dbname)){
	if(!opts){
		opts = {
			projection: {
				_id: 0,
			}
		}
	}
	let res = await db.collection(coll).findOne(query, opts);

	return res;
}
export async function updateDBData(coll:string, query:any, data:any, db=DB.conn.db(DB.config.dbname)){
	let res = await db.collection(coll).updateMany(query, data);

	return res;
}
export async function deleteDBData(coll:string, query:any, db=DB.conn.db(DB.config.dbname)){
	let res = await db.collection(coll).deleteMany(query);

	return res;
}

export async function createHistory(id:string, db=DB.conn.db(DB.config.dbname)){
	let historyData = await retrieveHistory(id, db);

	if(!historyData){
		let res = await insertDBData(collections.history, {
			id: id,
			history: [],
		}, db);

		if(res.insertedId){
			return true;
		}
	}
	return false;
}
export async function retrieveHistory(id:string, db=DB.conn.db(DB.config.dbname)){
	let res = await getDBData(collections.history, {id: id}, {
		projection: {
			_id: 0,
			lastModified: 0,
		}
	}, db);

	return (res as unknown) as IHistoryData;
}
export async function appendHistory(id:string, {input, output, inTime, outTime}:ICalculatorOutput, db=DB.conn.db(DB.config.dbname)){
	let historyData = await retrieveHistory(id, db);
	if(!historyData) return false;

	historyData.history.push({
		input, output, inTime, outTime,
	});

	let res = await updateDBData(collections.history, {id: id}, {
		$set: {
			history: historyData.history,
			lastModified: new Date(),
		}
	}, db);

	if(res.modifiedCount) return true;

	return false;
}
export async function deleteHistory(id:string, db=DB.conn.db(DB.config.dbname)){
	let res = await deleteDBData(collections.history, {id:id}, db);

	if(res.deletedCount) return true;

	return false;
}
export async function clearHistory(id:string, db=DB.conn.db(DB.config.dbname)){
	let historyData = await retrieveHistory(id, db);
	if(!historyData) return false;

	let res = await updateDBData(collections.history, {id: id}, {
		$set: {
			history : [],
			lastModified: new Date(),
		}
	}, db);

	if(res.modifiedCount) return true;

	return false;
}

export async function clearCollection(coll:string, db=DB.conn.db(DB.config.dbname)){
	let res = await db.collection(coll).drop();

	return res;
}
export async function resetDB(db=DB.conn.db(DB.config.dbname)){
	let res = await db.dropDatabase();

	return res;
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
