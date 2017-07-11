import {Base} from '../base'
import {Entity} from '../entity'

class Scene extends Base
{
	constructor()
	{
		super();
		this.EntityList = [];
	}

	Tick(dt)
	{
		this.EntityList.forEach( (ent) => {
			ent.Tick(dt);
			ent.Render();
		});
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
		for(let ent in this.EntityList)
		{
			if(ent.bDestroyed)
			{
				this.EntityList.pop(ent);
				ent = null;
			}
		}
	}
}
export {Scene};
