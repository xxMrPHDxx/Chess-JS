const NUM_TILES = 64;
const NUM_ROWS = 8;
function isColumn(pos,col){
	return pos % NUM_ROWS === col;
}
function isRow(pos,row){
	return ((pos / NUM_ROWS)|0) === row;
}

export default class BoardUtils {
	static isValidTile(pos){
		return pos >= 0 && pos < NUM_TILES;
	}
	static isFirstColumn  (pos){ return isColumn(pos, 0); }
	static isSecondColumn (pos){ return isColumn(pos, 1); }
	static isSeventhColumn(pos){ return isColumn(pos, 6); }
	static isEighthColumn (pos){ return isColumn(pos, 7); }
	static isFirstRow  (pos){ return isRow(pos, 0); }
	static isSecondRow (pos){ return isRow(pos, 1); }
	static isSeventhRow(pos){ return isRow(pos, 6); }
	static isEighthRow (pos){ return isRow(pos, 7); }
}