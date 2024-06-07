import { MouseEventHandler, useEffect, useState } from "react";
import { Socket } from 'socket.io-client';
import * as MY from "@catsums/my";
import { parseInput } from "../processing";
import { Calculator, HEXTokens, OperationTokens, SpecialToken, SpecialTokens, streamToTokens } from "../storage";
import { CalcError } from "../calc_errors";

export function createSync(){
	return {
		time: Date.now(),
		id: MY.randomID(),
	}
}

interface IPropsWithChildren {
	children?: React.ReactNode;
}


export function Tkn({ children }: IPropsWithChildren) {
	return (
		<span className="calc-token ">
		{children}
	  </span>
	)
}

interface IHistoryItemProps {
	children?: React.ReactNode;
	onclick?: MouseEventHandler;
}

export function HistoryItem({children, onclick}:IHistoryItemProps) {
	return (
		<span className="calc-history-item" onClick={onclick}>
			{children}
		</span>
	)
}

interface IBtnProps extends IPropsWithChildren {
	colspan?: number;
	rowspan?: number;
	onclick?: MouseEventHandler;
}

export function Btn({colspan=0, rowspan=0, onclick=(e)=>{}, children=null}:IBtnProps) {

  let colspans = [
	'col-auto', 'col-span-1', 'col-span-2',
	'col-span-3', 'col-span-4', 'col-span-5',
	'col-span-6', 'col-span-7', 'col-span-8',
	'col-span-9', 'col-span-10', 'col-span-11',
	'col-span-12','col-span-full',
  ]
  let rowspans = [
	'row-auto', 'row-span-1', 'row-span-2',
	'row-span-3', 'row-span-4', 'row-span-5',
	'row-span-6', 'row-span-7', 'row-span-8',
	'row-span-9', 'row-span-10', 'row-span-11',
	'row-span-12','row-span-full',
  ]

  return (
    <button className={`calc-btn pushy z-[1]  ${colspans[colspan]} ${rowspans[rowspan]}`} onClick={onclick}>
      <div className="pushy-inner flex justify-center items-center">
        {children}
      </div>
    </button>
  );
}

interface ICalculatorProps {
	socket:Socket;
	id:string;
}

export default function CalculatorApp({socket, id}:ICalculatorProps) {

	const [result, setResult] = useState("");
	const [store, setStore] = useState([""]);
	const [history, setHistory] = useState([]);
	const [errorText, setErrorText] = useState("");

	function updateHistory(data){
		let sync = createSync();
		function onAppend(res){
			if(res.sync.id != sync.id) return;
			socket.off("Append", onAppend);

			
			if(!res.success){
				setErrorText(res.message);
				return;
			}

			console.log(res);

			getHistory();
			
		}

		sync = createSync();

		socket.emit("Append", { id, sync, data });
		socket.on("Append", onAppend);
	}
	function clearHistory(){
		if(!history.length){
			return;
		}
		let sync = createSync();
		function onClear(res){
			if(res.sync.id != sync.id) return;
			socket.off("Clear", onClear);

			if(!res.success){
				setErrorText(res.message);
				return;
			}

			console.log(res);

			getHistory();
			
		}

		sync = createSync();

		socket.emit("Clear", { id, sync });
		socket.on("Clear", onClear);
	}

	function getHistory(){
		let sync = createSync();
		function onGet(res){
			if(res.sync.id != sync.id) return;
			socket.off("Get", onGet);
			
			console.log(res);
			if(!res.success){
				setErrorText(res.message);
				return;
			}

			let history = res.data.history;

			setHistory(history);
			
		}

		sync = createSync();

		socket.emit("Get", { id, sync });
		socket.on("Get", onGet);
	}

	function calculate(){
		console.log("A");
		resetResult();
		let sync = createSync();
		function onCalculate(res){
			console.log("D");
			if(res.sync.id != sync.id) return;
			socket.off("Calculate", onCalculate);
			
			console.log(res);
			if(!res.success){
				setErrorText(res.message);
				return;
			}

			let out = res.data.output;
			
			setResult(out.output);
			updateHistory(out);
		}
		function onInput(res){
			console.log("C");
			if(res.sync.id != sync.id) return;
			socket.off("Input", onInput);

			if(!res.success){
				setErrorText(res.message);
				return;
			}

			sync = createSync();

			socket.emit("Calculate", { id, sync });
			socket.on("Calculate", onCalculate);
		}

		function onClear(res){
			console.log("B");
			if(res.sync.id != sync.id) return;
			socket.off("AllClear", onClear);

			if(!res.success){
				setErrorText(res.message);
				return;
			}

			socket.emit("Input", { id, sync, data: {
				tokens: store,
				inTime: sync.time,
			}});
			socket.on("Input", onInput);
		}

		socket.emit("AllClear", { id, sync });
		socket.on("AllClear", onClear);
		console.log("AB");
		console.log({socket, connected:socket.connected, id:socket.id})
	}

	function addToken(tkn){
		resetErrorText();
		try{
			let input = store.at(-1);
			let newStore = store.slice();
			if(result){
				input = SpecialToken.Ans;
				newStore = [input];
			}

			if(SpecialTokens.includes(tkn)){
				newStore[newStore.length-1] = tkn;
			}else if(OperationTokens.includes(tkn)){
				if(input){
					newStore.push(tkn);
					newStore.push("");
				}else{
					if(newStore.length <= 1){
						newStore[0] = "0";
						newStore[1] = tkn;
						newStore[2] = input;
					}else{
						newStore[newStore.length-2] = tkn;
					}
				}
			}
			
			setStore(newStore);

		}catch(err){
			if(err instanceof Error){
				setErrorText(err.message);
			}
			console.error(err);
		}
		resetResult();
	}
	function inputValue(val, replace=false, parse=true){
		resetErrorText();
		try{
			
			let inp = `${val}`;
			let input = store.at(-1);
			let newStore = store.slice();
			if(result){
				input = "";
				newStore = [input];
			}

			if(input && !replace){
				inp = `${input}${val}`;
			}
			if(parse){
				inp = parseInput(inp);
			}

			newStore[newStore.length-1] = inp;
			setStore(newStore);

		}catch(err){
			if(err instanceof Error){
				setErrorText(err.message);
			}
			console.error(err);
		}
		resetResult();
	}
	function clearInput(){
		resetErrorText();
		try{
			let newStore = store.slice();
			newStore[newStore.length-1] = "";
			setStore(newStore);
		}catch(err){
			if(err instanceof Error){
				setErrorText(err.message);
			}
			console.error(err);
		}
		resetResult();
	}
	function clearStore(){
		resetErrorText();
		try{
			setStore([""]);
		}catch(err){
			if(err instanceof Error){
				setErrorText(err.message);
			}
			console.error(err);
		}
		resetResult();
	}
	function resetErrorText(){
		setErrorText("");
	}
	function resetResult(){
		setResult("");
	}

	function onStart(){
		let sync = createSync();

		function onCreate(res){
			if(res.sync.id != sync.id) return;
			
			console.log(res);
		}
		if(socket?.connected && id){
			socket.emit("Create", { id, sync});
			socket.on("Create", onCreate);
			
			getHistory();
		}
	}

	socket?.on("connect", onStart);
	if(!socket?.connected){
		socket.connect();
	}

	useEffect(()=>{
		console.log(socket);

		return () => {
			socket.off('connect', onStart);
		};
	}, []);

	let hex = "123456789ABCDEF0";

	let valButtons = hex.split("").map((char)=>{
		return (
			<Btn 
				onclick={(e)=>{
					e.stopPropagation();
					inputValue(char);
				}}
				key={char}
			>
				{char}
			</Btn>
		)
	});

	let _store = store.slice();
	if(!result){
		_store.pop();
	}else{
		_store.push("=");
	}

	let tokens = _store.map((tkn, i)=>{
		if(tkn){
			tkn = tkn.replace(SpecialToken.Ans, "Ans");
			return (
				<Tkn key={i}>{tkn}</Tkn>
			)
		}
	})
	if(!tokens.length){
		tokens.push(<Tkn key={0}> </Tkn>);
	}

	let histories = history.map((hist, i)=>{
		if(hist){
			let input = (hist.input as string).replace(SpecialToken.Ans, "Ans");
			let output = hist.output;
			return (
				<HistoryItem key={i} onclick={(e)=>{
					e.preventDefault();
					e.stopPropagation();

					// let tkns = streamToTokens(input);
					
					// setStore(tkns);
					inputValue(output, true);
				}}>
					{input} = {output}
				</HistoryItem>
			)
		}
	})

	let display = result || store.at(-1) || "0";
	display = display.replace(SpecialToken.Ans, "Ans");

	return (
	  <div className="calc-container grid grid-cols-4 gap-2">
		<nav className="col-span-1 rounded bg-c5-100 grid grid-rows-12 overflow-hidden">
		  <div className="row-span-1 bg-c5-200 pl-4 m-0 flex justify-start items-center">
			<span className="h-fit">History</span>
		  </div>
		  <div className="calc-history row-span-9 bg-c5-100 p-3 overflow-auto overflow-x-hidden">
			{histories}
		  </div>
		  <div className="calc-history-ctrl row-span-2 bg-c5-200 flex justify-center items-center p-1 gap-3">
			<Btn onclick={(e)=>{
				e.stopPropagation();
				clearHistory();
			}}>Clear</Btn>
			<Btn onclick={(e)=>{
				e.stopPropagation();
				addToken(SpecialToken.Ans);
			}}>Ans</Btn>
		  </div>
		</nav>
		<main className="col-span-3">
		  <div className="calculator">
			<div className="calc-display">
			  <div className="calc-tokens">
				{tokens}
			  </div>
			  <div className="calc-input row-span-6 p-2 border rounded border-c5-300 flex justify-end items-center">
				<div className="calc-input-text text-4xl truncate">
					{display}
				</div>
			  </div>
			</div>
			<div className="calc-err row-span-1">
				<span className="calc-err-text text-c2-700">{errorText}</span>
			</div>
			<div className="calc-btns row-span-6 p-0 grid grid-cols-6">
			  <div className="calc-digits col-span-4 grid grid-cols-4 grid-rows-4 gap-1 m-0">
				{valButtons}
			  </div>
			  <div className="calc-ops col-span-2 grid grid-cols-2 grid-rows-4 gap-1 ml-2">
				<Btn onclick={(e)=>{
					e.stopPropagation();
					clearInput();
				}}>CE</Btn> 
				<Btn onclick={(e)=>{
					e.stopPropagation();
					clearStore();
				}}>AC</Btn>
				<Btn onclick={(e)=>{
					e.stopPropagation();
					addToken("+");
				}}>+</Btn> 
				<Btn onclick={(e)=>{
					e.stopPropagation();
					addToken("-");
				}}>-</Btn>
				<Btn onclick={(e)=>{
					e.stopPropagation();
					addToken("*");
				}}>×</Btn> 
				<Btn onclick={(e)=>{
					e.stopPropagation();
					addToken("/");
				}}>÷</Btn>
				<Btn colspan={2} onclick={(e)=>{
					e.stopPropagation();
					calculate();
				}}>=</Btn>
			  </div>
			  
			</div>
		  </div>
		</main>
	  </div>
	)
  }
  