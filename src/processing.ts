import _ from 'lodash';
import { InfinityCalcError, InvalidDecCalcError, InvalidHexCalcError, NegativeValueCalcError } from './calc_errors';

export const HEX_CHARS = "0123456789ABCDEF";

const inputLimit = 3;
const outputLimit = 6;

const hexBase = 16;

export function parseInput(input: string): string {
	let parsed = "";

	//filter out invalid characters
	for(let char of input){
		if(HEX_CHARS.includes(char.toUpperCase())){
			parsed += char.toUpperCase();
		}
		//if theres decimal point, stop at integral part
		if(char === '.'){
			break;
		}
	}

	//remove starting zeroes
	for(let i=0; i<parsed.length; i++){
		if(parsed[i] !== '0'){
			parsed = parsed.substring(i);
			break;
		}
		if(i == parsed.length-1){
			parsed = "0";
			break;
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
			parsed += char.toUpperCase();
		}
	}

	//limit number of output characters (right to left)
	parsed = parsed.substring(parsed.length - outputLimit);
	
	//remove starting zeroes
	for(let i=0; i<parsed.length; i++){
		if(parsed[i] !== '0'){
			parsed = parsed.substring(i);
			break;
		}
		if(i == parsed.length-1){
			parsed = "0";
			break;
		}
	}
	
	if(parsed.length <= 0){
		parsed = "0";
	}

	return parsed;

}

export function HEXtoDEC(hexString: string): string {
	let sum = 0;

	if(hexString.length <= 0){
		hexString += "0";
	}
	
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

export function DECtoHEX(decValue:(string|number)) : string{

	if(decValue.toString().length <= 0){
		decValue += "0";
	}

	let initValue = new Number(decValue.toString()) as number;
	//throw if infinity
	if(initValue == Infinity || initValue == -Infinity){
		throw new InfinityCalcError(`${initValue} is literally equivalent to infinity`, initValue);
	}
	//throw error if DEC value has invalid digits
	if(isNaN(initValue)){
		throw new InvalidDecCalcError(`${decValue} is not a valid DEC value`, decValue.toString());
	}
	//throw error if DEC value is negative
	if(initValue < 0){
		throw new NegativeValueCalcError(`${initValue} is negative and can't be processed`, initValue);
	}

	//remove decimal
	initValue = Math.round(initValue);

	let hexString = "";

	//stop when init value is less than 1 (only fraction)
	while(initValue >= 1){
		let quot = initValue / hexBase;
		let remainder = initValue % hexBase;

		hexString = HEX_CHARS[remainder].toUpperCase() + hexString;
		initValue = Math.trunc(quot);
	}

	//return 0 if string is empty
	if(hexString.length <= 0){
		hexString += "0";
	}

	return hexString;
}