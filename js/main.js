import {loadAssets} from './loaders.js';
import Board from './Board/Board.js';

import {PawnEnPassantAttack, CastlingMove} from './Move/Move.js';
import {Rook, Knight, Bishop, Queen, King, Pawn} from './Piece/Piece.js';
import Alliance from './Player/Alliance.js';

/*======================Override=====================*/
Array.prototype.random = function(){
	if(!this.length) throw new Error('Index Error: Cannot get random element from an empty Array!');
	return this[(Math.random()*this.length)|0];
}
Set.prototype.random = function(){
	if(!this.size) throw new Error('Index Error: Cannot get random element from an empty Set!');
	return [...this][(Math.random()*this.size)|0];
}
/*====================End Override===================*/

const canvas = document.querySelector('canvas#ChessGrid');
const ctx = canvas.getContext('2d');

loadAssets().then(run);

let board, sourceTile, destTile;
const hints = [];

function run(){
	board = Board.createStandardBoard();
	sourceTile = destTile = null;

	UpdateBoard(board);

	// setInterval(()=>{
	// 	OnTileClicked(0,0);
	// 	UpdateBoard();
	// },250);

	canvas.addEventListener('click', e=>{
		const x=e.clientX-e.target.offsetLeft, y=e.clientY-e.target.offsetTop;
		if(x>=28&&x<504-28&&y>=28&&y<504-28){
			OnTileClicked(((y-28)/56)|0,((x-28)/56)|0);
			UpdateBoard();
		}
	});
	canvas.addEventListener('contextmenu', e=>e.preventDefault());
}

function UpdateBoard(){
	ctx.drawImage(gamectx.boardImage, 0, 0);
	for(const piece of board.getAllActivePieces()){
		DrawTile(piece);
	}
	for(const {img,r,c} of hints){
		ctx.drawImage(img,c*56+28,r*56+28);
	}
	hints.splice(0);
}
function DrawTile(piece){
	const img = gamectx.pieceImages[piece.alliance][piece.type];
	const row = (piece.position/8)|0, col = piece.position%8;
	ctx.drawImage(img, col*56+28, row*56+28);
}
function OnTileClicked(row, col){
	const position = row*8+col;
	const tile = board.tiles[position];
	if(sourceTile === null){
		if(tile.isEmpty() || tile.piece.alliance !== board.currentPlayer.alliance) return;
		sourceTile = tile;
		for(const move of board.currentPlayer.getLegalMoves()){
			if(move.position !== tile.position) continue;
			const r = (move.destination/8)|0, c = move.destination%8;
			const img = move instanceof CastlingMove ? 
				gamectx.ui.castling :
				(move.isAttackMove() ? gamectx.ui.redDot : gamectx.ui.greenDot);
			hints.push({img, r, c});
		}
	}else if(destTile === null){
		destTile = tile;
		if(sourceTile !== destTile){
			for(const move of board.currentPlayer.getLegalMoves()){
				if(move.position !== sourceTile.position || move.destination !== destTile.position)
					continue;
				board = move.execute();
				break;
			}
		}
		sourceTile = destTile = null;
	}
}