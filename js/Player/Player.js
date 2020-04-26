import {King} from '../Piece/Piece.js';
import Alliance from './Alliance.js';

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
	}
	getLegalMoves(){ return this.legalMoves; }
}