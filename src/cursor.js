import {Entity} from './engine/entity'
import {Animation} from './engine/animation'

import * as glm from 'gl-matrix'

class Projectile extends Entity
{
	constructor()
	{
		super();
		this.Scale = [5, 5];
		this.Velocity = [0, 0];

		this.OffsetRotation = -90 * (Math.PI/180);

		this.LifeSpan = 5;
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

class Cursor extends Entity
{
	constructor()
	{
		super();
		this.Scale = [5, 5];

		this.OffsetRotation = -90 * (Math.PI/180);

		this.Acceleration = 1200;
		this.Velocity = [0, 0];
		this.AngularVelocity = 4;

		this.bForwardThrust = false;

		this.LastFiredTime = 0;
		this.FireInterval = 0.25;
	}

	static Precache(core)
	{
		core.Resource.LoadTexture("Texture_Ship_Base", "../res/ship/base.png");
		core.Resource.LoadAnimation("Animation_Ship_Wings_Idle", "../res/ship/wings_idle_%.png", 2);
		core.Resource.LoadAnimation("Animation_Ship_Thrust_On", "../res/ship/thrust_on_%.png", 4);
		core.Resource.LoadAnimation("Animation_Ship_Cannon_Fire", "../res/ship/cannon_fire_%.png", 2);

		core.Resource.LoadTexture("Texture_Ship_Projectile", "../res/ship/projectile.png");
	}

	BeginPlay()
	{
		super.BeginPlay();
		this.ThrustAnimationOn = this.CreateObject(Animation, "Animation_Ship_Thrust_On", 0.5, false);
		this.WingsAnimationIdle = this.CreateObject(Animation, "Animation_Ship_Wings_Idle", 2, false);
		this.CannonAnimationFire = this.CreateObject(Animation, "Animation_Ship_Cannon_Fire", 1, false);
	}

	ApplyThrust(scale, dt)
	{
		if(scale > 0)
			this.bForwardThrust = true;
		glm.vec3.scaleAndAdd(this.Velocity, this.Velocity, this.GetForwardVector(), scale*this.Acceleration*dt);
	}

	FireCannon(dt)
	{
		if(this.core.GetTime() - this.LastFiredTime > this.FireInterval)
		{
			let p = this.Spawn(Projectile);

			let l = glm.vec2.create();
			glm.vec2.scaleAndAdd(l, l, this.GetForwardVector(), 13*5);
			glm.vec2.scaleAndAdd(l, l, this.GetRightVector(), 13*5);
			glm.vec2.add(p.Location, this.Location, l);

			p.Rotation = this.Rotation;
			glm.vec2.scaleAndAdd(p.Velocity, this.Velocity, this.GetForwardVector(), 1300);


			let q = this.Spawn(Projectile);

			let m = glm.vec2.create();
			glm.vec2.scaleAndAdd(m, m, this.GetForwardVector(), 13*5);
			glm.vec2.scaleAndAdd(m, m, this.GetRightVector(), -13*5);
			glm.vec2.add(q.Location, this.Location, m);

			q.Rotation = this.Rotation;
			glm.vec2.scaleAndAdd(q.Velocity, this.Velocity, this.GetForwardVector(), 1300);


			this.LastFiredTime = this.core.GetTime();

			this.ApplyThrust(-5, dt);
		}
	}

	KeyboardControls(dt)
	{
		let r = 0;
		let th = 0;
		if     (this.core.Input.KeyDown("W"))	{r = 1;}
		else if(this.core.Input.KeyDown("S"))	{r = -1;}
		if     (this.core.Input.KeyDown("A"))	{th = 1;}
		else if(this.core.Input.KeyDown("D"))	{th = -1;}
		if(r != 0)
		{
			this.ApplyThrust(r, dt);
		}
		if(th != 0)
		{
			this.Rotation = (this.Rotation+th*this.AngularVelocity*dt)%(2*Math.PI);
		}

		if(this.core.Input.KeyDown("SPACE"))
		{
			this.FireCannon(dt);
		}
	}

	PhoneControls(dt)
	{
		let beta = this.core.Input.phone.beta;
		if(beta != null)
		{
			beta = Math.max(Math.min(this.core.Input.phone.beta, 90), 0);
			let r = -(beta-45)/90;
			this.ApplyThrust(r, dt);
		}
		let gamma = this.core.Input.phone.gamma;
		if(gamma != null)
		{
			gamma = Math.max(Math.min(gamma, 45), -45);
			let th = -gamma/90;
			this.Rotation = (this.Rotation+th*this.AngularVelocity*dt)%(2*Math.PI);
		}
	}

	Tick(dt)
	{
		this.bForwardThrust = false;

		this.KeyboardControls(dt);
		this.PhoneControls(dt);

		glm.vec2.scaleAndAdd(this.Location, this.Location, this.Velocity, dt);
		glm.vec2.scale(this.Velocity, this.Velocity, 1-0.7*dt);

	}

	Render()
	{
		super.Render();

		let sm = glm.vec2.dot(this.Velocity, this.GetForwardVector());
		if(sm > 20)
		{
			let n = Math.min(Math.floor(sm / 1500 * (this.ThrustAnimationOn.GetCount())), this.ThrustAnimationOn.GetCount()-1);
			this.DrawTexture(this.ThrustAnimationOn.GetFrameNum(n));
		}


		this.DrawTexture(this.CannonAnimationFire.GetFrameNum(this.core.GetTime() - this.LastFiredTime < 0.2*this.FireInterval ? 1 : 0));
		this.DrawTexture(this.WingsAnimationIdle.GetFrameNum(this.bForwardThrust ? 1 : 0));

		this.DrawTexture("Texture_Ship_Base");

		if(this.WingsAnimationIdle.IsActive())
			this.DrawTexture(this.WingsAnimationIdle.GetFrame());
	}
}

export {Cursor};
