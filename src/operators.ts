import { DECtoHEX, HEXtoDEC } from './processing';

export class Operator {
	private _name:string;
	private _token:string;

	get name(){ return this._name; }
	get token(){ return this._token; }

	constructor(name:string, token:string){
		this._name = name;
		this._token = token;
	}
	//return decimal calculation
	calculate(...args:number[]) : number{
		return null;
	}
	//return hexadecimal calculation
	hexCalculate(...args:string[]) : string{
		let hexArgs = (args as []).map( 
			(arg) => ( Number( HEXtoDEC(arg) ) ) 
		);

		return DECtoHEX( this.calculate(...hexArgs) );
	}
}

class AddOp extends Operator {
	private static _inst:Operator = null;
	public static get Inst(){
		if(!this._inst){
			this._inst = new this();
		}
		return this._inst;
	}

	private constructor(){
		super("Add", "+");
	}

	override calculate(...args: number[]) {
		return args[0] + args[1];
	}
}
class SubtractOp extends Operator {
	private static _inst:Operator = null;
	public static get Inst(){
		if(!this._inst){
			this._inst = new this();
		}
		return this._inst;
	}

	private constructor(){
		super("Subtract", "-");
	}

	override calculate(...args: number[]) {
		return args[0] - args[1];
	}
}
class MultiplyOp extends Operator {
	private static _inst:Operator = null;
	public static get Inst(){
		if(!this._inst){
			this._inst = new this();
		}
		return this._inst;
	}

	private constructor(){
		super("Multiply", "×");
	}

	override calculate(...args: number[]) {
		return args[0] * args[1];
	}
}
class DivideOp extends Operator {
	private static _inst:Operator = null;
	public static get Inst(){
		if(!this._inst){
			this._inst = new this();
		}
		return this._inst;
	}
	
	private constructor(){
		super("Divide", "÷");
	}

	override calculate(...args: number[]) {
		return args[0] / args[1];
	}
}

export const Operators = {
	"Add" : AddOp.Inst,
	"Subtract" : SubtractOp.Inst,
	"Multiply" : MultiplyOp.Inst,
	"Divide" : DivideOp.Inst,
}