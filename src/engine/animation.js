import {Base} from 'engine/base'

class Animation extends Base
{
	constructor()
	{
		super();
		this.Name = null;
		this.Duration = 0;
		this.bActive = false;
		this.bLoop = false;
		this.Time = 0;
		this.bReverse = false;
		this.CompletedFunc = null;
	}

	static Create(core, name)
	{
		let a = new Animation();
		a.Name = name;
		a.core = core;
		return a;
	}

	Start()
	{
		this.bActive = true;
		this.Time = 0;
	}

	get Count()
	{
		return this.core.Resource.Get(this.Name).count;
	}

	Stop()
	{
		this.bActive = false;
	}

	Tick(dt)
	{
		if(this.bActive)
		{
			this.Time += dt;
			if(this.Time > this.Duration && !this.bLoop)
			{
				this.bActive = false;
				if(this.CompletedFunc != null)
					this.CompletedFunc();
			}
		}
	}

	IsActive()
	{
		return this.bActive;
	}

	OnCompleted(func)
	{
		this.CompletedFunc = func;
	}

	GetFrame()
	{
		let frame = Math.floor(this.Time/this.Duration * this.Count) % this.Count;
		return this.Name + "_" + (this.bReverse ? this.Count-1 - frame : frame);
	}
	GetFrameNum(n)
	{
		return this.Name + "_" + n;
	}
}

export {Animation};
