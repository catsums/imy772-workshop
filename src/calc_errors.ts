
export class CalcError extends Error {
	private _value:any;

	get value(){
		return this._value;
	}
	
	constructor(message:string, value:any) {
	  super(message);
	  this.name = this.constructor.name;
	  this._value = value;
	}
}

export class InvalidValueCalcError extends CalcError {

	constructor(message:string, value:any){
		super(message, value);
	}
	
}
export class NegativeValueCalcError extends CalcError {

	constructor(message:string, value:any){
		super(message, value);
	}
	
}

export class InfinityCalcError extends CalcError {

	constructor(message:string, value:typeof Infinity){
		super(message, value);
	}
	
}

export class UndefinedCalcError extends CalcError {

	constructor(message:string, value:typeof Infinity){
		super(message, value);
	}
	
}

export class InvalidDecCalcError extends CalcError {

	constructor(message:string, value:string){
		super(message, value);
	}

}

export class InvalidHexCalcError extends CalcError {

	constructor(message:string, value:string){
		super(message, value);
	}

}