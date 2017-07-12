import {Core} from './engine/core';

import {Cursor} from './cursor';
//import {CameraEntity} from './cameraentity';

console.log("Main.js executed!");


class GameCore extends Core
{
	BeginPlay()
	{
		super.BeginPlay();
		console.log("Game Core executed!");
		this.core.Resource.LoadTexture("Texture_Ship_Base", "../res/ship/base.png");
		this.core.Resource.LoadTexture("Texture_Ship_Wings", "../res/ship/wings.png");
		this.core.Resource.LoadTexture("Texture_Ship_Wing_Cannon", "../res/ship/wing_cannon.png");
		this.core.Resource.LoadTexture("Texture_Ship_Thrust", "../res/ship/thrust.png");

		let c = this.core.Scene.Spawn(Cursor);

		c.Location = [0, 0];
		c.Rotation = 90 * (Math.PI/180);
	}

	Tick(dt)
	{
		super.Tick(dt);
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
