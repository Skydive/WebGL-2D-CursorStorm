import {Entity} from '../engine/entity'

class Pawn extends Entity
{
	constructor()
	{
		super();
		this.MaxHealth = 100;
		this.Health = this.MaxHealth;
	}

	Tick(dt)
	{
		super.Tick(dt);

		if(this.Health <= 0)
		{
			this.Destroy();
		}
	}

	Render()
	{
		console.log("Test");
	}
}

export {Pawn};
