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
			return;
		}

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
			glm.vec2.sub(AB, TargetPawn.Location, Pawn.Location);
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
		let TargetPawn = this.TargetPawnPtr.Deref;
		let Pawn = this.PawnPtr.Deref;
		if(TargetPawn == null)
		{
			for(let i in this.core.Scene.EntityList)
			{
				let ent = this.core.Scene.EntityList[i];
				if(ent.isChildOfClass(ShipPawn))
				{

					if(ent.ControllerPtr.Deref != null && ent.ControllerPtr.Deref.isChildOfClass(ShipController))
					{
						let AB = glm.vec2.create();
						glm.vec2.sub(AB, ent.Location, Pawn.Location);
						if(glm.vec2.length(AB) <= this.TargetRadius)
						{
							this.TargetPawnPtr = ent.Ref;
						}
					}
				}
			}
		}
		else
		{
			if(TargetPawn.ControllerPtr.Deref == null)
			{
				TargetPawn = NULL_PTR;
			}

			let AB = glm.vec2.create();
			glm.vec2.sub(AB, TargetPawn.Location, Pawn.Location);
			if(glm.vec2.length(AB) >= this.LoseRadius)
			{
				this.TargetPawnPtr = NULL_PTR;
			}
		}
	}
}

export {ShipBotController}
