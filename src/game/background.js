import {Entity} from '../engine/entity';

import * as glm from 'gl-matrix'

class BackgroundEntity extends Entity
{
	constructor()
	{
		super();
		this.bRender = true;
		this.Target = null;
		this.Scale = [0.25, 0.25];
		this.ParralaxFactor = 0.95;
	}

	static Precache(core)
	{
		core.Resource.LoadTexture("Background_Space", "../res/background/back_1.jpg");
	}

	BeginPlay()
	{
		super.BeginPlay();
		this.core.Render.SetRenderBackground(() => {
			this.Render.DrawTexture("Background_Space", [1.0, 1.0, 1.0, 1.0]);
		});
	}


	Tick(dt)
	{
		if(this.Target != null)
		{
			let loc = glm.vec2.clone(this.Target.Location);
			glm.vec2.scale(loc, loc, this.ParralaxFactor);
			this.Location = loc;
		}
	}
}
export {BackgroundEntity};
