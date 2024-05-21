import { MongoClient, ServerApiVersion } from "mongodb";

import { InputStream, StoreType } from "./storage";

import dotenv from "dotenv";
dotenv.config({
	path: "./src/db.dev.env",
});

export interface ICalculatorInput {
	stream?: string;
	tokens?: StoreType;
	inTime: Date;
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
	inTime: Date;
	outTime: Date;
}

export interface IHistoryData {
	id: string;
	history: ICalculatorOutput[];
	lastModified: Date;
}

const DB : {
	client: MongoClient;
	conn: MongoClient;
	connected: boolean;
	config : {
		dbname: string;
		url: string;
		user: string;
		pass: string;
		cluster: string;
	}
} = {
	client: null,
	conn: null,
	config: {
		dbname: process.env.DB_NAME || "",
		url: process.env.DB_URL || "",
		user: process.env.DB_USERNAME || "",
		pass: process.env.DB_PASSWORD || "",
		cluster: process.env.DB_CLUSTER || "",
	},
	connected: false,
}

const collections = {
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
export async function getDBData(coll:string, query:any, db=DB.conn.db(DB.config.dbname)){
	let res = await db.collection(coll).findOne(query, {
		projection: { _id: 0}
	});

	return res;
}
export async function updateDBData(coll:string, query:any, data:any, db=DB.conn.db(DB.config.dbname)){
	let res = await db.collection(coll).updateOne(data, query);

	return res;
}
export async function deleteDBData(coll:string, query:any, db=DB.conn.db(DB.config.dbname)){
	let res = await db.collection(coll).deleteOne(query);

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
	let res = await getDBData(collections.history, {id: id}, db);

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
	let res = db.collection(coll).drop();

	return res;
}
export async function resetDB(coll:string, db=DB.conn.db(DB.config.dbname)){
	let res = db.dropDatabase();

	return res;
}