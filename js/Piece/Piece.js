import Board from '../Board/Board.js';
import BoardUtils from '../BoardUtils.js';
import Alliance from '../Player/Alliance.js';
import {
	MajorMove, AttackMove, 
	PawnJump, PawnPromotion, PawnEnPassantAttack,
	CastlingMove
} from '../Move/Move.js';

export default class Piece {
	static Rook = Symbol('Rook');
	static Knight = Symbol('Knight');
	static Bishop = Symbol('Bishop');
	static Queen = Symbol('Queen');
	static King = Symbol('King');
	static Pawn = Symbol('Pawn');
	constructor(type, alliance, position, firstMove=true){
		this.type = type;
		this.alliance = alliance;
		this.position = position;
		this.firstMove = firstMove;
	}
	set value(value){ /*pass*/ }
	get value(){
		switch(this.type){
			case Piece.Rook: return 500;
			case Piece.Knight: return 300;
			case Piece.Bishop: return 300;
			case Piece.Queen: return 900;
			case Piece.King: return 10000;
			case Piece.Pawn: return 100;
		}
		return 0;
	}
	calculateLegalMoves(board){
		if(!(board instanceof Board))
			throw new Error('ArgumentError: Expecting Board object at argument 1!');
		return new Set();
	}
	hasExclusion(position,offset){
		return this.isFirstColumnExclusion(position,offset)||
				this.isSecondColumnExclusion(position,offset)||
				this.isSeventhColumnExclusion(position,offset)||
				this.isEighthColumnExclusion(position,offset);
	}
	isFirstColumnExclusion(position,offset){ return false; }
	isSecondColumnExclusion(position,offset){ return false; }
	isSeventhColumnExclusion(position,offset){ return false; }
	isEighthColumnExclusion(position,offset){ return false; }
	movePiece(destination){ throw 'Unimplemented `movePiece` method for abstract class Piece!'; }
}

export class Rook extends Piece {
	constructor(alliance, position, firstMove=true){
		super(Piece.Rook, alliance, position, firstMove);
	}
	calculateLegalMoves(board){
		const legalMoves = super.calculateLegalMoves(board);
		for(let offset of [-8,-1,1,8]){
			let destination = this.position;
			while(BoardUtils.isValidTile(destination+offset)){
				if(this.hasExclusion(destination, offset)) break;
				destination += offset;
				const tile = board.tiles[destination];
				if(tile.isOccupied()){
					const piece = tile.piece;
					if(piece.alliance != this.alliance){
						legalMoves.add(new AttackMove(board, this, destination, piece));
					}else if(this.firstMove && piece instanceof King && piece.firstMove){
						legalMoves.add(new CastlingMove(board, this, piece));
					}
					break;
				}else{
					legalMoves.add(new MajorMove(board, this, destination));
				}
			}
		}
		return legalMoves;
	}
	isFirstColumnExclusion(position,offset){
		return BoardUtils.isFirstColumn(position) && offset == -1;
	}
	isEighthColumnExclusion(position,offset){
		return BoardUtils.isEighthColumn(position) && offset == 1;
	}
	movePiece(destination){ return new Rook(this.alliance, destination, false); }
}

export class Knight extends Piece {
	constructor(alliance, position, firstMove=true){
		super(Piece.Knight, alliance, position, firstMove);
	}
	calculateLegalMoves(board){
		const legalMoves = super.calculateLegalMoves(board);
		for(const offset of [-17,-15,-10,-6,6,10,15,17]){
			const destination = this.position + offset;
			if(!BoardUtils.isValidTile(destination) || this.hasExclusion(this.position,offset)) continue;
			const tile = board.tiles[destination];
			if(tile.isOccupied()){
				const piece = tile.piece;
				if(piece.alliance !== this.alliance){
					legalMoves.add(new AttackMove(board,this,destination,piece));
				}
			}else{
				legalMoves.add(new MajorMove(board,this,destination));
			}
		}
		return legalMoves;
	}
	isFirstColumnExclusion(position,offset){
		return BoardUtils.isFirstColumn(position) && [-17,-10,6,15].includes(offset);
	}
	isSecondColumnExclusion(position,offset){
		return BoardUtils.isSecondColumn(position) && [-10,6].includes(offset);
	}
	isSeventhColumnExclusion(position,offset){
		return BoardUtils.isSeventhColumn(position) && [-6,10].includes(offset);
	}
	isEighthColumnExclusion(position,offset){
		return BoardUtils.isEighthColumn(position) && [-15,-6,10,17].includes(offset);
	}
	movePiece(destination){ return new Knight(this.alliance, destination, false); }
}

export class Bishop extends Piece {
	constructor(alliance, position, firstMove=true){
		super(Piece.Bishop, alliance, position, firstMove);
	}
	calculateLegalMoves(board){
		const legalMoves = super.calculateLegalMoves(board);
		for(const offset of [-9,-7,7,9]){
			let destination = this.position;
			while(BoardUtils.isValidTile(destination+offset)){
				if(this.hasExclusion(destination,offset)) break;
				destination += offset;
				const tile = board.tiles[destination];
				if(tile.isOccupied()){
					const piece = tile.piece;
					if(piece.alliance !== this.alliance){
						legalMoves.add(new AttackMove(board,this,destination,piece));
					}
					break;
				}else{
					legalMoves.add(new MajorMove(board,this,destination));
				}
			}
		}
		return legalMoves;
	}
	isFirstColumnExclusion(position,offset){
		return BoardUtils.isFirstColumn(position) && [-9,7].includes(offset);
	}
	isEighthColumnExclusion(position,offset){
		return BoardUtils.isEighthColumn(position) && [-7,9].includes(offset);
	}
	movePiece(destination){ return new Bishop(this.alliance, destination, false); }
}

export class Queen extends Piece {
	constructor(alliance, position, firstMove=true){
		super(Piece.Queen, alliance, position, firstMove);
	}
	calculateLegalMoves(board){
		const legalMoves = super.calculateLegalMoves(board);
		for(const offset of [-9,-8,-7,-1,1,7,8,9]){
			let destination = this.position;
			while(BoardUtils.isValidTile(destination+offset)){
				if(this.hasExclusion(destination,offset)) break;
				destination += offset;
				const tile = board.tiles[destination];
				if(tile.isOccupied()){
					const piece = tile.piece;
					if(piece.alliance !== this.alliance){
						legalMoves.add(new AttackMove(board,this,destination,piece));
					}
					break;
				}else{
					legalMoves.add(new MajorMove(board,this,destination));
				}
			}
		}
		return legalMoves;
	}
	isFirstColumnExclusion(position,offset){
		return BoardUtils.isFirstColumn(position) && [-9,-1,7].includes(offset);
	}
	isEighthColumnExclusion(position,offset){
		return BoardUtils.isEighthColumn(position) && [-7,1,9].includes(offset);
	}
	movePiece(destination){ return new Queen(this.alliance, destination, false); }
}

export class King extends Piece {
	constructor(alliance, position, firstMove=true){
		super(Piece.King, alliance, position, firstMove);
	}
	calculateLegalMoves(board){
		const legalMoves = super.calculateLegalMoves(board);
		for(const offset of [-9,-8,-7,-1,1,7,8,9]){
			const destination = this.position + offset;
			if(!BoardUtils.isValidTile(destination) || 
				this.hasExclusion(destination,offset)) continue;
			const tile = board.tiles[destination];
			if(tile.isOccupied()){
				const piece = tile.piece;
				if(piece.alliance !== this.alliance){
					legalMoves.add(new AttackMove(board,this,destination,piece));
				}
			}else{
				legalMoves.add(new MajorMove(board,this,destination));
			}
		}
		return legalMoves;
	}
	isFirstColumnExclusion(position,offset){
		return BoardUtils.isFirstColumn(position) && [-9,-1,7].includes(offset);
	}
	isEighthColumnExclusion(position,offset){
		return BoardUtils.isEighthColumn(position) && [-7,1,9].includes(offset);
	}
	movePiece(destination){ return new King(this.alliance, destination, false); }
}

export class Pawn extends Piece {
	constructor(alliance, position, firstMove=true){
		super(Piece.Pawn, alliance, position, firstMove);
	}
	calculateLegalMoves(board){
		const legalMoves = super.calculateLegalMoves(board);
		for(const offset of [7,8,9,16]){
			const destination = this.position + offset*Alliance.Forward(this.alliance);
			const behind = destination + 8*Alliance.Backward(this.alliance);
			if(!BoardUtils.isValidTile(destination)) continue;
			const tile = board.tiles[destination];
			const behindTile = board.tiles[behind];
			switch(offset){
				case 7: case 9: //Attacking case
					if(tile.isOccupied() && this.alliance !== tile.piece.alliance){
						const piece = tile.piece;
						if((BoardUtils.isFirstRow(destination) && this.alliance === Alliance.White) ||
							(BoardUtils.isEighthRow(destination) && this.alliance === Alliance.Black)){
							legalMoves.add(new PawnPromotion(board,this,destination,piece));
						}else{
							legalMoves.add(new AttackMove(board,this,destination,piece));
						}
					}
					if(board.hasEnPassantPawn()){
						const pawn = board.getEnPassantPawn();
						const behindPawn = board.tiles[pawn.position+8*Alliance.Forward(this.alliance)];
						const beside = Math.abs(this.position - pawn.position) === 1;
						if(beside && behindPawn.position === destination && pawn.alliance !== this.alliance){
							legalMoves.add(new PawnEnPassantAttack(board,this,destination,pawn));
						}
					}
					break;
				case 8: // Pawn move
					if(tile.isEmpty()){
						if((BoardUtils.isFirstRow(destination) && this.alliance === Alliance.White) ||
							(BoardUtils.isEighthRow(destination) && this.alliance === Alliance.Black)){
							legalMoves.add(new PawnPromotion(board,this,destination));
						}else{
							legalMoves.add(new MajorMove(board,this,destination));
						}
					}
					break;
				case 16: // Pawn Jump
					if(BoardUtils.isValidTile(behind) && this.firstMove && tile.isEmpty() && behindTile.isEmpty()){
						[-1,1].map(o=>board.tiles[destination+o])
						.map(tile=>({tile, attack: !tile.isEmpty()&&tile.piece instanceof Pawn}))
						.forEach(({tile, attack})=>{
							legalMoves.add(new PawnJump(board,this,destination,attack));
						});
					}
					break;
			}
		}
		return legalMoves;
	}
	isFirstColumnExclusion(position,offset){
		return BoardUtils.isFirstColumn(position) && [-9,7].includes(offset);
	}
	isEighthColumnExclusion(position,offset){
		return BoardUtils.isEighthColumn(position) && [-7,9].includes(offset);
	}
	movePiece(destination){ return new Pawn(this.alliance, destination, false); }
}