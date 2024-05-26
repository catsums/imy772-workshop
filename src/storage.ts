import { Operator, Operators } from "./operators";
import { DECtoHEX, HEX_CHARS, HEXtoDEC, parseInput } from "./processing";

const opTokens = "+-*/";
function isOperatorToken(token: string) {
	return opTokens.includes(token);
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