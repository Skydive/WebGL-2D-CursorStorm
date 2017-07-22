import {Base} from 'engine/base'

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

		this.RestitutionFactor = 1.0; // TODO: Fix e < 1 (elastic collisions)
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

	ApplyImpulse(impulse)
	{
		glm.vec2.scaleAndAdd(this.Velocity, this.Velocity, impulse, 1/this.Mass);
	}

	static CollisionResponse(a, b)
	{
		if(a.bCollision && b.bCollision
		&& a.bPhysics && b.bPhysics)
		{
			// Transform velocities to make x-axis the line between them.
			let AB = glm.vec2.create();
			glm.vec2.sub(AB, b.Location, a.Location);
			let theta = Math.sign(AB[1])*Math.acos(AB[0]/glm.vec2.length(AB));
			let T = glm.mat2.create();
			glm.mat2.fromRotation(T, theta);

			let au = glm.vec2.create();
			let bu = glm.vec2.create();
			glm.vec2.transformMat2(au, a.Physics.Velocity, T);
			glm.vec2.transformMat2(bu, b.Physics.Velocity, T);

			let e = a.Physics.RestitutionFactor * b.Physics.RestitutionFactor;
			let am = a.Physics.Mass; let bm = b.Physics.Mass;

			let av = glm.vec2.clone(au); // Vertical continutity
			av[0] = ((am - bm*e)*au[0] + (bm + bm*e)*bu[0])/(am + bm); // Horizontal momentum + restitution

			glm.mat2.fromRotation(T, -theta);
			glm.vec2.transformMat2(av, av, T);

			a.Physics.Velocity = glm.vec2.clone(av);
		}

		// Old one-way collision method:
		/*// Get radial component.
		let r = glm.vec2.create();
		glm.vec2.sub(r, collided.Location, this.Location);
		glm.vec2.normalize(r, r);
		// Get radial length (Force it to be towards so escape is possible when stuck)
		let rmag = Math.abs(glm.vec2.dot(this.Physics.Velocity, r));
		// Reflect with radial as the normal
		glm.vec2.scale(r, r, rmag);
		glm.vec2.sub(this.Physics.Velocity, this.Physics.Velocity, r);*/
	}

}
export {PhysicsComponent};
