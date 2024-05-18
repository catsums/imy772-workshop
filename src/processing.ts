import _ from 'lodash';

export const HEX_CHARS = "0123456789ABCDEF";

const inputLimit = 3;
const outputLimit = 6;

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