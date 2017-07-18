import {Entity} from '../engine/entity';

import * as glm from 'gl-matrix'

class CameraEntity extends Entity
{
	constructor()
	{
		super();
		this.bPhysics = true;
		this.Speed = 10;
		this.Target = null;

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

	Tick(dt)
	{
		if(this.Target != null)
		{
			let force = glm.vec2.create();
			let distance = Math.min(glm.vec2.distance(this.Location, this.Target.Location), this.FallOff);
			distance /= 1000;
			glm.vec3.sub(force, this.Target.Location, this.Location);
			glm.vec3.normalize(force, force);
			glm.vec3.scale(force, force, this.Force*distance);
			this.Physics.ApplyForce(force, dt);

			let AB = glm.vec2.create();
			glm.vec2.sub(AB, this.Target.Location, this.Location);
			if(glm.vec2.length(AB)/this.MaxSpeed >= this.Timeout)
			{
				this.Location = glm.vec2.copy(this.Target.Location);
			}
		}

		super.Tick(dt);

		if(glm.vec2.length(this.Physics.Velocity) > this.MaxSpeed)
		{
			glm.vec2.normalize(this.Physics.Velocity, this.Physics.Velocity);
			glm.vec2.scale(this.Physics.Velocity, this.Physics.Velocity, this.MaxSpeed);
		}

		this.core.Render.pipeline.CameraLocation = glm.vec2.clone(this.Location);
		this.core.Render.pipeline.CameraRotation = this.Rotation;
	}
}
export {CameraEntity};
