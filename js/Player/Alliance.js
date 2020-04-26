export default class Alliance {
	static White = Symbol('White');
	static Black = Symbol('Black');
	static Forward(alliance){
		if(!(alliance === Alliance.White || alliance === Alliance.Black))
			throw new Error(
				'Argument Error: Invalid argument 1. Expecting Alliance.White or Alliance.Black!'
			);
		return alliance === Alliance.White ? -1 : 1;
	}
	static Backward(alliance){
		return -Alliance.Forward(alliance);
	}
}