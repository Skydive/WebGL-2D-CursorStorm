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
		this.core.Resource.LoadTexture("TextureCursor", "../res/cursor.png");
		let c = this.core.Scene.Spawn(Cursor);

		c.Location = [0, 0];
		c.Rotation = 0;
	}

	Tick(dt)
	{
		super.Tick(dt);
		if(this.core.Input.KeyDown("W"))
			console.log("W");
		if(this.core.Input.KeyDown("S"))
			console.log("S");
		if(this.core.Input.KeyDown("A"))
			console.log("A");
		if(this.core.Input.KeyDown("D"))
			console.log("D");

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
