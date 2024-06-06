import { MouseEventHandler, useEffect, useState } from "react";
import { Socket } from 'socket.io-client';
import * as MY from "@catsums/my";
import { parseInput } from "../processing";
import { Calculator } from "../storage";
import { CalcError } from "../calc_errors";

export function createSync(){
	return {
		time: Date.now(),
		id: MY.randomID(),
	}
}

interface IPropsWithChildren {
	children: React.ReactNode;
}


export function Tkn({ children }: IPropsWithChildren) {
	return (
	  <span className="calc-token ">
		{children}
	  </span>
	)
}


export function HistoryItem({children}:IPropsWithChildren) {
	return (
		<span className="calc-history-item">
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
}

export default function CalculatorApp({socket}:ICalculatorProps) {

	const [store, setStore] = useState([""]);
	const [history, setHistory] = useState([]);
	const [errorText, setErrorText] = useState("");

	function addToken(tkn){
		resetErrorText();
		try{
			let input = store.at(-1);
			let newStore = store.slice();
			
			if(input){
				newStore.push(tkn);
				newStore.push("");
			}else{
				if(newStore.length <= 1){
					newStore[0] = "0";
					newStore[1] = tkn;
				}else{
					newStore[newStore.length-2] = tkn;
				}
			}
			setStore(newStore);

		}catch(err){
			if(err instanceof Error){
				setErrorText(err.message);
			}
			console.error(err);
		}
	}
	function inputValue(val){
		resetErrorText();
		try{
			let inp = `${val}`;
			let input = store.at(-1);

			if(input){
				inp = `${input}${val}`;
			}
			inp = parseInput(inp);

			let newStore = store.slice();
			newStore[newStore.length-1] = inp;
			setStore(newStore);

		}catch(err){
			if(err instanceof Error){
				setErrorText(err.message);
			}
			console.error(err);
		}
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
	}
	function resetErrorText(){
		setErrorText("");
	}

	useEffect(()=>{
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

	let tokens = store.map((tkn, i)=>{
		if(tkn && i < store.length-1){
			return (
				<Tkn key={i}>{tkn}</Tkn>
			)
		}
	})

	return (
	  <div className="grid grid-cols-4 gap-2">
		<nav className="col-span-1 rounded bg-c5-100 grid grid-rows-12">
		  <div className="row-span-1 bg-c5-200 pl-4 m-0 flex justify-start items-center">
			<span className="h-fit">History</span>
		  </div>
		  <div className="calc-history row-span-9 bg-c5-100 p-3">
			<HistoryItem>12A + 1 = 12B</HistoryItem>
			<HistoryItem>1C - 3 = 19</HistoryItem>
		  </div>
		  <div className="calc-history-ctrl row-span-2 bg-c5-200">
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
					{store.at(-1) || "0"}
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
				<Btn colspan={2} onclick={()=>{}}>=</Btn>
			  </div>
			  
			</div>
		  </div>
		</main>
	  </div>
	)
  }
  