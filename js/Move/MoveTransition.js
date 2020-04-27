import MoveStatus from './MoveStatus.js';

export default class MoveTransition {
	constructor(status,board){
		this.status = status;
		this.board = board;
	}
	isSuccess(){
		return this.status === MoveStatus.Success;
	}
}