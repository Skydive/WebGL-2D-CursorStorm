import {Base} from 'engine/base'
import {Transform} from 'engine/mixins/transform'
import {CollisionComponent} from 'engine/components/collisioncomponent'
import {PhysicsComponent} from 'engine/components/physicscomponent'

import * as glm from 'gl-matrix'

class EntityWeakPtr extends Base
{
	constructor(id)
	{
		super()
		this.ID = id;
		this.core = null;
	}
	get Deref()
	{
		if(this.core == null)
			return null;
		for(let i in this.core.Scene.EntityList)
		{
			if(this.core.Scene.EntityList[i].ID == this.ID)
				return this.core.Scene.EntityList[i];
		}
		return null;
	}
}
const NULL_PTR = new EntityWeakPtr(-1);

class Entity extends Transform(Base)
{
	constructor()
	{
		super();
		this.ID = Entity.MaxID++;

		this.bDestroyed = false;
		this.bCollision = false;
		this.bPhysics = false;

		this.Collision = null;
		this.Physics = null;

		this.bLifeSpan = false;
		this.LifeSpan = 0;
	}

	get Ref()
	{
		return this.CreateObject(EntityWeakPtr, this.ID);
	}

	BeginPlay()
	{
		if(this.bCollision)
			this.Collision = this.CreateObject(CollisionComponent);
		if(this.bPhysics)
			this.Physics = this.CreateObject(PhysicsComponent);
	}

	PostBeginPlay(){}

	// Collision
	OnCollisionStart(collided, dt){}
	OnCollision(collided, dt){}
	OnCollisionEnd(collided, dt){}

	// Render
	Render(){}
	DrawTexture(texname, depth, color)
	{
		if(depth == undefined)
			depth = 0;
		if(color == undefined)
			color = [1.0, 1.0, 1.0];
		this.core.Render.DrawTexture(this, texname, depth, color);
	}

	// Ticks
	PreTick(dt){}
	Tick(dt){}
	PostTick(dt)
	{
		if(this.bCollision)
			this.Collision.Tick(dt);
		if(this.bPhysics)
			this.Physics.Tick(dt);

		if(this.bLifeSpan)
		{
			this.LifeSpan -= dt;
			if(this.LifeSpan < 0)
				this.Destroy();
		}
	}

	Destroy()
	{
		this.bDestroyed = true;
	}
	OnDestroyed(){}

	Spawn(obj, owner)
	{
		return this.core.Scene.Spawn(obj, owner);
	}
}
Entity.MaxID = 0;
export {Entity, NULL_PTR};
