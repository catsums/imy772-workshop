import _ from 'lodash';
import { InvalidHexCalcError, NegativeValueCalcError } from './calc_errors';

export const HEX_CHARS = "0123456789ABCDEF";

const inputLimit = 3;
const outputLimit = 6;

const hexBase = 16;

export function parseInput(input: string): string {
	let parsed = "";

	//filter out invalid characters
	for(let char of input){
		if(HEX_CHARS.includes(char.toUpperCase())){
			parsed += char;
		}
	}

	//limit number of input characters
	parsed = parsed.substring(0, inputLimit);

	return parsed;
}

export function parseOutput(output: string){
	let parsed = "";

	//filter out invalid characters
	for(let char of output){
		if(HEX_CHARS.includes(char.toUpperCase())){
			parsed += char;
		}
	}

	//limit number of output characters (right to left)
	parsed = parsed.substring(parsed.length - outputLimit);

	return parsed;

}

export function HEXtoDEC(hexString: string): string {
	let sum = 0;
	
	//use uppercase
	hexString = hexString.toUpperCase();

	//throw error if HEX is negative
	if(hexString[0] === '-'){
		throw new NegativeValueCalcError(`${hexString} can't be processed because it's negative`, hexString);
	}

	//take integral number only
	hexString = hexString.split(".")[0];

	for(let i=0; i<hexString.length; i++){
		let index = (hexString.length - 1) - i;
		let hexDigit = HEX_CHARS.indexOf(hexString[i]);

		//throw error for invalid HEX digit
		if(hexDigit < 0){
			throw new InvalidHexCalcError(`${hexString} can't be processed because it's not a valid HEX value`, hexString);
		}
		let val = Math.pow(hexBase, index) * hexDigit;

		sum += val;
	}

	//throw error if sum is (somehow) negative
	if(sum < 0){
		throw new NegativeValueCalcError(`${sum} can't be processed because it became negative (somehow)`, sum);
	}

	return sum.toString();

}