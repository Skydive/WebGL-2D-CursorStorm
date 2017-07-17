import {Base} from '../base'

import * as glm from 'gl-matrix'

class PhysicsComponent extends Base
{
	constructor()
	{
		super();
		this.MaxSpeed = -1;
		this.Velocity = [0, 0];
		this.Mass = 1;
		this.ResistanceFactor = 1.0;
	}

	Tick(dt)
	{
		glm.vec2.scaleAndAdd(this.owner.Location, this.owner.Location, this.Velocity, dt);
		glm.vec2.scale(this.Velocity, this.Velocity, this.ResistanceFactor);
	}

	ApplyForce(force, dt)
	{
		glm.vec2.scaleAndAdd(this.Velocity, this.Velocity, force, dt/this.Mass);
	}

}
export {PhysicsComponent};
