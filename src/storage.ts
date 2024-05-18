import { Operator, Operators } from "./operators";
import { DECtoHEX, HEX_CHARS, HEXtoDEC } from "./processing";

const opTokens = "+-*/";
function isOperatorToken(token: string) {
	return opTokens.includes(token);
}

export function addTokens(stream:string, store:string[]){
	for(let token of stream){
		addToken(token, store);
	}
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
		}
	}
}

export function processStore(store:string[]){
	let ans = 0; let hasAns = false;

	for(let i=0; i<store.length; i++){
		let prev = store[i-1] || null;
		let curr = store[i] || null;
		let next = store[i+1] || null;

		if(isOperatorToken(curr)){
			let a, b;
			if(hasAns){
				a = ans;
			}else{
				a = HEXtoDEC(prev);
			}
			
			b = HEXtoDEC(next);

			let op:Operator;

			switch(curr){
				case "+": op = Operators.Add; break;
				case "-": op = Operators.Subtract; break;
				case "*": op = Operators.Multiply; break;
				case "/": op = Operators.Divide; break;
			}

			if(op){
				ans = calculate(a,b,op);
				hasAns = true;
			}
		}
	}

	return DECtoHEX(ans);

}

export function calculate(a:number, b:number, op:Operator){
	return op.calculate(a,b);
}