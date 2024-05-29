import { Operator, Operators } from "./operators";
import { DECtoHEX, HEX_CHARS, HEXtoDEC, parseInput } from "./processing";

export type StoreType = string[];
export type InputStream = string;

export const OperationTokens = "+-*/".split("");
export const HEXTokens = "0123456789ABCDEF".split("");
export const SpecialToken = {
	Ans: "@",
}
export const SpecialTokens = Object.values(SpecialToken);;

export const AllTokens = [].concat(OperationTokens, HEXTokens, SpecialTokens);

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
			case (curr == SpecialToken.Ans):
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
			if(!isHexToken(token)){
				return;
			}
		}

		if(OperationTokens.includes(token)){
			if(OperationTokens.includes(this.current)){
				this.current = token;
			}else if(this.current){
				this.store.push(token);
			}
		}else if(token == SpecialToken.Ans){
			if(OperationTokens.includes(this.current)){
				this.store.push(token);
			}else if(!this.current){
				this.current = token;
			}
		}else if(!this.current){
			this.appendCurrentToken(token);
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
					case SpecialToken.Ans:
						this.addToken(char);
						break;
				}
			}
		}
	}
	
	getStore(){
		return this.store.slice();
	}

	clearInput(){
		this.current = "";
	}

	clearCache(){
		this.store = [];
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

function addTokens(stream:InputStream, store:StoreType){
	for(let token of stream){
		addToken(token, store);
	}

	return store;
}

function addToken(token:string, store:StoreType){
	//get index of latest element in array
	function curr(){
		let c = store.length-1;
		if(c < 0){
			c = 0;
		}
		return c;
	}

	token = token.toUpperCase();

	if(isOperatorToken(token)){
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

export function processStore(store:string[], history:string[] = []){
	let ans = history.at(-1) || "0";

	let init = store.map((t)=>{
		t = t.toUpperCase();
		switch(true){
			case (isHexToken(t)):
				return Number(HEXtoDEC(t));
			case (t == SpecialToken.Ans):
				return Number(HEXtoDEC(ans));
			default:
				return t;
		}
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
					let res = calculate(a,b,op);
					// console.log({a,b,op, i, ans});

					init.splice(i-1, 3, res);
					i -= 2;
					
				}
				// console.log({init, i});
			}

	
		}
	}


	return DECtoHEX(init[0]);

}

export function calculate(a:number, b:number, op:Operator){
	return op.calculate(a,b);
}