/// <reference lib="dom" />

import "../happydom"

import {render, screen, fireEvent} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// import '@testing-library/jest-dom'

import App from "./App";
import { HEXTokens, OperationTokens } from './storage';

import {app, changePort, clients, server, ioServer, DBdelete, DBreset, createSync} from "./api";
import { randomID } from '@catsums/my';
import { closeDB } from "./db";

const {spyOn} = jest;

let appElem:HTMLElement;
let spyInstances = [];

function getLocalStorage(){
	return {...localStorage};
}



function simulateButtonPresses(presses:string[], btnmap:{[key:string]:HTMLButtonElement}){
	for(let press of presses){
		let btn = btnmap[press];
		if(!btn) continue;

		fireEvent.mouseEnter(btn);
		fireEvent.mouseOver(btn);
		fireEvent.click(btn);
		fireEvent.mouseOut(btn);
		fireEvent.mouseLeave(btn);
	}
}

describe("Testing App", ()=>{
	let calcElem:HTMLElement;
	beforeEach(()=>{
		let {container} = render(<App/>);
		appElem = container;
		calcElem = appElem.querySelector(".calculator");
	});

	describe("Test UI at initial state", ()=>{
		test("Test initial display", ()=>{
			
			let displayElem = calcElem.querySelector(".calc-input-text");
			let tokenElems = calcElem.querySelectorAll(".calc-token");
			let historyElems = calcElem.querySelectorAll(".calc-history-item");
			let errorTextElem = calcElem.querySelector(".calc-err-text");
			let localStore = getLocalStorage();
			
			expect(displayElem.innerHTML).toBe("0");
			expect(tokenElems).toHaveLength(1);
			expect(historyElems).toHaveLength(0);
			expect(localStore).toHaveProperty("clientID");
			expect(errorTextElem.innerHTML).toBe("");

			let btns = Array.from(calcElem.querySelectorAll<HTMLButtonElement>(".calc-btn"));

			let btnmap = btns.reduce(function(map, btn) {
				let id = btn.getAttribute("id");
				map[id] = btn;
				return map;
			}, {}) as {[key:string] : HTMLButtonElement};

			let btnTokens = HEXTokens.reduce(function(map, tkn) {
				map[tkn] = tkn;
				return map;
			}, {}) as {[key:string] : string};
			btnTokens["+"] = "+";
			btnTokens["-"] = "-";
			btnTokens["*"] = "×";
			btnTokens["/"] = "÷";
			btnTokens["="] = "=";
			btnTokens["AC"] = "AC";
			btnTokens["CE"] = "CE";
			

			for(let btnToken of Object.keys(btnTokens)) {
				let btn = btnmap[btnToken];

				expect(btn.innerText).toBe(btnTokens[btnToken]);
			}
			
		})
	})
	describe("Test UI buttons state", ()=>{
		describe("Test button actions", ()=>{

			let btns:HTMLButtonElement[];
			let btnmap:{ [key:string] : HTMLButtonElement };
			afterEach(()=>{
				simulateButtonPresses(["CE"], btnmap);
			})
			let inputMap = [
				{
					stream: "1".split(''),
					display: "1",
					tkns: [" "],
				},
				{
					stream: "3+2".split(''),
					display: "2",
					tkns: "3+".split(''),
				},
				{
					stream: "7-".split(''),
					display: "0",
					tkns: "7-".split(''),
				},
				{
					stream: "C*36*AB-1A9".split(''),
					display: "1A9",
					tkns: ["C","*","36","*","AB","-"],
				},
				{
					stream: ["0","0","0"],
					display: "0",
					tkns: [" "],
				},
				{
					stream: ["1","+","1","="],
					display: "1",
					tkns: ["1","+"],
				},
				{
					stream: ["3","5","CE","E","+","CE","1","3"],
					display: "13",
					tkns: ["E","+"],
				},
			]

			for(let {stream, display, tkns} of inputMap){
				test(`Test button stream ${stream}`,()=>{
					btns = Array.from(appElem.querySelectorAll<HTMLButtonElement>(".calc-container .calc-btn"));
		
					btnmap = btns.reduce(function(map, btn) {
						let id = btn.getAttribute("id");
						map[id] = btn;
						return map;
					}, {});

					simulateButtonPresses(stream, btnmap);

					let displayElem = calcElem.querySelector<HTMLElement>(".calc-input-text");
					let tokenElems = Array.from(calcElem.querySelectorAll<HTMLElement>(".calc-token"));

					expect(displayElem.innerText).toBe(display);
					expect(tokenElems).toHaveLength(tkns.length);
					for(let i=0; i<tkns.length; i++){
						let tokenElem = tokenElems[i];
						let tkn = tkns[i];

						expect(tokenElem.innerText).toBe(tkn);
					}
				})
			}
			
		})
	})
})