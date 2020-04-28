import BoardEvaluator, {StandardBoardEvaluator} from './BoardEvaluator.js';
import MoveFactory from '../Move/MoveFactory.js';

export default class MoveStrategy {
	constructor(evaluator){
		if(!(evaluator instanceof BoardEvaluator)){
			throw new Error('Invalid argument: Expecting BoardEvaluator instance at argument 1!');
		}
		this.evaluator = evaluator;
	}
	execute(){
		throw new Error('Unimplemented method: Must implement abstract method!');
	}
}

export class MiniMax extends MoveStrategy {
	constructor(evaluator=new StandardBoardEvaluator()){
		super(evaluator);
	}
	execute(board,depth){
		if(depth <= 0) throw new Error('Invalid depth: Search depth must be greater than 0!');
		let bestMove = null;
		const value = {min: Infinity, max: -Infinity};
		for(const move of board.currentPlayer.getLegalMoves()){
			const src = board.tiles[move.position], dest = board.tiles[move.destination];
			const transition = MoveFactory.createMove(board, src, dest);
			if(transition.isSuccess()){
				const func = board.currentPlayer.isWhite() ? this.min : this.max;
				const val = func.bind(this)(transition.board, depth-1);
				if(board.currentPlayer.isWhite() && val < value.min){
					value.min = val; bestMove = move;
				}else if(board.currentPlayer.isBlack() && val > value.max){
					value.max = val; bestMove = move;
				}else continue;
			}
		}
		return bestMove;
	}
	min(board,depth){
		if(depth === 0 /*|| game over*/){
			return this.evaluator.evaluate(board, depth);
		}
		let minValue = Infinity;
		for(const move of board.currentPlayer.getLegalMoves()){
			const src = board.tiles[move.position], dest = board.tiles[move.destination];
			const transition = MoveFactory.createMove(board, src, dest);
			if(transition.isSuccess()){
				const value = this.max(transition.board, depth-1);
				if(value < minValue) minValue = value;
			}
		}
		return minValue;
	}
	max(board,depth){
		if(depth === 0 /*|| game over*/){
			return this.evaluator.evaluate(board, depth);
		}
		let maxValue = -Infinity;
		for(const move of board.currentPlayer.getLegalMoves()){
			const src = board.tiles[move.position], dest = board.tiles[move.destination];
			const transition = MoveFactory.createMove(board, src, dest);
			if(transition.isSuccess()){
				const value = this.min(transition.board, depth-1);
				if(value > maxValue) maxValue = value;
			}
		}
		return maxValue;
	}
}