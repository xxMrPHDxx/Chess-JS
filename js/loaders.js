import Alliance from './Player/Alliance.js';
import Piece from './Piece/Piece.js';

function loadImage(path){
	return new Promise((resolve, reject)=>{
		const img = new Image();
		img.src = path;
		img.onload = ()=>resolve(img);
		img.onerror = reject;
	})
}
function loadPieceImages(){
	return loadImage('img/figures.png')
	.then(pieces=>[Alliance.Black, Alliance.White].reduce((obj, ally, row)=>{
		[Piece.Rook,Piece.Knight,Piece.Bishop,Piece.Queen,Piece.King,Piece.Pawn].forEach((type, col)=>{
			if(!(ally in obj)) obj[ally] = {};
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			ctx.drawImage(pieces, col*56, row*56, 56, 56, 0, 0, 56, 56);
			obj[ally][type] = canvas;
		});
		return obj;
	},{}));
}
function loadUiImages(){
	return loadImage('img/ui.png')
	.then(img=>Array(2).fill().reduce((arr,a,i)=>[...arr,...Array(3).fill().map((b,j)=>{
		const canvas = document.createElement('canvas');
		canvas.setAttribute('width', 56); canvas.setAttribute('height', 56);
		canvas.getContext('2d').drawImage(img, j*56, i*56, 56, 56, 0, 0, 56, 56);
		return canvas;
	})],[]));
}
export async function loadAssets(){
	const [ greenDot, redDot, castling, check, checkMate, staleMate] = await loadUiImages();
	window.gamectx = {
		boardImage: await loadImage('img/board.png'),
		pieceImages: await loadPieceImages(),
		ui: { greenDot, redDot, castling, check, checkMate, staleMate }
	};
}