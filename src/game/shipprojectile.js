import {Entity} from '../engine/entity'
import {Animation} from '../engine/animation'
import {Effect} from '../framework/effect'

import {ShipPawn} from './shippawn'

import * as glm from 'gl-matrix'

class ShipProjectile extends Entity
{
	constructor()
	{
		super();
		this.bPhysics = true;
		this.bCollision = true;

		this.OffsetRotation = -90 * (Math.PI/180);
	}

	static Precache(core)
	{
		core.Resource.LoadTexture("Texture_Ship_Projectile", "../res/ship/projectile.png");
		core.Resource.LoadAnimation("Animation_Projectile_Explode", "../res/ship/projectile_explode_%.png", 3);
	}

	BeginPlay()
	{
		super.BeginPlay();
		this.Collision.CollisionClassList = [ShipPawn];
		this.Collision.RadiusScale = 0.5;
	}

	OnCollision(collided, dt)
	{
		if(collided != this.owner)
		{
			collided.Health -= 10;
			let AB = glm.vec2.create();

			glm.vec2.sub(AB, this.Location, this.owner.Location);
			glm.vec2.normalize(AB, AB);
			glm.vec2.scale(AB, AB, 25);
			collided.Physics.ApplyImpulse(AB);

			this.Destroy();
		}
	}

	OnDestroyed()
	{
		let ExplodeEffect = this.Spawn(Effect);
		ExplodeEffect.Location = glm.vec2.clone(this.Location);
		ExplodeEffect.Sequence = Animation.Create(this.core, "Animation_Projectile_Explode");
		ExplodeEffect.Sequence.Duration = 0.25;
	}

	Render()
	{
		this.DrawTexture("Texture_Ship_Projectile");
	}
}
export {ShipProjectile};
