import {Base} from './base'

import {Input} from './managers/input'
import {Render} from './managers/render'
import {Resource} from './managers/resource'
import {Scene} from './managers/scene'

class Core extends Base
{
	constructor()
	{
		super();
		this.core = this;
	}

	GetTime() { return Date.now() / 1000; }
	GetElapsedTime() { return this.GetTime() - this.StartTime; }

	Start(args)
	{
		this.StartTime = this.GetTime();
		this.LastUpdate = this.StartTime;

		console.info("Create Manager: Scene");
		this.Scene = this.CreateObject(Scene);
		this.Scene.BeginPlay();

		console.info("Create Manager: Resource");
		this.Resource = this.CreateObject(Resource);
		this.Resource.BeginPlay();

		console.info("Create Manager: Input");
		this.Input = this.CreateObject(Input);
		this.Input.BeginPlay();

		console.info("Create Manager: Render");
		this.Render = this.CreateObject(Render);
		this.Render.canvasid = args.canvasid;
		this.Render.BeginPlay();

		this.BeginPlay();
		this.MainLoop();
	}

	MainLoop()
	{
		this.dt = this.GetTime() - this.LastUpdate;
		this.LastUpdate = this.GetTime();
		let dt = this.dt;

		this.Input.Tick(dt);
		this.Tick(dt);
		this.Scene.Tick(dt);

		this.Render.RenderClear();
		this.Render.RenderBackground();
		this.Scene.Render();
		this.Render.RenderPresent();

		window.requestAnimationFrame(this.MainLoop.bind(this));
	}

	BeginPlay(){}
	Tick(dt){}
}
export {Core};
