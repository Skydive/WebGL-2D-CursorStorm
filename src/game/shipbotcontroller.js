import {Controller} from '../framework/controller'
import {CameraEntity} from './cameraentity';


import {ShipPawn} from './shippawn'
import {ShipController} from './shipcontroller'

import * as glm from 'gl-matrix'

class ShipBotController extends Controller
{
	constructor()
	{
		super();
		this.TargetPawn = null;

		this.Zeal = 0.75;
		this.TargetRadius = 300;
		this.AttackRadius = 150;
		this.LoseRadius = 500;
	}

	Tick(dt)
	{
		if(this.Pawn == null || this.Pawn.bDestroyed)
		{
			this.Destroy();
		}

		// Stupid JS Garbage Collection
		if(this.TargetPawn != null && this.TargetPawn.bDestroyed)
			this.TargetPawn = null;

		this.EstablishTargetPawn();
		this.AttackSequence(dt);
	}

	AttackSequence(dt)
	{
		if(this.TargetPawn != null)
		{
			let AB = glm.vec2.create();
			glm.vec2.sub(AB, this.TargetPawn.Location, this.Pawn.Location);
			let theta = Math.sign(AB[1])*Math.acos(AB[0]/glm.vec2.length(AB));
			this.Pawn.Rotation = theta;

			this.Pawn.ApplyThrust(this.Zeal, dt);

			glm.vec2.sub(AB, this.TargetPawn.Location, this.Pawn.Location);
			if(glm.vec2.length(AB) <= this.AttackRadius)
			{
				this.Pawn.FireCannon(dt);
			}
		}
	}

	EstablishTargetPawn()
	{
		if(this.TargetPawn == null)
		{
			for(let i in this.core.Scene.EntityList)
			{
				let ent = this.core.Scene.EntityList[i];
				if(ent.isChildOfClass(ShipPawn))
				{
					if(ent.Controller != null && ent.Controller.isChildOfClass(ShipController))
					{
						let AB = glm.vec2.create();
						glm.vec2.sub(AB, ent.Location, this.Pawn.Location);
						if(glm.vec2.length(AB) <= this.TargetRadius && !ent.bDestroyed)
						{
							this.TargetPawn = ent;
						}
					}
				}
			}
		}
		else
		{
			if(this.TargetPawn != null)
			{
				if(this.TargetPawn.Controller == null)
				{
					this.TargetPawn = null;
				}

				let AB = glm.vec2.create();
				glm.vec2.sub(AB, this.TargetPawn.Location, this.Pawn.Location);
				if(glm.vec2.length(AB) >= this.LoseRadius)
				{
					this.TargetPawn = null;
				}
			}
		}
	}
}

export {ShipBotController}
