import {Base} from '../base'

import * as glm from 'gl-matrix'
/*
 *	Split collision detection into two levels:
 *	Level 1: Sphere Collision
 *	Level 2: Separating Axis Theorem
*/
class CollisionComponent extends Base
{
	constructor()
	{
		super();
		this.OnStartFunc = null;
		this.OnEndFunc = null;
		this.bColliding = false;

		this.Radius = 0;
		this.RadiusScale = 1;
		this.Width = 0;
		this.Height = 0;
		this.bCollisionExclude = false;
		this.CollisionClassList = [];

		this.OldTexName = null;
	}

	FromTexture(name)
	{
		let scale = this.owner.Scale;
		let img = this.core.Resource.Get(name).image;
		if(img != null && this.OldTexName != name)
		{
			this.Width = img.naturalWidth*scale[0];
			this.Height = img.naturalHeight*scale[1];
			this.Radius = Math.sqrt(this.Width**2 + this.Height**2)*this.RadiusScale;
			this.OldTexName = name;
		}
	}

	CanCollide(b)
	{
		if(this.owner == b || !b.bCollision)
			return false;

		for(let i in this.CollisionClassList)
		{
			if(b.isChildOfClass(this.CollisionClassList[i]))
			{
				return !this.bCollisionExclude;
			}
		}
		return this.bCollisionExclude;
	}

	static SphereCollision(a, b)
	{
		let ra = a.Collision.Radius;
		let rb = b.Collision.Radius;
		return glm.vec2.distance(a.Location, b.Location) < ra + rb;
	}

	static BoxCollision(a, b)
	{
		// TODO: Implement separating axes theorem
		return true;
	}

	Tick(dt)
	{
		let EntityList = this.core.Scene.EntityList;
		for(let i in EntityList)
		{
			let I = EntityList[i];
			if(this.CanCollide(I))
			{
				if(CollisionComponent.SphereCollision(this.owner, I))
				{
					if(CollisionComponent.BoxCollision(this.owner, I))
					{
						this.bColliding = true;
						this.owner.OnCollision(I, dt);
					}
				}
			}
		}
	}


}

export {CollisionComponent};
