import {Entity} from '../engine/entity'

class Controller extends Entity
{
	constructor()
	{
		super();
		this.Pawn = null;
	}

	Possess(pawn)
	{
		if(this.Pawn != null)
			this.Pawn.Controller = null;

		this.Pawn = pawn;
		pawn.Controller = this;
	}
}
export {Controller}
