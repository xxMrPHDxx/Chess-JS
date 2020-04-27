export default class Stack extends Array {
	constructor(init=null){
		super(0);
		if(init !== null) this.push(init);
	}
	push(item){
		super.push(item);
	}
	pop(){
		if(this.length === 0)
			throw new Error('Empty Stack: Failed to pop an empty stack!');
		return this.splice(this.length-1,1)[0];
	}
	peek(){
		return this[this.length-1];
	}
}