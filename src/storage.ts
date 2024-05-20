import { Operator, Operators } from "./operators";
import { DECtoHEX, HEX_CHARS, HEXtoDEC, parseInput } from "./processing";

const opTokens = "+-*/";
type StoreType = string[];
type InputStream = string;

const OperationTokens = "+-*/".split("");
const HEXTokens = "0123456789ABCDEF".split("");
const Ans = "@";
const SpecialTokens = [Ans,];

const AllTokens = [].concat(OperationTokens, HEXTokens, SpecialTokens);

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

export class Calculator {
	private store: StoreType;

	get current(){
		let c = this.store.length-1;
		if(c < 0){
			c = 0;
		}
		return this.store[c];
	}
	private set current(x:string){
		let c = this.store.length-1;
		if(c < 0){
			c = 0;
		}
		this.store[c] = x;
	}

	constructor(store: StoreType = []) {
		this.load(store);
	}

	load(store: StoreType){
		if(!store) return;
		this.store = store.slice();
	}

	appendCurrentToken(x:string){
		if(!x) return;
		x = x.toUpperCase();

		let curr = this.current;
		
		switch(true){
			case (!curr):
				curr = "";
				break;
			case (curr == Ans):
				return;
			case (OperationTokens.includes(curr)):
				this.store.push("");
				curr = this.current;
				break;
		}

		curr += x;
		this.current = parseInput(curr);
	}

	addToken(token:string){
		if(!token.length) return;
		token = token.toUpperCase();

		//check if token is included
		if(!AllTokens.includes(token)){
			//check if token is a HEX number with valid characters
			for(let char of token){
				if(!HEXTokens.includes(char)){
					return;
				}
			}
		}

		if(OperationTokens.includes(this.current)){
			this.current = token;
		}else if(SpecialTokens.includes(token)){
			this.store.push(token);
		}else if(OperationTokens.includes(token)){
			this.store.push(token);
		}else{
			this.store.push(parseInput(token));
		}
	}

	processStream(stream:InputStream){
		for(let i=0; i<stream.length; i++){
			
			let char = stream[i]?.toUpperCase();

			if(HEXTokens.includes(char)){
				this.appendCurrentToken(char);
			}else if(OperationTokens.includes(char) && this.current){
				this.addToken(char);
			}else if(SpecialTokens.includes(char)){
				switch(char){
					case Ans:
						this.addToken(char);
						break;
				}
			}
		}
	}
	
	getStore(){
		return this.store.slice();
	}

}

function isOperatorToken(token: string) {
	return OperationTokens.includes(token);
}
function isHexToken(token: string) {
	for(let char of token){
		if(!HEXTokens.includes(char)){
			return false;
		}
	}
	return true;
}

export function addTokens(stream:string, store:string[]){
	for(let token of stream){
		addToken(token, store);
	}

	return store;
}

export function addToken(token:string, store:string[]){
	//get index of latest element in array
	function curr(){
		let c = store.length-1;
		if(c < 0){
			c = 0;
		}
		return c;
	}

	token = token.toUpperCase();

	if(opTokens.includes(token)){
		if(store.length && store[0]){
			if( isOperatorToken(store[curr()]) ){
				//replace operator in cell
				store[curr()] = token;
			}else{
				//create new cell and add operator
				store.push(token);
			}
		}
	}else if(HEX_CHARS.includes(token)){
		if(HEX_CHARS.includes(token)){
			if(!store.length || isOperatorToken( store[curr()] )){
				//create new cell
				store.push("");
			}
			//append input
			store[curr()] += token;
			store[curr()] = parseInput(store[curr()]);
			
		}
	}

	return store;
}

export function processStore(store:string[]){
	let init = store.map((t)=>{
		if(!isOperatorToken(t)){
			return Number(HEXtoDEC(t))
		}
		return t;
	});
	
	// Multiplication and Division first
	// Then Addition and Subtraction

	let passes = [["*","/"], ["+","-"]];

	for(let ops of passes){
		for(let i=0; i<init.length; i++){
			let prev = init[i-1] || null;
			let curr = init[i] || null;
			let next = init[i+1] || null;
	
			if(isOperatorToken(curr.toString()) && ops.includes(curr.toString())){
				let a, b;
	
				a = prev as number;
				b = next as number;
	
				let op:Operator;

				switch(curr){
					case "+": op = Operators.Add; break;
					case "-": op = Operators.Subtract; break;
					case "*": op = Operators.Multiply; break;
					case "/": op = Operators.Divide; break;
				}

				
				if(op){
					let ans = calculate(a,b,op);
					console.log({a,b,op, i, ans});

					init.splice(i-1, 3, ans);
					i -= 2;
					
				}
				console.log({init, i});
			}

	
		}
	}


	return DECtoHEX(init[0]);

}

export function calculate(a:number, b:number, op:Operator){
	return op.calculate(a,b);
}