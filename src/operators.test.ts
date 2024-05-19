
import {describe, test, expect, jest} from "@jest/globals";

import { Operators } from "./operators";
import { CalcError, InfinityCalcError, InvalidDecCalcError, InvalidHexCalcError, NegativeValueCalcError, UndefinedCalcError } from "./calc_errors";

const {
	Add, Subtract, Multiply, Divide,
} = Operators;

describe("Test for Operators", () => {
	
	describe("Test Addition", () => {
		describe("Test Valid inputs", () => {
			let tests = [
				["1","2", "3"],
				["B","4", "F"],
				["23","c8", "EB"],
				["20","1", "21"],
				["0","0", "0"],
				["0","3", "3"],
				["70","020", "90"],
				["abc","abc", "1578"],
				["fFF","ffF", "1FFE"],
			];
	
			for(let [a, b, ans] of tests){
				test(`Test Add(${a},${b})`, () => {
					try{
						let actual = Add.hexCalculate(a as string, b as string);
	
						expect(actual).toBe(ans);
					}catch(err){
						if(err instanceof CalcError){
							expect(err).toBeInstanceOf(ans);
						}else{
							throw err;
						}
					}
				});
			}
		});

		describe("Test Filtered inputs", () => {
			let tests = [
				["001","2", "3"],
				["0000001","000002", "3"],
				["70","020", "90"],
				["0","01", "1"],
				["1.1","2.3", "3"],
				["9F.5","0.5", "9F"],
				["","3", "3"],
				["e","", "E"],
				["ab","  ", "AB"],
				["","  ", "0"],
				["B","0000C02", "C0D"],
			];
	
			for(let [a, b, ans] of tests){
				test(`Test Add(${a},${b})`, () => {
					try{
						let actual = Add.hexCalculate(a as string, b as string);
	
						expect(actual).toBe(ans);
					}catch(err){
						if(err instanceof CalcError){
							expect(err).toBeInstanceOf(ans);
						}else{
							throw err;
						}
					}
				});
			}
		});

		describe("Test Invalid inputs", () => {
			let tests = [
				["-1","1", NegativeValueCalcError],
				["y","p", InvalidHexCalcError],
				["-1","-1", NegativeValueCalcError],
				// ["Infinity","1", InfinityCalcError],
				["1/0","3", InvalidHexCalcError],
				["b","g", InvalidHexCalcError],
				["you","", InvalidHexCalcError],
				// ["B","NaN", UndefinedCalcError],
			];
	
			for(let [a, b, ans] of tests){
				test(`Test Add(${a},${b})`, () => {
					try{
						let actual = Add.hexCalculate(a as string, b as string);
	
						expect(actual).toBe(ans);
					}catch(err){
						if(err instanceof CalcError){
							expect(err).toBeInstanceOf(ans);
						}else{
							throw err;
						}
					}
				});
			}
		});
	});

	describe("Test Subtraction", () => {

		describe("Test valid inputs", () => {
			let tests = [
				["3","1", "2"],
				["F","4", "B"],
				["EB","c8", "23"],
				["21","20", "1"],
				["0","0", "0"],
				["3","0", "3"],
				["abc","abc", "0"],
				["FFE","ff0", "E"],
			];
	
			for(let [a, b, ans] of tests){
				test(`Test Subtract(${a},${b})`, () => {
					try{
						let actual = Subtract.hexCalculate(a as string, b as string);
	
						expect(actual).toBe(ans);
					}catch(err){
						if(err instanceof CalcError){
							expect(err).toBeInstanceOf(ans);
						}else{
							throw err;
						}
					}
				});
			}
		});

		describe("Test filtered inputs", () => {
			let tests = [
				["090","20", "70"],
				["01","0000", "1"],
				["000003","00000001", "2"],
				["  C0D","  0B", "C02"],
				["C0D   ","00008  ", "C05"],
				["AB ","", "AB"],
				[" ","0", "0"],
				["","   ", "0"],
			];
	
			for(let [a, b, ans] of tests){
				test(`Test Subtract(${a},${b})`, () => {
					try{
						let actual = Subtract.hexCalculate(a as string, b as string);
	
						expect(actual).toBe(ans);
					}catch(err){
						if(err instanceof CalcError){
							expect(err).toBeInstanceOf(ans);
						}else{
							throw err;
						}
					}
				});
			}
		});

		describe("Test invalid inputs and outputs", () => {
			let tests = [
				["-1","-1", NegativeValueCalcError],
				["-F","3", NegativeValueCalcError],
				["4","-2", NegativeValueCalcError],
				["y","p", InvalidHexCalcError],
				// ["Infinity","c8", InfinityCalcError],
				["0","1", NegativeValueCalcError],
				["A","F", NegativeValueCalcError],
				[" BA","g", InvalidHexCalcError],
				["","8", NegativeValueCalcError],
				["abc","abc", "0"],
				["0.3","1", NegativeValueCalcError],
			];
	
			for(let [a, b, ans] of tests){
				test(`Test Subtract(${a},${b})`, () => {
					try{
						let actual = Subtract.hexCalculate(a as string, b as string);
	
						expect(actual).toBe(ans);
					}catch(err){
						if(err instanceof CalcError){
							expect(err).toBeInstanceOf(ans);
						}else{
							throw err;
						}
					}
				});
			}
		});
		

	});

	describe("Test Multiplication", () => {

		describe("Test valid inputs", () => {
			let tests = [
				["3","1", "3"],
				["F","5", "4B"],
				["E","c8", "AF0"],
				["21","20", "420"],
				["FFf","ffF", "FFE001"],
				["0","0", "0"],
				["0","3", "0"],
			];

			for(let [a, b, ans] of tests){
				test(`Test Multiply(${a},${b})`, () => {
					try{
						let actual = Multiply.hexCalculate(a as string, b as string);
	
						expect(actual).toBe(ans);
					}catch(err){
						if(err instanceof CalcError){
							expect(err).toBeInstanceOf(ans);
						}else{
							throw err;
						}
					}
				});
			}
		});
		
		describe("Test filtered inputs", () => {
			let tests = [
				["2  ","  a", "14"],
				["090","20", "1200"],
				["B","c.9", "84"],
				["3.1","5.5", "F"],
				["01","00040", "40"],
				["","F", "0"],
				["  ","4", "0"],
				[""," ", "0"],
				["","", "0"],
				["000003","00000003", "9"],
				["C0D","0000B", "848F"],
			];

			for(let [a, b, ans] of tests){
				test(`Test Multiply(${a},${b})`, () => {
					try{
						let actual = Multiply.hexCalculate(a as string, b as string);
	
						expect(actual).toBe(ans);
					}catch(err){
						if(err instanceof CalcError){
							expect(err).toBeInstanceOf(ans);
						}else{
							throw err;
						}
					}
				});
			}
		});

		describe("Test invalid inputs and outputs", () => {
			let tests = [
				["-3","1", NegativeValueCalcError],
				["a","-F", NegativeValueCalcError],
				["y","p", InvalidHexCalcError],
				["1efg","89", InvalidHexCalcError],
				["1","w", InvalidHexCalcError],
				["abc","-abc", NegativeValueCalcError],
				// ["abc","Infinity", InfinityCalcError],
				// ["Infinity","7", InfinityCalcError],
				// ["Infinity","Infinity", InfinityCalcError],
				// ["0","NaN", UndefinedCalcError],
				["-1","-3", NegativeValueCalcError],
			];

			for(let [a, b, ans] of tests){
				test(`Test Multiply(${a},${b})`, () => {
					try{
						let actual = Multiply.hexCalculate(a as string, b as string);
	
						expect(actual).toBe(ans);
					}catch(err){
						if(err instanceof CalcError){
							expect(err).toBeInstanceOf(ans);
						}else{
							throw err;
						}
					}
				});
			}
		});

	});

	describe("Test Division", () => {
		describe("Test valid inputs", () => {

			let tests = [
				["3","1", "3"],
				["4","2", "2"],
				["A","5", "2"],
				["a","4", "3"],
				["4B","F", "5"],
				["Af0","e", "C8"],
				["420","20", "21"],
				["abc","ABc", "1"],
				["FFf","ffe", "1"],
				["0","1", "0"],
			];
	
			for(let [a, b, ans] of tests){
				test(`Test Divide(${a},${b})`, () => {
					try{
						let actual = Divide.hexCalculate(a as string, b as string);
	
						expect(actual).toBe(ans);
					}catch(err){
						if(err instanceof CalcError){
							expect(err).toBeInstanceOf(ans);
						}else{
							throw err;
						}
					}
				});
			}

		});

		describe("Test filtered inputs", () => {
			
			let tests = [
				["0100","1", "100"],
				["1200","020", "90"],
				["01","00040", "0"],
				["3c","4.0", "F"],
				["6.24"," 003.1400  ", "2"],
				["  003","00000001 ", "3"],
				["F.Ff","   f.fe", "1"],
				["848f","0000B", "C0D"],
				["","5", "0"],
				["  ","9  ", "0"],
			];
	
			for(let [a, b, ans] of tests){
				test(`Test Divide(${a},${b})`, () => {
					try{
						let actual = Divide.hexCalculate(a as string, b as string);
	
						expect(actual).toBe(ans);
					}catch(err){
						if(err instanceof CalcError){
							expect(err).toBeInstanceOf(ans);
						}else{
							throw err;
						}
					}
				});
			}

		});

		describe("Test invalid inputs and outputs", () => {
			
			let tests = [
				["-3","1", NegativeValueCalcError],
				["4B","-F", NegativeValueCalcError],
				["-Bf0","-e", NegativeValueCalcError],
				["01 00","1100", InvalidHexCalcError],
				["kis","lane", InvalidHexCalcError],
				["y","3", InvalidHexCalcError],
				["B","L", InvalidHexCalcError],
				["CADE","1%", InvalidHexCalcError],
				["4","0", InfinityCalcError],
				[" 1.0","000", InfinityCalcError],
				["0","0", UndefinedCalcError],
				["abc","-abc", NegativeValueCalcError],
				["-2","-4", NegativeValueCalcError],
				// ["1","Infinity", InfinityCalcError],
				// ["NaN","1", UndefinedCalcError],
			];
	
			for(let [a, b, ans] of tests){
				test(`Test Divide(${a},${b})`, () => {
					try{
						let actual = Divide.hexCalculate(a as string, b as string);
	
						expect(actual).toBe(ans);
					}catch(err){
						if(err instanceof CalcError){
							expect(err).toBeInstanceOf(ans);
						}else{
							throw err;
						}
					}
				});
			}

		});
	});
});