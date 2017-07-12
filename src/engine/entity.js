import {Base} from './base'
import {Transform} from './mixins/transform'
import * as glm from 'gl-matrix'

class Entity extends Transform(Base)
{
	constructor()
	{
		super();
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
