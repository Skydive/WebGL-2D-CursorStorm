import {Entity, NULL_PTR} from 'engine/entity'

import {FORWARD_VECTOR, UP_VECTOR} from 'engine/managers/render'

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

		this.Height = 1200;

		// LERP stuff
		this.SpringTime = 1;

		this.InitialRotation = glm.quat.create();
		this.FinalRotation = glm.quat.create();

		this.InitialHeight = 9000;
		this.FinalHeight = this.Height;

	}

	BeginPlay()
	{
		super.BeginPlay();
		this.Physics.ResistanceFactor = 0.8;

		glm.quat.setAxisAngle(this.InitialRotation, [0, 1, 0], 3*Math.PI/4);
		glm.quat.setAxisAngle(this.FinalRotation, [0, 1, 0], Math.PI);
		this.core.Render.pipeline.CameraLocation = [0, 0, this.Height];
	}

	PostTick(dt)
	{

		if(this.core.GetElapsedTime() < this.SpringTime)
		{
			let t = Math.min(1.0, this.core.GetElapsedTime()/this.SpringTime);
			glm.quat.lerp(this.core.Render.pipeline.CameraRotation, this.InitialRotation, this.FinalRotation, t);

			this.Height = this.InitialHeight + (this.FinalHeight-this.InitialHeight) * t;
			this.core.Render.pipeline.CameraLocation = [0, 0, this.Height];
			return;
		}

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


		this.core.Render.pipeline.CameraLocation[0] = this.Location[0];
		this.core.Render.pipeline.CameraLocation[1] = this.Location[1];
		//this.core.Render.pipeline.CameraRotation = this.Rotation;

		super.PostTick(dt);
	}
}
export {CameraEntity};
