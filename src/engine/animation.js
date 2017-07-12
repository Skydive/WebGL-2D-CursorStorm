import {Base} from './base'

class Animation extends Base
{
	constructor(name, duration, loop)
	{
		super();
		this.Name = name;
		this.Duration = duration;
		this.Count = 0;
		this.bActive = false;
		this.bLoop = loop;
		this.Time = 0;
		this.bReverse = false;
		this.CompletedFunc = null;
	}

	Start(rev)
	{
		this.bReverse = rev;
		this.Count = this.GetCount();
		this.bActive = true;
		this.Time = 0;
	}

	GetCount()
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
					this.CompletedFunc(this);
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
