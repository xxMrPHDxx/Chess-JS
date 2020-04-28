const CHECK_BONUS = 50;
const CHECK_MATE_BONUS = 10000;
const DEPTH_BONUS = 100;
const CASTLED_BONUS = 60;

export default class BoardEvaluator {
	evaluate(){
		throw new Error('Unimplemented method: Must implement abstract method!');
	}
}

function getPieceValues(player){
	let total = 0;
	for(const piece of player.getActivePieces()){
		total += piece.value;
	}
	return total;
}

function getMobility(player){
	return player.getLegalMoves().size;
}

function getIsInCheck(opponent){
	return opponent.isInCheck() ? CHECK_BONUS : 0;
}

function getDepthBonus(depth){
	return depth === 0 ? 1 : (DEPTH_BONUS * depth);
}

function getIsInCheckMate(opponent, depth){
	return opponent.isInCheckMate() ? CHECK_MATE_BONUS * getDepthBonus(depth) : 0;
}

function getCastled(player){
	return true ? CASTLED_BONUS : 0; // TODO: Implement Player.isCastled
}

function getPlayerScore(board, player, depth){
	return getPieceValues(player) +
		getMobility(player) + 
		getIsInCheck(board.getOpponentPlayer()) +
		getIsInCheckMate(board.getOpponentPlayer(), depth) +
		getCastled(board.getOpponentPlayer());
}

export class StandardBoardEvaluator extends BoardEvaluator {
	evaluate(board, depth){
		return getPlayerScore(board, board.player.white, depth) -
			getPlayerScore(board, board.player.black, depth);
	}
}