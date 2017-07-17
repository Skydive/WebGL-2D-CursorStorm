import {Base} from '../base'
import {Entity} from '../entity'

class Scene extends Base
{
	constructor()
	{
		super();
		this.EntityList = [];
	}

	BeginPlay(){}

	Tick(dt)
	{
		for(let i in this.EntityList)
		{
			let ent = this.EntityList[i];
			ent.Tick(dt);
			ent.Draw();
		}
		this.RefreshEntities();
	}

	Spawn(obj, owner)
	{
		let ent = new obj();
		ent.core = this.core;
		ent.owner = (owner === undefined) ? this : owner;
		ent.BeginPlay();
		this.EntityList.push(ent);
		return ent;
	}

	RefreshEntities()
	{
		for(let i=0; i<this.EntityList.length; i++)
		{
			let ent = this.EntityList[i];
			if(ent.bDestroyed)
			{
				ent.OnDestroyed();
				delete this.EntityList[i];
				this.EntityList.splice(i, 1); i--;
			}
		}
	}
}
export {Scene};
