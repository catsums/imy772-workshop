
import {describe, test, expect, jest} from "@jest/globals";

let mockAddToken = jest.fn((x, store) => {});
let mockCalculate = jest.fn((store) => "0");

describe("Test Storage from input stream", () => {
	test("Test inserting digit tokens", () => {
		let tests = {
			"1" : ["1"],
			"0" : ["0"],
			"05" : ["5"],
			"A1" : ["A1"],
			"bC4" : ["BC4"],
			"54321" : ["543"],
			"00100" : ["100"],
			"1.23" : ["123"],
			"3.14167" : ["314"],
			"" : [""],
			"you" : [""],
			"prime" : ["E"],
			"p0t" : ["0"],
			"A.bc" : ["ABC"],
			"paC" : ["AC"],
		};

		for(let [k,v] of Object.entries(tests)){
			let store = [];
			let actual = mockAddToken(k, store);

			expect(actual).toEqual(v);
		}
	});

	test("Test inserting operator tokens", () => {
		let tests = {
			"1+" : ["1","+"],
			"0-" : ["0","-"],
			"*" : [],
			"-1" : ["1"],
			"A1+2" : ["A1","+","2"],
			"1+2+3" : ["1","2","3"],
			"05-004-0003-002-01" : ["5","4","3","2","1"],
			"5+-" : ["5","-"],
			"1//" : ["1","/"],
			"1/3+9.2-5" : ["1","/","3","+","9","-","5"],
			"3.-+-+-+" : ["3","+"],
			"Y0U-ARE-A-F1SH" : ["0","-","AE","-","A","-","F1"],
		};

		for(let [k,v] of Object.entries(tests)){
			let store = [];
			let actual = mockAddToken(k, store);

			expect(actual).toEqual(v);
		}
	});

	test("Test calculating stores", () => {
		let tests = {
			"1+1": "2",
			"1+9": "A",
			"10-1": "F",
			"5*4": "14",
			"1+2-1": "2",
			"A/B+1": "2",
		};

		for(let [k,v] of Object.entries(tests)){
			let store = [];
			let actual = mockAddToken(k, store);

			expect(actual).toEqual(v);
		}
	});
});