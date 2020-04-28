import {King} from '../Piece/Piece.js';
import Alliance from './Alliance.js';

function calculateAttackOnTile(legalMoves,position){
	return [...legalMoves].filter(move=>move.destination === position);
}

function hasEscapeMoves(legalMoves){
	for(const move of legalMoves){
		try{
			if(!move.execute().getOpponentPlayer().isInCheck()){
				return true;
			}
		}catch(e){ console.log(e); continue; }
	}
	return false;
}

export default class Player {
	constructor(alliance, board, legalMoves, opponentLegalMoves){
		this.alliance = alliance;
		this.legalMoves = legalMoves;
		this.activePieces = board[alliance === Alliance.White ? 'getWhitePieces':'getBlackPieces']();
		for(const piece of this.activePieces){
			if(piece instanceof King) this.king = piece;
		}
		if(!this.king){
			throw new Error(`Illegal state: No king found for ${
				this.alliance.description
			} Player!`);
		}
		this.inCheck = calculateAttackOnTile(opponentLegalMoves, this.king.position).length > 0;
	}
	isWhite(){ return this.alliance === Alliance.White; }
	isBlack(){ return this.alliance === Alliance.Black; }
	isInCheck(){ return this.inCheck; }
	isInCheckMate(){
		return this.inCheck && !hasEscapeMoves(this.legalMoves);
	}
	isInStaleMate(){
		return !this.inCheck && !hasEscapeMoves(this.legalMoves);
	}
	getLegalMoves(){ return this.legalMoves; }
	getActivePieces(){ return this.activePieces; }
}