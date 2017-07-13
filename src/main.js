import {Core} from './engine/core';

import {ShipController} from './shipcontroller.js';
import {ShipPawn} from './shippawn.js';
//import {CameraEntity} from './cameraentity';

console.log("Main.js executed!");


class GameCore extends Core
{
	constructor()
	{
		super();
		this.C = null;
		this.PawnList = [];

		this.SwitchIndex = 0;
		this.LastSwitchTime = 0;
		this.SwitchInterval = 0.25;
	}

	BeginPlay()
	{
		super.BeginPlay();
		console.log("Game Core executed!");

		ShipPawn.Precache(this);

		this.core.Render.pipeline.CameraMag = [3, 3];

		this.C = this.Scene.Spawn(ShipController);

		for(let i=0; i<5; i++)
		{
			let p = this.Scene.Spawn(ShipPawn);

			p.Location = [(i-2)*64, 0];
			p.Rotation = 90 * (Math.PI/180);
			this.PawnList.push(p);
		}

		this.C.Possess(this.PawnList[this.SwitchIndex]);
	}

	Tick(dt)
	{
		super.Tick(dt);
		if(this.Input.KeyDown("LEFT"))
		{
			if(this.GetTime() - this.LastSwitchTime > this.SwitchInterval)
			{
				this.SwitchIndex = (this.SwitchIndex - 1) % this.PawnList.length;
				if(this.SwitchIndex < 0)
					this.SwitchIndex = this.PawnList.length + this.SwitchIndex;
				this.C.Possess(this.PawnList[this.SwitchIndex]);
				this.LastSwitchTime = this.GetTime();
			}
		}
		if(this.Input.KeyDown("RIGHT"))
		{
			if(this.GetTime() - this.LastSwitchTime > this.SwitchInterval)
			{
				this.SwitchIndex = (this.SwitchIndex + 1) % this.PawnList.length;
				if(this.SwitchIndex < 0)
					this.SwitchIndex = this.PawnList.length + this.SwitchIndex;
				this.C.Possess(this.PawnList[this.SwitchIndex]);
				this.LastSwitchTime = this.GetTime();
			}
		}
	}
}

function OnLoad()
{
	let core = new GameCore();
	core.Start({
		canvasid: "glcanvas"
	});
}
export {OnLoad};
