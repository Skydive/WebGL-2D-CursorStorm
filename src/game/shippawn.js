import {Entity} from '../engine/entity'
import {Animation} from '../engine/animation'
import {PhysicsComponent} from '../engine/components/physicscomponent'
import {Pawn} from '../framework/pawn'

import * as glm from 'gl-matrix'

class Projectile extends Entity
{
	constructor()
	{
		super();
		this.bPhysics = true;
		this.bCollision = true;

		this.OffsetRotation = -90 * (Math.PI/180);
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
			glm.vec2.scale(AB, AB, 50);
			collided.Physics.ApplyImpulse(AB);


			this.Destroy();
		}
	}

	Render()
	{
		this.DrawTexture("Texture_Ship_Projectile");
	}
}

class ShipPawn extends Pawn
{
	constructor()
	{
		super();
		this.bPhysics = true;
		this.bCollision = true;

		this.OffsetRotation = -90 * (Math.PI/180);

		this.Force = 240;
		this.AngularVelocity = 4;

		this.bForwardThrust = false;
		this.LastFiredTime = 0;
		this.FireInterval = 0.15;

		this.Color = [1.0, 0.3, 0.3];
		this.default = {};
		this.default.Color = this.Color;
	}

	static Precache(core)
	{
		core.Resource.LoadTexture("Texture_Ship_Base", "../res/ship/base.png");
		core.Resource.LoadTexture("Texture_Ship_Window", "../res/ship/window.png");

		core.Resource.LoadAnimation("Animation_Ship_Wings_Idle", "../res/ship/wings_idle_%.png", 2);
		core.Resource.LoadAnimation("Animation_Ship_Thrust_On", "../res/ship/thrust_on_%.png", 4);
		core.Resource.LoadAnimation("Animation_Ship_Cannon_Fire", "../res/ship/cannon_fire_%.png", 2);

		core.Resource.LoadTexture("Texture_Ship_Projectile", "../res/ship/projectile.png");
	}

	BeginPlay()
	{
		super.BeginPlay();
		this.Collision.CollisionClassList = [ShipPawn];
		this.Collision.RadiusScale = 0.86;

		this.Physics.ResistanceFactor = 0.99;

		this.ThrustAnimationOn = Animation.Create(this.core, "Animation_Ship_Thrust_On");
		this.WingsAnimationIdle = Animation.Create(this.core, "Animation_Ship_Wings_Idle");
		this.CannonAnimationFire = Animation.Create(this.core, "Animation_Ship_Cannon_Fire");
	}

	Tick(dt)
	{
		this.Collision.FromTexture("Texture_Ship_Base");
		super.Tick(dt);
	}

	Render()
	{
		let sm = glm.vec2.dot(this.Physics.Velocity, this.GetForwardVector());
		if(sm > 20)
		{
			let n = Math.min(Math.floor(sm / 300 * this.ThrustAnimationOn.Count), this.ThrustAnimationOn.Count-1);
			this.DrawTexture(this.ThrustAnimationOn.GetFrameNum(n));
		}

		this.DrawTexture("Texture_Ship_Base");

		this.DrawTexture(this.CannonAnimationFire.GetFrameNum(this.core.GetTime() - this.LastFiredTime < 0.2*this.FireInterval ? 1 : 0), this.Color);
		this.DrawTexture(this.WingsAnimationIdle.GetFrameNum(this.bForwardThrust ? 1 : 0), this.Color); this.bForwardThrust = false;

		// TODO: Remake this in hsl <--> rgb 
		glm.vec2.lerp(this.Color, [0.3, 0.3, 0.3], this.default.Color, this.Health/this.MaxHealth);

		this.DrawTexture("Texture_Ship_Window", [0.9, 0.9, 0.9]);

	}

	OnCollision(collided, dt)
	{
		if(collided.isChildOfClass(ShipPawn))
		{
			PhysicsComponent.CollisionResponse(this, collided);
		}
	}

	ApplyThrust(scale, dt)
	{
		if(scale > 0)
			this.bForwardThrust = true;

		let force = glm.vec2.create();
		glm.vec3.scale(force, this.GetForwardVector(), scale*this.Force);
		this.Physics.ApplyForce(force, dt);
	}

	ApplyRotation(scale, dt)
	{
		this.Rotation = (this.Rotation+scale*this.AngularVelocity*dt)%(2*Math.PI);
	}

	FireCannon(dt)
	{
		if(this.core.GetTime() - this.LastFiredTime > this.FireInterval)
		{
			let p = this.Spawn(Projectile, this);
			glm.vec2.scaleAndAdd(p.Location, this.Location, this.GetForwardVector(), 12);
			glm.vec2.scaleAndAdd(p.Location,    p.Location, this.GetRightVector()  , 12);
			p.Rotation = this.Rotation;
			glm.vec2.scaleAndAdd(p.Physics.Velocity, this.Physics.Velocity, this.GetForwardVector(), 520);
			p.bLifeSpan = true;
			p.LifeSpan = 2;

			p = this.Spawn(Projectile, this);
			glm.vec2.scaleAndAdd(p.Location, this.Location, this.GetForwardVector(), 12);
			glm.vec2.scaleAndAdd(p.Location,    p.Location, this.GetRightVector()  ,-12);
			p.Rotation = this.Rotation;
			glm.vec2.scaleAndAdd(p.Physics.Velocity, this.Physics.Velocity, this.GetForwardVector(), 520);
			p.bLifeSpan = true;
			p.LifeSpan = 2;

			this.LastFiredTime = this.core.GetTime();

			let impulse = glm.vec2.create();
			glm.vec3.scale(impulse, this.GetForwardVector(), -15);
			this.Physics.ApplyImpulse(impulse);
		}
	}
}

export {ShipPawn};
