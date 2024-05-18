import _ from 'lodash';

let HEX_CHARS = "0123456789ABCDEF";

const inputLimit = 3;

export function parseInput(input: string): string {
	let parsed = "";

	for(let char of input){
		if(HEX_CHARS.includes(char.toUpperCase())){
			parsed += char;
		}
	}

	//limit number of input characters
	parsed = parsed.substring(0, inputLimit);

	return parsed;
}
