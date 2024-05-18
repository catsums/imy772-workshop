
import {describe, test, expect, jest} from "@jest/globals";

import { HEXtoDEC, DECtoHEX, parseInput, parseOutput } from "./processing";
import { CalcError, InfinityCalcError, InvalidDecCalcError, InvalidHexCalcError, NegativeValueCalcError, UndefinedCalcError } from "./calc_errors";

describe("Test Processing inputs into valid inputs", () => {

	describe("Test valid inputs", () => {
		let tests = {
			"12" : "12",
			"B" : "B",
			"fF" : "FF",
			"12a" : "12A",
			"09" : "9",
			"10" : "10",
			"0A0" : "A0",
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

	describe("Test throw error for negative inputs", () => {
		let tests = {
			"-34" : NegativeValueCalcError,
			"-1" : NegativeValueCalcError,
			"-0" : NegativeValueCalcError,
			"-321.0" : NegativeValueCalcError,
			"-888" : NegativeValueCalcError,
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
			"Tea20" : "EA2",
			"PoissonH0nH0nH0n" : "0",
			"g00ner" : "E",
			"Y9(#}&CIyheHv2" : "9CE",
			"ABI64C93%" : "AB6",
			"(9000)" : "900",
		}

		for(let [k,v] of Object.entries(tests)) {
			test(`Test parseInput(${k})`, () => {
				let actual = parseInput(k);

				expect(actual).toBe(v);
			});
		}
	});

	describe("Test HEX to DEC conversion", () => {
		let tests = {
			"2" : "2",
			"B" : "11",
			"12" : "18",
			"100" : "256",
			"26B" : "619",
			"1f" : "31",
			"b41" : "2881",
		}

		for(let [k,v] of Object.entries(tests)) {
			test(`Test HEXtoDEC(${k})`, () => {
				let actual = HEXtoDEC(k);

				expect(actual).toBe(v);
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

	describe("Test DEC to HEX conversion", () => {
		let tests = {
			"0" : "0",
			"8" : "8",
			"10" : "A",
			"2.5" : "3",
			"3.14" : "3",
			"0.91" : "1",
			"2200" : "898",
			"125" : "7D",
			"69" : "45",
			"111" : "6F",
			"890" : "37A",
		}

		for(let [k,v] of Object.entries(tests)) {
			test(`Test DECtoHEX(${k})`, () => {
				let actual = DECtoHEX(k);

				expect(actual).toBe(v);
			});
		}
	});

	describe("Test throw error for negative, NaN and Infinity conversions", () => {
		let tests = {
			"-34" : NegativeValueCalcError,
			"-1" : NegativeValueCalcError,
			"-0" : NegativeValueCalcError,
			"-321.0" : NegativeValueCalcError,
			"Infinity" : InfinityCalcError,
			[Infinity] : InfinityCalcError,
			"gill" : InvalidDecCalcError,
			"invalidHere" : InvalidDecCalcError,
			[NaN] : InfinityCalcError,
		}

		for(let [k,v] of Object.entries(tests)) {
			test(`Test parseOutput(${k})`, () => {
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

	describe("Test throw error for negative, NaN and Infinity outputs", () => {
		let tests = {
			"-34" : NegativeValueCalcError,
			"-A" : NegativeValueCalcError,
			"-0" : NegativeValueCalcError,
			"-ABC" : NegativeValueCalcError,
			"-" : NegativeValueCalcError,
			"-2B2D" : NegativeValueCalcError,
			"Infinity" : InfinityCalcError,
			"invalidHere" : InvalidHexCalcError,
			"NaN" : UndefinedCalcError,
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