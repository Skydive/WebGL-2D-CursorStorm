import {Base} from 'engine/base'

import {Input} from 'engine/managers/input'
import {Render} from 'engine/managers/render'
import {Resource} from 'engine/managers/resource'
import {Scene} from 'engine/managers/scene'

class Core extends Base
{
	constructor()
	{
		super();
		this.core = this;
		this.bPrecached = false;
	}

	GetTime() { return Date.now() / 1000; }
	GetElapsedTime() { return this.GetTime() - this.StartTime; }

	Precache(args)
	{
		this.Log("Create Manager: Scene");
		this.Scene = this.CreateObject(Scene);
		this.Scene.BeginPlay();

		this.Log("Create Manager: Resource");
		this.Resource = this.CreateObject(Resource);
		this.Resource.BeginPlay();

		this.Log("Create Manager: Input");
		this.Input = this.CreateObject(Input);
		this.Input.BeginPlay();

		this.Log("Create Manager: Render");
		this.Render = this.CreateObject(Render);
		this.Render.canvasid = args.canvasid;
		this.Render.BeginPlay();

		this.bPrecached = true;
	}

	Start()
	{
		if(!this.bPrecached)
		{
			this.Precache();
		}

		this.StartTime = this.GetTime();
		this.LastUpdate = this.StartTime;

		this.Input.BindEvents();

		this.BeginPlay();
		window.requestAnimationFrame(this.MainLoop.bind(this));
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
