import { InputStream, StoreType } from "./storage";

interface ICalculatorInput {
	stream?: string;
	tokens?: StoreType;
	inTime: Date;
}
interface ICalculatorInputStream extends ICalculatorInput {
	stream: InputStream;
}
interface ICalculatorInputTokens extends ICalculatorInput {
	tokens: StoreType;
}

interface ICalculatorOutput {
	input: string;
	output: string;
	inTime: Date;
	outTime: Date;
}

interface IUserData {
	id: string;
	history: ICalculatorOutput;
}

