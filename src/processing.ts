import _ from 'lodash';
import { InfinityCalcError, InvalidDecCalcError, InvalidHexCalcError, NegativeValueCalcError, UndefinedCalcError } from './calc_errors';

export const HEX_CHARS = "0123456789ABCDEF";

const inputLimit = 3;
const outputLimit = 6;

const hexBase = 16;

export function parseInput(input: string): string {
	let parsed = "";

	input = input.trim();

	//filter out invalid characters
	for(let char of input){
		//temporarily add negative sign
		if(!parsed.length && char === '-'){
			parsed += char;
		}
		//add if character is valid character
		else if(HEX_CHARS.includes(char.toUpperCase())){
			parsed += char.toUpperCase();
		}
		//if theres decimal point, stop at integral part
		if(char === '.'){
			break;
		}
	}

	//trim whitespace
	parsed = parsed.trim();

	//reject negative
	if(parsed[0] === '-'){
		throw new NegativeValueCalcError(`${input} cannot be processed because it is negative`, parsed);
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

	output = output.trim();

	if(output == "Infinity"){
		throw new InfinityCalcError(`${output} can't be processed.`, Number(output));
	}
	if(output == "NaN"){
		throw new UndefinedCalcError(`${output} can't be processed because it is undefined.`, Number(output));
	}

	//filter out invalid characters
	for(let char of output){
		//temporarily allow negative
		if(!parsed.length && char === '-'){
			parsed += char;
		}else if(HEX_CHARS.includes(char.toUpperCase())){
			parsed += char.toUpperCase();
		}else{
			throw new InvalidHexCalcError(`${output} is invalid and can't be processed`, output);
		}
	}

	//reject negative
	if(parsed[0] === '-'){
		throw new NegativeValueCalcError(`${output} cannot be processed because it is negative`, parsed);
	}

	//trim whitespace
	parsed = parsed.trim();

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

	hexString = hexString.trim();

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
	//throw error if DEC value is NaN
	if((_.isNaN(decValue) || decValue.toString() === "NaN")){
		throw new UndefinedCalcError(`${decValue} is undefined`, decValue as number);
	}

	if(decValue.toString().length <= 0){
		decValue += "0";
	}

	//throw if infinity
	let initValue = new Number(decValue.toString()) as number;
	if(initValue == Infinity || initValue == -Infinity){
		throw new InfinityCalcError(`${initValue} is literally equivalent to infinity`, initValue);
	}
	//throw error if DEC value has invalid digits
	if(isNaN(initValue)){
		throw new InvalidDecCalcError(`${decValue} is not a valid DEC value`, decValue.toString());
	}
	//throw error if DEC value is negative
	if(initValue < 0 || (decValue.toString())[0] == '-'){
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