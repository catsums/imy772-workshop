
import {describe, test, expect, jest} from "@jest/globals";

import { processStore, Calculator } from "./storage";
import { CalcError } from "./calc_errors";


describe("Test Storage from input stream", () => {
	describe("Test inserting tokens", () => {
		describe("Test appending current token to blank current", ()=>{
			let tests = {
				"1" : ["1"],
				"0" : ["0"],
				"05" : ["5"],
				"A1" : ["A1"],
				"bC4" : ["BC4"],
				"54321" : ["543"],
				"54 Ab1" : ["54A"],
				"00100" : ["100"],
				"0 01" : ["1"],
				"1.23" : ["1"],
				"3.14167" : ["3"],
				"" : [],
				"you" : [""],
				"prime" : ["E"],
				"p0t" : ["0"],
				"A.bc" : ["A"],
				"paC" : ["AC"],
				"@" : [""],
			};
	
			for(let [k,v] of Object.entries(tests)){
				test(`Test appendCurrentToken(${k})`, () => {
					let calc = new Calculator();
					let stream = k;
	
					calc.appendCurrentToken(stream);
	
					let store = calc.getStore();
					let expectedStore = v;
	
					let curr = calc.current;
					let expectedCurr = v.at(-1);
					
					expect(store).toEqual(expectedStore);
					expect(expectedCurr).toEqual(curr);
				});
			}
		});

		describe(`Test appending current token to token "A"`, ()=>{
			let tests = {
				"1" : ["A1"],
				"0" : ["A0"],
				"05" : ["A05"],
				"A1" : ["AA1"],
				"bC4" : ["ABC"],
				"54321" : ["A54"],
				"54 Ab1" : ["A54"],
				"00100" : ["A00"],
				"0 01" : ["A00"],
				"1.23" : ["A1"],
				"3.14167" : ["A3"],
				"" : ["A"],
				"you" : ["A"],
				"prime" : ["AE"],
				"p0t" : ["A0"],
				"A.bc" : ["AA"],
				"paC" : ["AAC"],
				"@" : ["A"],
			};
	
			for(let [k,v] of Object.entries(tests)){
				test(`Test appendCurrentToken(${k})`, () => {
					let calc = new Calculator(["A"]);
					let stream = k;
	
					calc.appendCurrentToken(stream);
	
					let store = calc.getStore();
					let expectedStore = v;
	
					let curr = calc.current;
					let expectedCurr = v.at(-1);
					
					expect(store).toEqual(expectedStore);
					expect(expectedCurr).toEqual(curr);
				});
			}
		});

		describe("Test inserting input stream to blank current token", ()=>{
			let tests = {
				"1" : ["1"],
				"0" : ["0"],
				"05" : ["5"],
				"A1" : ["A1"],
				"bC4" : ["BC4"],
				"54321" : ["543"],
				"54 Ab1" : ["54A"],
				"00100" : ["100"],
				"0 01" : ["1"],
				"1.23" : ["123"],
				"3.14167" : ["314"],
				"" : [],
				"you" : [],
				"prime" : ["E"],
				"p0t" : ["0"],
				"A.bc" : ["ABC"],
				"paC" : ["AC"],
				"@" : ["@"],
				"3@" : ["3"],
			};
	
			for(let [k,v] of Object.entries(tests)){
				test(`Test processStream(${k})`, () => {
					let calc = new Calculator();
					let stream = k;
	
					calc.processStream(stream);
	
					let store = calc.getStore();
					let expectedStore = v;
	
					let curr = calc.current;
					let expectedCurr = v.at(-1);
					
					expect(store).toEqual(expectedStore);
					expect(expectedCurr).toEqual(curr);
				});
			}
		});
		describe(`Test adding tokens with blank current token`, () => {
			let tests = {
				"+" : [],
				"-" : [],
				"1" : ["1"],
				"15" : ["15"],
				"5+-" : [],
				"@" : ["@"],
				"1/3+0.9-5" : [],
				"3.1" : [],
				"k" : [],
				"m" : [],
				"-1" : [],
			};
	
			for(let [k,v] of Object.entries(tests)){
				test(`Test addToken(${k})`, () => {
					let calc = new Calculator();
					let stream = k;
	
					calc.addToken(stream);
	
					let store = calc.getStore();
					let expectedStore = v;
	
					let curr = calc.current;
					let expectedCurr = v.at(-1);
					
					expect(store).toEqual(expectedStore);
					expect(expectedCurr).toEqual(curr);
				});
			}
		});
		describe(`Test adding tokens with current token "A"`, () => {
			let tests = {
				"+" : ["A","+"],
				"-" : ["A","-"],
				"/" : ["A","/"],
				"*" : ["A","*"],
				"1" : ["A"],
				"15" : ["A"],
				"5+-" : ["A"],
				"@" : ["A"],
				"1/3+0.9-5" : ["A"],
				"3.1" : ["A"],
				"k" : ["A"],
				"m" : ["A"],
				"-1" : ["A"],
			};
	
			for(let [k,v] of Object.entries(tests)){
				test(`Test addToken(${k})`, () => {
					let calc = new Calculator(["A"]);
					let stream = k;
	
					calc.addToken(stream);
	
					let store = calc.getStore();
					let expectedStore = v;
	
					let curr = calc.current;
					let expectedCurr = v.at(-1);
					
					expect(store).toEqual(expectedStore);
					expect(expectedCurr).toEqual(curr);
				});
			}
		});

		describe("Test inserting input stream with operator tokens", () => {
			let tests = {
				"1+" : ["1","+"],
				"0-" : ["0","-"],
				"*" : [],
				"-1" : ["1"],
				"A1+2" : ["A1","+","2"],
				"1+2+3" : ["1","+","2","+","3"],
				"05-004-0003-002-01" : ["5","-","4","-","3","-","2","-","1"],
				"5+-" : ["5","-"],
				"1//" : ["1","/"],
				"1/3+0.9-5" : ["1","/","3","+","9","-","5"],
				"3.-+-+-+" : ["3","+"],
				"Y0U-ARE-A-F1SH" : ["0","-","AE","-","A","-","F1"],
				"@+9" : ["@","+","9"],
				"@ " : ["@"],
				"k" : [],
				"moo" : [],
				"woah" : ["A"],
				"8*@/+/3" : ["8","+","@","/","3"],
			};
	
			for(let [k,v] of Object.entries(tests)){
				test(`Test processStream(${k})`, () => {
					let calc = new Calculator();
					let stream = k;
	
					calc.processStream(stream);
	
					let store = calc.getStore();
					let expectedStore = v;
	
					let curr = calc.current;
					let expectedCurr = v.at(-1);
					
					expect(store).toEqual(expectedStore);
					expect(expectedCurr).toEqual(curr);
				});
			}
		});
	});


	describe(`Test calculating stores (where Ans = "A")`, () => {
		let tests = {
			"1+1": "2",
			"1+9": "A",
			"10-1": "F",
			"5*4": "14",
			"1+2-1": "2",
			"1+1+1+1*8": "B",
			"A/B+1": "2",
			"1+2*5-3/7*3+9": "13",
			"1+@": "B",
			"@-6": "4",
			"1@+@2-3@": "4",
		};

		for(let [k,v] of Object.entries(tests)){
			test(`Test processStore([${k}])`, () => {
				try{
					let calc = new Calculator();
					let stream = k;

					let history = ["0", "26C","34", "A"];

					calc.processStream(stream);

					let store = calc.getStore();

					let result = processStore(store, history);
					let expectedResult = v;
					
					expect(result).toEqual(expectedResult);
				}catch(err){
					if(err instanceof CalcError){
						expect(err).toBeInstanceOf(v);
					}else{
						throw err;
					}
				}
			});
		}
	});
});