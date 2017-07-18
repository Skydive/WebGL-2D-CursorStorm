import {Core} from './engine/core';

import {ShipController} from './game/shipcontroller';
import {ShipBotController} from './game/shipbotcontroller';
import {ShipPawn} from './game/shippawn';
import {ShipProjectile} from './game/shipprojectile'
import {BackgroundEntity} from './game/background';

console.log("Main.js executed!");


class GameCore extends Core
{
	constructor()
	{
		super();
		this.C = null;
		this.Camera = null;
		this.PawnList = [];

		this.SwitchIndex = 0;
		this.LastSwitchTime = 0;
		this.SwitchInterval = 0.25;
	}

	BeginPlay()
	{
		super.BeginPlay();
		console.log("Game Core executed!");

		BackgroundEntity.Precache(this);
		ShipProjectile.Precache(this);
		ShipPawn.Precache(this);

		this.core.Render.pipeline.CameraMag = [3, 3];

		this.C = this.Scene.Spawn(ShipController);

		this.ColorList = [
			[1.0, 0.2, 0.2],
			[0.2, 1.0, 0.2],
			[0.2, 0.2, 1.0],
			[1.0, 1.0, 0.2],
			[1.0, 0.2, 1.0]];

		for(let i=0; i<5; i++)
		{
			let p = this.Scene.Spawn(ShipPawn);
			p.Location = [(i-2)*64, 0];
			p.Rotation = 90 * (Math.PI/180);
			p.default.Color = this.ColorList[i % this.ColorList.length];
			p.Color = p.default.Color;
			this.PawnList.push(p);
		}

		this.C.Possess(this.PawnList[this.SwitchIndex]);


		this.Background = this.Scene.Spawn(BackgroundEntity);
		this.Background.Target = this.C.Camera;


		let e = this.Scene.Spawn(ShipPawn);
		e.Location = [0, 300];
		e.default.Color = [0.2, 1.0, 1.0];
		e.Color = e.default.Color;
		this.Scene.Spawn(ShipBotController).Possess(e);
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
