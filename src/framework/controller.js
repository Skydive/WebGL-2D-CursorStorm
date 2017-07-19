import {Entity, NULL_PTR} from '../engine/entity'

class Controller extends Entity
{
	constructor()
	{
		super();
		this.PawnPtr = NULL_PTR;
	}

	Possess(newpawnptr)
	{
		let Pawn = this.PawnPtr.Deref;
		if(Pawn != null)
			Pawn.Controller = null;

		Pawn = newpawnptr.Deref;
		this.PawnPtr = Pawn.Ref;
		Pawn.ControllerPtr = this.Ref;
	}
}
export {Controller}
