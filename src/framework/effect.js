import {Entity} from '../engine/entity'
import {Animation} from '../engine/animation'

class Effect extends Entity
{
	constructor()
	{
		super();
		this.bPhysics = false;
		this.bCollision = false;

		this.Sequence = null;
	}

	PostBeginPlay()
	{
		super.PostBeginPlay();
		if(this.Sequence == null)
		{
			this.Destroy();
			return;
		}

		this.Sequence.OnCompleted(() => {
			this.Destroy();
		});
		this.Sequence.Start();
	}

	Tick(dt)
	{
		super.Tick(dt);
		if(this.Sequence != null)
			this.Sequence.Tick(dt);
	}

	Render()
	{
		this.DrawTexture(this.Sequence.GetFrame());
	}
}
export {Effect};
