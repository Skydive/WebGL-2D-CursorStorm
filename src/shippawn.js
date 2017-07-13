import {Entity} from './engine/entity'
import {Animation} from './engine/animation'

import * as glm from 'gl-matrix'

class Projectile extends Entity
{
	constructor()
	{
		super();
		this.Velocity = [0, 0];

		this.OffsetRotation = -90 * (Math.PI/180);

		this.LifeSpan = 10;
	}

	Tick(dt)
	{
		this.LifeSpan -= dt;

		if(this.LifeSpan < 0)
		{
			this.Destroy();
		}

		glm.vec2.scaleAndAdd(this.Location, this.Location, this.Velocity, dt);
	}

	Render()
	{
		this.DrawTexture("Texture_Ship_Projectile");
	}
}

class ShipPawn extends Entity
{
	constructor()
	{
		super();
		this.OffsetRotation = -90 * (Math.PI/180);

		this.Acceleration = 240;
		this.Velocity = [0, 0];
		this.AngularVelocity = 4;

		this.bForwardThrust = false;

		this.LastFiredTime = 0;
		this.FireInterval = 0.15;

		this.Controller = null;
	}

	static Precache(core)
	{
		core.Resource.LoadTexture("Texture_Ship_Base", "../res/ship/base.png");
		core.Resource.LoadTexture("Texture_Ship_Window_LightBlue", "../res/ship/window_ltblue.png");

		core.Resource.LoadAnimation("Animation_Ship_Wings_Idle", "../res/ship/wings_idle_%.png", 2);
		core.Resource.LoadAnimation("Animation_Ship_Thrust_On", "../res/ship/thrust_on_%.png", 4);
		core.Resource.LoadAnimation("Animation_Ship_Cannon_Fire", "../res/ship/cannon_fire_%.png", 2);

		core.Resource.LoadTexture("Texture_Ship_Projectile", "../res/ship/projectile.png");
	}

	BeginPlay()
	{
		super.BeginPlay();
		this.ThrustAnimationOn = Animation.Create(this.core, "Animation_Ship_Thrust_On");
		this.WingsAnimationIdle = Animation.Create(this.core, "Animation_Ship_Wings_Idle");
		this.CannonAnimationFire = Animation.Create(this.core, "Animation_Ship_Cannon_Fire");
	}

	ApplyThrust(scale, dt)
	{
		if(scale > 0)
			this.bForwardThrust = true;
		glm.vec3.scaleAndAdd(this.Velocity, this.Velocity, this.GetForwardVector(), scale*this.Acceleration*dt);
	}

	ApplyRotation(scale, dt)
	{
		this.Rotation = (this.Rotation+scale*this.AngularVelocity*dt)%(2*Math.PI);
	}

	FireCannon(dt)
	{
		if(this.core.GetTime() - this.LastFiredTime > this.FireInterval)
		{
			let p = this.Spawn(Projectile);
			glm.vec2.scaleAndAdd(p.Location, this.Location, this.GetForwardVector(), 12);
			glm.vec2.scaleAndAdd(p.Location,    p.Location, this.GetRightVector()  , 12);
			p.Rotation = this.Rotation;
			glm.vec2.scaleAndAdd(p.Velocity, this.Velocity, this.GetForwardVector(), 260);

			p = this.Spawn(Projectile);
			glm.vec2.scaleAndAdd(p.Location, this.Location, this.GetForwardVector(), 12);
			glm.vec2.scaleAndAdd(p.Location,    p.Location, this.GetRightVector()  , -12);
			p.Rotation = this.Rotation;
			glm.vec2.scaleAndAdd(p.Velocity, this.Velocity, this.GetForwardVector(), 260);

			this.LastFiredTime = this.core.GetTime();

			this.ApplyThrust(-5, dt);
		}
	}


	Tick(dt)
	{
		glm.vec2.scaleAndAdd(this.Location, this.Location, this.Velocity, dt);
		glm.vec2.scale(this.Velocity, this.Velocity, 1-0.7*dt);
	}

	Render()
	{
		super.Render();

		let sm = glm.vec2.dot(this.Velocity, this.GetForwardVector());
		if(sm > 20)
		{
			let n = Math.min(Math.floor(sm / 300 * this.ThrustAnimationOn.Count), this.ThrustAnimationOn.Count-1);
			this.DrawTexture(this.ThrustAnimationOn.GetFrameNum(n));
		}

		this.DrawTexture("Texture_Ship_Base");

		this.DrawTexture(this.CannonAnimationFire.GetFrameNum(this.core.GetTime() - this.LastFiredTime < 0.2*this.FireInterval ? 1 : 0));

		this.DrawTexture(this.WingsAnimationIdle.GetFrameNum(this.bForwardThrust ? 1 : 0)); this.bForwardThrust = false;

		if(this.Controller == null)
			this.DrawTexture("Texture_Ship_Window_LightBlue")

	}
}

export {ShipPawn};
