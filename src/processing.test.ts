
import {describe, test, expect, jest} from "@jest/globals";

process.env.NODE_ENV = "development";

import { HEXtoDEC, DECtoHEX, parseInput, parseOutput } from "./processing";
import { CalcError, InfinityCalcError, InvalidDecCalcError, InvalidHexCalcError, NegativeValueCalcError, UndefinedCalcError } from "./calc_errors";

describe("Test Processing inputs into valid inputs", () => {

	describe("Test valid inputs", () => {
		let tests = {
			"12" : "12",
			"B" : "B",
			"fF" : "FF",
			"123" : "123",
			"100" : "100",
			"12a" : "12A",
			"10" : "10",
			" abc " : "ABC",
			"e3    " : "E3",
			"   D18" : "D18",
		}

		for(let [k,v] of Object.entries(tests)) {
			test(`Test parseInput(${k})`, () => {
				let actual = parseInput(k);
	
				expect(actual).toBe(v);
			})
		}
	});

	describe("Test leading zero inputs", () => {
		let tests = {
			"00b" : "B",
			"09" : "9",
			"0A0" : "A0",
			"0" : "0",
			"00" : "0",
			"000" : "0",
			"0 0 9" : "9",
			"   0ffe" : "FFE",
			"" : "",
		}

		for(let [k,v] of Object.entries(tests)) {
			test(`Test parseInput(${k})`, () => {
				let actual = parseInput(k);
	
				expect(actual).toBe(v);
			})
		}
	});

	describe("Test rejecting invalid inputs", () => {
		let tests = {
			"34G" : "34",
			"meow" : "E",
			"kis" : "",
			"opqr" : "",
			"fish" : "F",
			"DIED" : "DED",
			"9-F" : "9F",
		}

		for(let [k,v] of Object.entries(tests)) {
			test(`Test parseInput(${k})`, () => {
				let actual = parseInput(k);

				expect(actual).toBe(v);
			});
		}
	});

	describe("Test ignore decimal inputs", () => {
		let tests = {
			"34.23" : "34",
			"AB.1" : "AB",
			".9000" : "",
			"1.0" : "1",
			"1234.5678" : "123",
		}

		for(let [k,v] of Object.entries(tests)) {
			test(`Test parseInput(${k})`, () => {
				let actual = parseInput(k);

				expect(actual).toBe(v);
			});
		}
	});
	
	describe("Test limit input size", () => {
		let tests = {
			"CADE" : "CAD",
			"DEAF" : "DEA",
			"42069911" : "420",
			"1234567890" : "123",
		}

		for(let [k,v] of Object.entries(tests)) {
			test(`Test parseInput(${k})`, () => {
				let actual = parseInput(k);

				expect(actual).toBe(v);
			});
		}
	});

	describe("Test filtering input", () => {
		let tests = {
			"234RaT" : "234",
			"Tea 20" : "EA2",
			"Poisson H0n H0n H0n" : "0",
			"g00ner" : "E",
			"Y9(#}&CIyheHv2" : "9CE",
			"ABI64C93%" : "AB6",
			" ( 9000 ) " : "900",
			"02\nF1" : "2F1",
		}

		for(let [k,v] of Object.entries(tests)) {
			test(`Test parseInput(${k})`, () => {
				let actual = parseInput(k);

				expect(actual).toBe(v);
			});
		}
	});

	describe("Test throw error for negative inputs", () => {
		let tests = {
			"-34" : NegativeValueCalcError,
			"-1" : NegativeValueCalcError,
			"-0" : NegativeValueCalcError,
			"-" : NegativeValueCalcError,
			"-321.0" : NegativeValueCalcError,
			"  -888" : NegativeValueCalcError,
			"-rm" : NegativeValueCalcError,
			"jk-90" : NegativeValueCalcError,
			"ea-on" : "EA",
		}

		for(let [k,v] of Object.entries(tests)) {
			test(`Test parseInput(${k})`, () => {
				try{
					let actual = parseInput(k);
		
					expect(actual).toBe(v);
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

describe("Test HEX to DEC conversion", () => {
	describe("Test valid values", () => {
		let tests = {
			"2" : "2",
			"B" : "11",
			"12" : "18",
			"100" : "256",
			"26B" : "619",
			"1f" : "31",
			"b41" : "2881",
			"  34  " : "52",
			"  b1" : "177",
			"7CE   " : "1998",
			"" : "0",
		}
	
		for(let [k,v] of Object.entries(tests)) {
			test(`Test HEXtoDEC(${k})`, () => {
				let actual = HEXtoDEC(k);
	
				expect(actual).toBe(v);
			});
		}
	});
	describe("Test leading zeroes values", () => {
		let tests = {
			"0" : "0",
			"001" : "1",
			"0A" : "10",
			"0340" : "832",
			" 019F " : "415",
		}
	
		for(let [k,v] of Object.entries(tests)) {
			test(`Test HEXtoDEC(${k})`, () => {
				let actual = HEXtoDEC(k);
	
				expect(actual).toBe(v);
			});
		}
	});
	describe("Test decimal values", () => {
		let tests = {
			"3.14" : "3",
			".9" : "0",
			"12.11" : "18",
			"0001B.4" : "27",
			"0.0" : "0",
			"4.3.2.1" : "4",
			"c9." : "201",
		}
	
		for(let [k,v] of Object.entries(tests)) {
			test(`Test HEXtoDEC(${k})`, () => {
				let actual = HEXtoDEC(k);
	
				expect(actual).toBe(v);
			});
		}
	});
	describe("Test for invalid values", () => {
		let tests = {
			"p" : InvalidHexCalcError,
			"rat" : InvalidHexCalcError,
			" a b" : InvalidHexCalcError,
			"0 2 4" : InvalidHexCalcError,
			"+1" : InvalidHexCalcError,
			"2f%" : InvalidHexCalcError,
		}
	
		for(let [k,v] of Object.entries(tests)) {
			test(`Test HEXtoDEC(${k})`, () => {
				try{
					let actual = HEXtoDEC(k);
		
					expect(actual).toBe(v);
					
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
	describe("Test for negative values", () => {
		let tests = {
			"-f" : NegativeValueCalcError,
			"-1.2" : NegativeValueCalcError,
			"-3.14" : NegativeValueCalcError,
			"-c&" : NegativeValueCalcError,
			"9-0" : InvalidHexCalcError,
			"--5" : NegativeValueCalcError,
			"ee---" : InvalidHexCalcError,
			"-4-5-1" : NegativeValueCalcError,
			"- 8" : NegativeValueCalcError,
			" 1- 8" : InvalidHexCalcError,
			"-p-" : NegativeValueCalcError,
		}
	
		for(let [k,v] of Object.entries(tests)) {
			test(`Test HEXtoDEC(${k})`, () => {
				try{
					let actual = HEXtoDEC(k);
		
					expect(actual).toBe(v);
					
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


describe("Test Processing Outputs into valid outputs", () => {

	describe("Test valid outputs", () => {
		let tests = {
			"12" : "12",
			"B" : "B",
			"fF" : "FF",
			"12a" : "12A",
			"09" : "9",
			"CADE" : "CADE",
			"10" : "10",
			"11230" : "11230",
			"7ABC" : "7ABC",
			"0A1" : "A1",
			"000111" : "111",
			"34 " : "34",
			" ae24" : "AE24",
			"" : "0",
		}

		for(let [k,v] of Object.entries(tests)) {
			test(`Test parseOutput(${k})`, () => {
				let actual = parseOutput(k);

				expect(actual).toBe(v);
			});
		}
	});

	describe("Test limit characters by trimming right to left", () => {
		let tests = {
			"00000009" : "9",
			"1234567890" : "567890",
			"23239" : "23239",
			"123ABC456DEF" : "456DEF",
			"7ABCABC7" : "BCABC7",
			"100001111" : "1111",
		}

		for(let [k,v] of Object.entries(tests)) {
			test(`Test parseOutput(${k})`, () => {
				let actual = parseOutput(k);

				expect(actual).toBe(v);
			});
		}
	});

	describe("Test throw error for negative outputs", () => {
		let tests = {
			"-34" : NegativeValueCalcError,
			"-A" : NegativeValueCalcError,
			"-0" : NegativeValueCalcError,
			"-ABC" : NegativeValueCalcError,
			"-" : NegativeValueCalcError,
			"-2B2D" : NegativeValueCalcError,
		}

		for(let [k,v] of Object.entries(tests)) {
			test(`Test parseOutput(${k})`, () => {
				try{
					let actual = parseOutput(k);
		
					expect(actual).toBe(v);
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
	describe("Test throw error for NaN and Infinity outputs", () => {
		let tests = {
			"Infinity" : InfinityCalcError,
			"infinity" : InfinityCalcError,
			"NaN" : UndefinedCalcError,
			"Nan" : UndefinedCalcError,
		}

		for(let [k,v] of Object.entries(tests)) {
			test(`Test parseOutput(${k})`, () => {
				try{
					let actual = parseOutput(k);
		
					expect(actual).toBe(v);
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
	describe("Test throw error for invalid outputs", () => {
		let tests = {
			"invalidHere" : InvalidHexCalcError,
			"EAR" : InvalidHexCalcError,
			"B A S E D" : InvalidHexCalcError,
			"A-B" : InvalidHexCalcError,
			"a bc" : InvalidHexCalcError,
		}

		for(let [k,v] of Object.entries(tests)) {
			test(`Test parseOutput(${k})`, () => {
				try{
					let actual = parseOutput(k);
		
					expect(actual).toBe(v);
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

describe("Test DEC to HEX conversion", () => {
	describe("Test valid values", () => {
		let tests = {
			"0" : "0",
			"8" : "8",
			"10" : "A",
			"2200" : "898",
			"125" : "7D",
			" 69" : "45",
			"111 " : "6F",
			" 890 " : "37A",
			"" : "0",
			"   " : "0",
		}
		
		for(let [k,v] of Object.entries(tests)) {
			test(`Test DECtoHEX(${k})`, () => {
				let actual = DECtoHEX(k);
				
				expect(actual).toBe(v);
			});
		}
	});
	describe("Test for decimal values", () => {
		let tests = {
			"2.5" : "3",
			"3.14" : "3",
			"0.91" : "1",
			"22.00" : "16",
			"23.01" : "17",
			"   0.01" : "0",
		}
		
		for(let [k,v] of Object.entries(tests)) {
			test(`Test DECtoHEX(${k})`, () => {
				let actual = DECtoHEX(k);
				
				expect(actual).toBe(v);
			});
		}
	});
	describe("Test for invalid values", () => {
		let tests = {
			"AB" : InvalidDecCalcError,
			"gill" : InvalidDecCalcError,
			"0 1" : InvalidDecCalcError,
			" 78 .1" : InvalidDecCalcError,
			"-f" : InvalidDecCalcError,
			"0.1%" : InvalidDecCalcError,
			"\n8\n1" : InvalidDecCalcError,
		}

		for(let [k,v] of Object.entries(tests)) {
			test(`Test DECtoHEX(${k})`, () => {
				try{
					let actual = DECtoHEX(k);
		
					expect(actual).toBe(v);
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

	describe("Test throw error for negative values", () => {
		let tests = {
			"-34" : NegativeValueCalcError,
			"-1" : NegativeValueCalcError,
			"-0" : NegativeValueCalcError,
			"-321.0" : NegativeValueCalcError,
		}

		for(let [k,v] of Object.entries(tests)) {
			test(`Test DECtoHEX(${k})`, () => {
				try{
					let actual = DECtoHEX(k);
		
					expect(actual).toBe(v);
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
	describe("Test throw error and NaN and Infinity conversions", () => {
		let tests = {
			"Infinity" : InfinityCalcError,
			[Infinity] : InfinityCalcError,
			[NaN] : UndefinedCalcError,
			"NaN" : UndefinedCalcError,
		}

		for(let [k,v] of Object.entries(tests)) {
			test(`Test DECtoHEX(${k})`, () => {
				try{
					let actual = DECtoHEX(k);
		
					expect(actual).toBe(v);
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