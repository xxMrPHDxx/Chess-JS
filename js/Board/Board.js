import Alliance from '../Player/Alliance.js';
import Player from '../Player/Player.js';
import Tile from './Tile.js';

import Piece, {Rook,Knight,Bishop,Queen,King,Pawn} from '../Piece/Piece.js';

export default class Board {
	constructor(builder){
		this.tiles = builder.tiles;
		this.enPassantPawn = builder.enPassantPawn;
		this.whitePieces = new Set();
		this.blackPieces = new Set();
		for(const tile of this.tiles){
			if(tile.isEmpty()) continue;
			const piece = tile.piece;
			this[piece.alliance === Alliance.White ? 'whitePieces':'blackPieces'].add(piece);
		}
		const whiteLegals=new Set(), blackLegals=new Set();
		for(const piece of [...this.whitePieces, ...this.blackPieces]){
			for(const move of piece.calculateLegalMoves(this)){
				(piece.alliance === Alliance.White?whiteLegals:blackLegals).add(move);
			}
		}
		this.player = {
			white: new Player(Alliance.White, this, whiteLegals, blackLegals),
			black: new Player(Alliance.Black, this, blackLegals, whiteLegals)
		};
		this.currentPlayer = this.player[builder.moveMaker === Alliance.White ? 'white' : 'black'];
	}
	getWhitePieces(){ return this.whitePieces; }
	getBlackPieces(){ return this.blackPieces; }
	getAllActivePieces(){ return [...this.whitePieces, ...this.blackPieces]; }
	getWhitePlayer(){ return this.player.white; }
	getBlackPlayer(){ return this.player.black; }
	getOpponentPlayer(){ return this.currentPlayer === this.player.white ? this.player.black : this.player.white; }
	getWhiteLegals(){ return this.player.white.getLegalMoves(); }
	getBlackLegals(){ return this.player.black.getLegalMoves(); }
	hasEnPassantPawn(){ return this.enPassantPawn !== null; }
	getEnPassantPawn(){ return this.enPassantPawn; }
	isInCheck(){ return this.player.white.isInCheck() || this.player.black.isInCheck(); }
	isInCheckMate(){ return this.player.white.isInCheckMate() || this.player.black.isInCheckMate(); }
	isInStaleMate(){ return this.player.white.isInStaleMate() || this.player.black.isInStaleMate(); }
	static createFromConfiguration(boardConfig, whiteMove=true, moveConfig=Array(64).fill(true), enPassantPawn=null){
		return Array(64).fill().reduce((builder,_,position)=>{
			const tile = boardConfig[position]||0;
			if(tile === 0) return builder;
			const ally = tile < 0 ? Alliance.White : Alliance.Black;
			const Piece = [null, Rook, Knight, Bishop, Queen, King, Pawn][Math.abs(tile)]||Pawn;
			const firstMove = typeof moveConfig[position] === 'boolean' ? moveConfig[position] : true;
			return builder.setPiece(new Piece(ally, position, firstMove));
		},new Board.Builder())
		.setMoveMaker(whiteMove?Alliance.White:Alliance.Black)
		.setEnPassantPawn(enPassantPawn)
		.build();
	}
	static createStandardBoard(){
		return Board.createFromConfiguration([
			1,2,3,4,5,3,2,1,
			6,6,6,6,6,6,6,6,
			...Array(32).fill(0),
			-6,-6,-6,-6,-6,-6,-6,-6,
			-1,-2,-3,-4,-5,-3,-2,-1
		]);
	}
}

Board.Builder = class {
	constructor(){
		this.tiles = Array(64).fill().map((_,i)=>new Tile(i));
		this.moveMaker = Alliance.White;
		this.enPassantPawn = null;
	}
	setPiece(piece){
		if(piece instanceof Piece){
			this.tiles[piece.position].piece = piece;
		}
		return this;
	}
	setMoveMaker(moveMaker){
		if(!(moveMaker === Alliance.White || moveMaker === Alliance.Black))
			throw new Error('Invalid move maker!');
		this.moveMaker = moveMaker;
		return this;
	}
	setEnPassantPawn(pawn){
		if(!(pawn instanceof Pawn || pawn === null))
			throw new Error('Argument Error: Argument 1 is not an instance of Pawn!');
		this.enPassantPawn = pawn;
		return this;
	}
	build(){
		return new Board(this);
	}
}