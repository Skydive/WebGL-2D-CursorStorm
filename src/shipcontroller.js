import {Entity} from './engine/entity'

class ShipController extends Entity
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

	KeyboardControls(dt)
	{
		let r = 0;
		let th = 0;
		if     (this.core.Input.KeyDown("W"))	{r = 1;}
		else if(this.core.Input.KeyDown("S"))	{r = -1;}
		if     (this.core.Input.KeyDown("A"))	{th = 1;}
		else if(this.core.Input.KeyDown("D"))	{th = -1;}
		if(r != 0)
			this.Pawn.ApplyThrust(r, dt);
		if(th != 0)
			this.Pawn.ApplyRotation(th, dt);

		if(this.core.Input.KeyDown("SPACE"))
			this.Pawn.FireCannon(dt);
	}

	PhoneControls(dt)
	{
		let beta = this.core.Input.phone.beta;
		if(beta != null)
		{
			beta = Math.max(Math.min(this.core.Input.phone.beta, 90), 0);
			let r = -(beta-45)/90;
			this.Pawn.ApplyThrust(r, dt);
		}
		let gamma = this.core.Input.phone.gamma;
		if(gamma != null)
		{
			gamma = Math.max(Math.min(gamma, 45), -45);
			let th = -gamma/90;
			this.Pawn.ApplyRotation(th, dt);
		}
		let touch = this.core.Input.phone.touch;
		if(touch.point != null)
		{
			this.Pawn.FireCannon(dt);
		}
	}

	Tick(dt)
	{
		if(this.Pawn == null)
			return;

		this.KeyboardControls(dt);
		this.PhoneControls(dt);
	}
}
export {ShipController}
