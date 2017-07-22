import {Entity, NULL_PTR} from 'engine/entity'

import * as glm from 'gl-matrix'

class CameraEntity extends Entity
{
	constructor()
	{
		super();
		this.bPhysics = true;
		this.Speed = 10;
		this.TargetPtr = NULL_PTR;

		this.Force = 750;

		this.MaxSpeed = 1200;
		this.FallOff = 500;

		this.Timeout = 1;
	}

	BeginPlay()
	{
		super.BeginPlay();
		this.Physics.ResistanceFactor = 0.8;
	}

	PostTick(dt)
	{
		let Target = this.TargetPtr.Deref;
		if(Target != null)
		{
			let AB = glm.vec2.create();
			glm.vec2.sub(AB, Target.Location, this.Location);
			let r = Math.min(glm.vec2.length(AB), this.FallOff)/10;
			glm.vec2.normalize(AB, AB);
			glm.vec2.scale(AB, AB, this.Force*r);
			this.Physics.ApplyForce(AB, dt);

			glm.vec2.sub(AB, Target.Location, this.Location);
			if(glm.vec2.length(AB)/this.MaxSpeed >= this.Timeout)
			{
				this.Location = glm.vec2.clone(Target.Location);
			}
		}

		if(glm.vec2.length(this.Physics.Velocity) > this.MaxSpeed)
		{
			glm.vec2.normalize(this.Physics.Velocity, this.Physics.Velocity);
			glm.vec2.scale(this.Physics.Velocity, this.Physics.Velocity, this.MaxSpeed);
		}

		this.core.Render.pipeline.CameraLocation = glm.vec2.clone(this.Location);
		this.core.Render.pipeline.CameraRotation = this.Rotation;

		super.PostTick(dt);
	}
}
export {CameraEntity};
