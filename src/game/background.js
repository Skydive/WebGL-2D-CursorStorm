import {Entity, NULL_PTR} from 'engine/entity'

import * as glm from 'gl-matrix'

class BackgroundEntity extends Entity
{
	constructor()
	{
		super();
		this.TargetPtr = NULL_PTR;
		this.Scale = [0.9, 0.9];
		this.default = {};
		this.default.Scale = glm.vec2.clone(this.Scale);
		this.ParralaxFactor = 0.95;
	}

	static Precache(core)
	{
		core.Resource.LoadTexture("Background_Space", "res/tex/background/back_1.jpg");
	}

	BeginPlay()
	{
		super.BeginPlay();
		this.core.Render.SetRenderBackground(() => {
			this.DrawTexture("Background_Space", -10);
		});
	}


	Tick(dt)
	{
		this.Scale[0] = this.default.Scale[0]/this.core.Render.pipeline.CameraMag[0];
		this.Scale[1] = this.default.Scale[1]/this.core.Render.pipeline.CameraMag[1];
		let Target = this.TargetPtr.Deref;
		if(Target != null)
		{
			let loc = glm.vec2.clone(Target.Location);
			glm.vec2.scale(loc, loc, this.ParralaxFactor);
			this.Location = loc;
		}
	}
}
export {BackgroundEntity};
