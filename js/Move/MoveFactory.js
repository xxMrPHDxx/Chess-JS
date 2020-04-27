import MoveTransition from './MoveTransition.js';
import MoveStatus from './MoveStatus.js';

export default class MoveFactory {
	static createMove(board,sourceTile,destinationTile){
		for(const move of board.currentPlayer.getLegalMoves()){
			if(move.position === sourceTile.position &&
				move.destination === destinationTile.position){
				const nextBoard = move.execute();
				if(board.currentPlayer.isInCheck() && nextBoard.getOpponentPlayer().isInCheck()){
					return new MoveTransition(MoveStatus.LeavesPlayerInCheck, board);
				}
				if(!nextBoard.getOpponentPlayer().isInCheck()){
					return new MoveTransition(MoveStatus.Success, nextBoard);
				}
			}
		}
		return new MoveTransition(MoveStatus.Illegal, board);
	}
}