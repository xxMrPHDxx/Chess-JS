import Piece from '../Piece/Piece.js';

export default class Tile {
	constructor(pos=0){
		if(typeof pos != 'number' && !(pos instanceof Piece))
			throw Error('Invalid argument: Must supply a position or a Piece object!');
		this.position = typeof pos === 'number' ? pos : pos.position;
		this.piece = pos instanceof Piece ? pos : null;
	}
	isEmpty(){ return this.piece == null; }
	isOccupied(){ return !this.isEmpty(); }
}