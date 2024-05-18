
import {describe, test, expect, jest} from "@jest/globals";

import { Operators } from "./operators";
import { CalcError, InfinityCalcError, InvalidDecCalcError, InvalidHexCalcError, NegativeValueCalcError, UndefinedCalcError } from "./calc_errors";

const {
	Add, Subtract, Multiply, Divide,
} = Operators;

describe("Test for Operators", () => {
	describe("Test Addition", () => {
		let tests = [
			["1","2", "3"],
			["B","4", "F"],
			["23","c8", "EB"],
			["20","1", "21"],
			["0","0", "0"],
			["70","020", "90"],
			["0","01", "1"],
			["","3", "3"],
			["y","p", InvalidHexCalcError],
			["abc","abc", "1578"],
			["000001","00000002", "3"],
			["B","000C02", "C0D"],
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

	describe("Test Subtraction", () => {
		let tests = [
			["3","1", "2"],
			["F","4", "B"],
			["EB","c8", "23"],
			["21","20", "1"],
			["0","0", "0"],
			["0","1", NegativeValueCalcError],
			["090","20", "70"],
			["01","0000", "1"],
			["","3", NegativeValueCalcError],
			["y","p", InvalidHexCalcError],
			["abc","abc", "0"],
			["000003","00000001", "2"],
			["C0D","0000B", "C02"],
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

	describe("Test Multiplication", () => {
		let tests = [
			["3","1", "3"],
			["F","5", "4B"],
			["E","c8", "AF0"],
			["21","20", "420"],
			["0","0", "0"],
			["000","1", "0"],
			["090","20", "1200"],
			["01","00040", "40"],
			["","3", "0"],
			["y","p", InvalidHexCalcError],
			["abc","-abc", NegativeValueCalcError],
			["000003","00000001", "3"],
			["C0D","0000B", "848F"],
			["-1","-3", NegativeValueCalcError],
			["FFf","ffF", "FFE001"],
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

	describe("Test Division", () => {
		let tests = [
			["3","1", "3"],
			["4B","F", "5"],
			["Af0","e", "C8"],
			["420","20", "21"],
			["a","4", "3"],
			["0","1", "0"],
			["0100","1", "100"],
			["1","000", InfinityCalcError],
			["0","000", UndefinedCalcError],
			["1200","020", "90"],
			["01","00040", "0"],
			["","3", "0"],
			["y","p", InvalidHexCalcError],
			["abc","-abc", NegativeValueCalcError],
			["-2","-4", NegativeValueCalcError],
			["000003","00000001", "3"],
			["848f","0000B", "C0D"],
			["FFf","ffe", "1"],
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