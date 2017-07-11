import {Base} from './base'

class Entity extends Base
{
	constructor()
	{
		super();
		this.Location = [0, 0];
		this.Scale = [1, 1];
		this.Rotation = 0;

		this.bDestroyed = false;
	}

	BeginPlay(){}
	Tick(dt){}
	Render(){}
	Destroy()
	{
		this.bDestroyed = true;
	}

	Spawn(obj, owner)
	{
		var ent = new obj();
		ent.core = this.core;
		ent.owner = (owner === undefined) ? this : owner;
		ent.BeginPlay();
		this.EntityList.push(ent);
		return ent;
	}
}
export {Entity};
