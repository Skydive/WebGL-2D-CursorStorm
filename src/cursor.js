import {Entity} from './engine/entity'

import * as glm from 'gl-matrix'

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
	}

	BeginPlay()
	{
		super.BeginPlay();
	}

	ApplyThrust(scale, dt)
	{
		if(scale > 0)
			this.bForwardThrust = true;
		glm.vec3.scaleAndAdd(this.Velocity, this.Velocity, this.GetForwardVector(), scale*this.Acceleration*dt);
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
	}

	PhoneControls(dt)
	{
		let beta = this.core.Input.phone.beta;
		if(beta != null)
		{
			let r = -(beta-45)/50;
			this.ApplyThrust(r);
		}
		let gamma = this.core.Input.phone.gamma;
		if(gamma != null)
		{
			let th = gamma/50;
			this.Rotation = (this.Rotation+th*this.AngularVelocity*dt)%(2*Math.PI);
		}
	}

	Tick(dt)
	{
		this.bForwardThrust = false;

		this.KeyboardControls(dt);
		this.PhoneControls(dt);

		glm.vec2.scaleAndAdd(this.Location, this.Location, this.Velocity, dt)

		glm.vec2.scale(this.Velocity, this.Velocity, 1-0.7*dt);
	}

	Render()
	{
		super.Render();
		if(this.bForwardThrust)
			this.DrawTexture("Texture_Ship_Thrust");

		this.DrawTexture("Texture_Ship_Base");
		this.DrawTexture("Texture_Ship_Wing_Cannon");
		this.DrawTexture("Texture_Ship_Wings");


	}
}
export {Cursor};
