import {Entity, NULL_PTR} from 'engine/entity'
import {ShipPawn} from 'game/shippawn'
import {PhysicsComponent} from 'engine/components/physicscomponent'

import {CameraEntity} from 'game/cameraentity'

import * as glm from 'gl-matrix'

class Rock extends Entity
{
	constructor()
	{
		super();
		this.bPhysics = true;
		this.bCollision = true;

		this.FallOff = 800;
	}

	static Precache(core)
	{
		core.Resource.LoadTexture("Texture_Rock", "res/tex/rock.png");
	}

	BeginPlay()
	{
		super.BeginPlay();
		this.Collision.bCollisionExclude = true;
		this.Collision.RadiusScale = 0.70;
		this.Physics.Mass = 1000000;
	}

	OnCollision(collided, dt)
	{
		if(collided.isChildOfClass(ShipPawn))
		{
			let AB = glm.vec2.create();
			glm.vec2.sub(AB, this.Location, collided.Location);
			glm.vec2.normalize(AB, AB);
			// Get radial length (Force it to be towards so escape is possible when stuck)
			let r = Math.abs(glm.vec2.dot(collided.Physics.Velocity, AB));
			// Reflect with radial as the normal
			glm.vec2.scale(AB, AB, r);
			glm.vec2.sub(collided.Physics.Velocity, collided.Physics.Velocity, AB);
		}
	}

	Tick(dt)
	{
		this.Collision.FromTexture("Texture_Rock");
		for(let i=0; i<this.core.Scene.EntityList.length; i++)
		{
			let ent = this.core.Scene.EntityList[i];
			if(ent.isChildOfClass(CameraEntity))
				continue;

			if(ent.Physics != null && this != ent)
			{
				let AB = glm.vec2.create();
				glm.vec2.sub(AB, this.Location, ent.Location);
				let r = glm.vec2.length(AB);
				if(r < this.FallOff || this.FallOff < 0)
				{
					r /= 1000;
					glm.vec2.normalize(AB, AB);
					glm.vec2.scale(AB, AB, 10 / (r**2));
					ent.Physics.ApplyForce(AB, dt);

					// Alter Rotation  dv = (dvr, dvt = du)
					// rdX = ds/dt = rdx = du/dt
					glm.vec2.sub(AB, this.Location, ent.Location);
					r = glm.vec2.length(AB);
					glm.vec2.normalize(AB, AB);
					let du = glm.vec2.dot(ent.Physics.Velocity, [AB[1], -AB[0]]);
					ent.Rotation += du*dt / r;
				}
			}
		}
	}

	Render()
	{
		this.DrawTexture("Texture_Rock")
	}
}
export {Rock};
