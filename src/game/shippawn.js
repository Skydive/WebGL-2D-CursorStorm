import {Entity} from '../engine/entity'
import {Animation} from '../engine/animation'

import * as glm from 'gl-matrix'

class Projectile extends Entity
{
	constructor()
	{
		super();
		this.bPhysics = true;
		this.bCollision = true;
		this.bRender = true;

		this.OffsetRotation = -90 * (Math.PI/180);

		this.LifeSpan = 10;
	}

	Tick(dt)
	{
		this.LifeSpan -= dt;
		if(this.LifeSpan < 0)
			this.Destroy();
		super.Tick(dt);
	}

	Draw()
	{
		this.Render.DrawTexture("Texture_Ship_Projectile");
	}
}

class ShipPawn extends Entity
{
	constructor()
	{
		super();
		this.bPhysics = true;
		this.bCollision = true;
		this.bRender = true;

		this.OffsetRotation = -90 * (Math.PI/180);

		this.Force = 240;
		this.Velocity = [0, 0];
		this.AngularVelocity = 4;

		this.bForwardThrust = false;

		this.LastFiredTime = 0;
		this.FireInterval = 0.15;

		this.Controller = null;

		this.Color = [1.0, 0.3, 0.3, 1.0];
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

	Draw()
	{
		let sm = glm.vec2.dot(this.Physics.Velocity, this.GetForwardVector());
		if(sm > 20)
		{
			let n = Math.min(Math.floor(sm / 300 * this.ThrustAnimationOn.Count), this.ThrustAnimationOn.Count-1);
			this.Render.DrawTexture(this.ThrustAnimationOn.GetFrameNum(n));
		}

		this.Render.DrawTexture("Texture_Ship_Base");

		this.Render.DrawTexture(this.CannonAnimationFire.GetFrameNum(this.core.GetTime() - this.LastFiredTime < 0.2*this.FireInterval ? 1 : 0), this.Color);
		this.Render.DrawTexture(this.WingsAnimationIdle.GetFrameNum(this.bForwardThrust ? 1 : 0), this.Color); this.bForwardThrust = false;

		function hslToRgb(h, s, l){
	        var r, g, b;

	        if(s == 0){
	            r = g = b = l; // achromatic
	        }else{
	            var hue2rgb = function hue2rgb(p, q, t){
	                if(t < 0) t += 1;
	                if(t > 1) t -= 1;
	                if(t < 1/6) return p + (q - p) * 6 * t;
	                if(t < 1/2) return q;
	                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
	                return p;
	            }

	            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	            var p = 2 * l - q;
	            r = hue2rgb(p, q, h + 1/3);
	            g = hue2rgb(p, q, h);
	            b = hue2rgb(p, q, h - 1/3);
	        }

	        return [r, g, b, 1.0];
	    }

		let c = [0.8, 1.0, 1.0, 1.0];
		if(this.Controller != null)
			c = hslToRgb(this.core.GetElapsedTime()/10 % 1, 1.0, 0.75);
		this.Render.DrawTexture("Texture_Ship_Window", c);

	}

	OnCollision(collided, dt)
	{
		// Handle collision with vector math:
		if(collided.isChildOfClass(ShipPawn))
		{
			// Get radial component.
			let r = glm.vec2.create();
			glm.vec2.sub(r, collided.Location, this.Location);
			glm.vec2.normalize(r, r);
			// Get radial length (Force it to be towards so escape is possible when stuck)
			let rmag = Math.abs(glm.vec2.dot(this.Physics.Velocity, r));
			// Reflect with radial as the normal
			glm.vec2.scale(r, r, 2*rmag);
			glm.vec2.sub(this.Physics.Velocity, this.Physics.Velocity, r);
		}
		console.log("COLLIDED!");
	}

	ApplyThrust(scale, dt)
	{
		if(scale > 0)
			this.bForwardThrust = true;

		let force = glm.vec3.create();
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
			let p = this.Spawn(Projectile);
			glm.vec2.scaleAndAdd(p.Location, this.Location, this.GetForwardVector(), 12);
			glm.vec2.scaleAndAdd(p.Location,    p.Location, this.GetRightVector()  , 12);
			p.Rotation = this.Rotation;
			glm.vec2.scaleAndAdd(p.Physics.Velocity, this.Physics.Velocity, this.GetForwardVector(), 260);

			p = this.Spawn(Projectile);
			glm.vec2.scaleAndAdd(p.Location, this.Location, this.GetForwardVector(), 12);
			glm.vec2.scaleAndAdd(p.Location,    p.Location, this.GetRightVector()  , -12);
			p.Rotation = this.Rotation;
			glm.vec2.scaleAndAdd(p.Physics.Velocity, this.Physics.Velocity, this.GetForwardVector(), 260);

			this.LastFiredTime = this.core.GetTime();

			this.ApplyThrust(-5, dt);
		}
	}
}

export {ShipPawn};
