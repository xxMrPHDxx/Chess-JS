export default class MoveStatus {
	static Success = Symbol('Success');
	static Illegal = Symbol('Illegal');
	static LeavesPlayerInCheck = Symbol('LeavesPlayerInCheck');
}