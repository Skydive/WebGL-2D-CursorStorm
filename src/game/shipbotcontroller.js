import {NULL_PTR} from '../engine/entity'
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
		this.TargetPawnPtr = NULL_PTR;

		this.Zeal = 0.75;
		this.TargetRadius = 300;
		this.AttackRadius = 150;
		this.LoseRadius = 500;
	}

	Tick(dt)
	{
		let Pawn = this.PawnPtr.Deref;
		let TargetPawn = this.TargetPawnPtr.Deref;
		if(Pawn == null)
		{
			this.Destroy();
		}

		// Stupid JS Garbage Collection
		if(TargetPawn != null)
			TargetPawn = null;

		this.EstablishTargetPawn();
		this.AttackSequence(dt);
	}

	AttackSequence(dt)
	{
		let TargetPawn = this.TargetPawnPtr.Deref;
		let Pawn = this.PawnPtr.Deref;
		if(TargetPawn != null)
		{
			let AB = glm.vec2.create();
			glm.vec2.sub(AB, TargetPawn.Location, this.Pawn.Location);
			let theta = Math.sign(AB[1])*Math.acos(AB[0]/glm.vec2.length(AB));
			Pawn.Rotation = theta;

			Pawn.ApplyThrust(this.Zeal, dt);

			glm.vec2.sub(AB, TargetPawn.Location, Pawn.Location);
			if(glm.vec2.length(AB) <= this.AttackRadius)
			{
				Pawn.FireCannon(dt);
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
