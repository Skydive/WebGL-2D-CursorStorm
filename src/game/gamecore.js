import {Core} from 'engine/core'

import {ShipController} from 'game/shipcontroller'
import {ShipBotController} from 'game/shipbotcontroller'
import {ShipPawn} from 'game/shippawn'
import {ShipProjectile} from 'game/shipprojectile'

import {Coin} from 'game/coin'
import {BackgroundEntity} from 'game/background'

import {Rock} from 'game/rock'

class GameCore extends Core
{
	constructor()
	{
		super();
		this.PlayerControllerPtr = null;
		this.PawnPtrList = [];

		this.BackgroundPtr = null;

		this.SwitchIndex = 0;
		this.LastSwitchTime = 0;
		this.SwitchInterval = 0.25;
	}

	Precache(args)
	{
		this.Log("Created");

		this.Log("Precache Begin");

		super.Precache(args);

		BackgroundEntity.Precache(this);
		ShipProjectile.Precache(this);
		ShipPawn.Precache(this);
		Coin.Precache(this);
		Rock.Precache(this);
	}

	BeginPlay()
	{
		super.BeginPlay();
		console.log("Game Core executed!");

		let C = this.Scene.Spawn(ShipController);
		this.PlayerControllerPtr = C.Ref;

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
			this.PawnPtrList.push(p.Ref);
		}

		C.Possess(this.PawnPtrList[this.SwitchIndex]);

		this.BackgroundPtr = this.Scene.Spawn(BackgroundEntity).Ref;
		this.BackgroundPtr.Deref.TargetPtr = C.CameraPtr;

		let e = this.Scene.Spawn(ShipPawn);
		e.Location = [0, 300];
		e.default.Color = [0.2, 1.0, 1.0];
		e.Color = e.default.Color;
		this.Scene.Spawn(ShipBotController).Possess(e.Ref);

		let c = this.Scene.Spawn(Coin);
		c.Type = "bronze";
		c.Location = [0, -500];

		c = this.Scene.Spawn(Coin);
		c.Type = "silver";
		c.Location = [50, -500];

		c = this.Scene.Spawn(Coin);
		c.Type = "gold";
		c.Location = [100, -500];
	}

	Tick(dt)
	{
		let C = this.PlayerControllerPtr.Deref;

		this.PawnPtrList = this.PawnPtrList.filter(ptr => ptr.Deref != null);
		super.Tick(dt);
		if(this.Input.KeyDown("LEFT") || this.Input.KeyDown("RIGHT"))
		{
			if(this.GetTime() - this.LastSwitchTime > this.SwitchInterval)
			{
				let n = this.Input.KeyDown("LEFT") ? -1 :
					   (this.Input.KeyDown("RIGHT")?  1 : 0);
				this.SwitchIndex = (this.SwitchIndex - n) % this.PawnPtrList.length;
				if(this.SwitchIndex < 0)
					this.SwitchIndex = this.PawnPtrList.length + this.SwitchIndex;
				C.Possess(this.PawnPtrList[this.SwitchIndex]);
				this.LastSwitchTime = this.GetTime();
			}
		}
	}
}
export {GameCore};
