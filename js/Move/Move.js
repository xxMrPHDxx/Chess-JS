import Alliance from '../Player/Alliance.js';
import Board from '../Board/Board.js';
import {Queen} from '../Piece/Piece.js';

export default class Move {
	constructor(board,piece,destination,attackedPiece){
		this.board = board;
		this.piece = piece;
		this.destination = destination;
		this.attackedPiece = attackedPiece;
	}
	isAttackMove(){ return !!this.attackedPiece; }
	get position(){ return this.piece.position; }
	set position(value){ /*pass*/ }
	execute(){ return this.board; }
}

export class MajorMove extends Move {
	constructor(board,piece,destination){
		super(board,piece,destination,null);
	}
	execute(){
		const builder = new Board.Builder();
		for(const piece of this.board.getAllActivePieces()){
			if(this.piece === piece) continue;
			builder.setPiece(piece);
		}
		return builder
		.setPiece(this.piece.movePiece(this.destination))
		.setMoveMaker(this.piece.alliance===Alliance.White?Alliance.Black:Alliance.White)
		.build();
	}
}

export class AttackMove extends Move {
	constructor(board,piece,destination,attackedPiece){
		super(board,piece,destination,attackedPiece);
	}
	execute(){
		const builder = new Board.Builder();
		for(const piece of this.board.getAllActivePieces()){
			if(this.piece === piece || this.attackedPiece === piece) continue;
			builder.setPiece(piece);
		}
		return builder
		.setPiece(this.piece.movePiece(this.destination))
		.setMoveMaker(this.piece.alliance===Alliance.White?Alliance.Black:Alliance.White)
		.build();
	}
}

export class PawnJump extends Move {
	constructor(board,piece,destination,enPassantAttack){
		super(board,piece,destination,null);
		this.enPassantAttack = enPassantAttack;
	}
	execute(){
		const builder = new Board.Builder();
		for(const piece of this.board.getAllActivePieces()){
			if(this.piece === piece) continue;
			builder.setPiece(piece);
		}
		const piece = this.piece.movePiece(this.destination);
		if(this.enPassantAttack) builder.setEnPassantPawn(piece);
		return builder
		.setPiece(piece)
		.setMoveMaker(this.piece.alliance===Alliance.White?Alliance.Black:Alliance.White)
		.build();
	}
}

export class PawnPromotion extends Move {
	constructor(board,piece,destination,attackedPiece=null){
		super(board,piece,destination,attackedPiece);
	}
	execute(){
		const builder = new Board.Builder();
		for(const piece of this.board.getAllActivePieces()){
			if(this.piece === piece || this.attackedPiece === piece) continue;
			builder.setPiece(piece);
		}
		const moveMaker = this.piece.alliance === Alliance.White?Alliance.Black:Alliance.White;
		return builder
		.setPiece(new Queen(this.piece.alliance, this.destination, false))
		.setMoveMaker(moveMaker)
		.build();
	}
}

export class PawnEnPassantAttack extends Move {
	constructor(board,piece,destination,attackedPiece){
		super(board,piece,destination,attackedPiece);
	}
	execute(){
		const builder = new Board.Builder();
		for(const piece of this.board.getAllActivePieces()){
			if(this.piece === piece || this.attackedPiece === piece) continue;
			builder.setPiece(piece);
		}
		return builder
		.setPiece(this.piece.movePiece(this.destination))
		.setMoveMaker(this.piece.alliance === Alliance.White ? Alliance.Black : Alliance.White)
		.build();
	}
}

export class CastlingMove extends Move {
	constructor(board,piece,king){
		super(board,piece,king.position);
		this.king = king;
	}
	execute(){
		const builder = new Board.Builder();
		for(const piece of this.board.getAllActivePieces()){
			if(this.piece === piece || this.king === piece) continue;
			builder.setPiece(piece);
		}
		const direction = this.king.position > this.piece.position ? -1 : 1;
		return builder
		.setPiece(this.piece.movePiece(this.destination))
		.setPiece(this.king.movePiece(this.destination + direction))
		.setMoveMaker(this.piece.alliance === Alliance.White ? Alliance.Black : Alliance.White)
		.build();
	}
}