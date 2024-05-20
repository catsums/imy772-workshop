import { MongoClient } from "mongodb";

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

export interface IUserData {
	id: string;
	history: ICalculatorOutput;
}

const DB = {
	name: process.env.DB_NAME || "",
	url: process.env.DB_URL || "",
}
