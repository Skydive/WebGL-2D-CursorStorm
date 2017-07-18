import {Base} from './base'
import {Transform} from './mixins/transform'
import {CollisionComponent} from './components/collisioncomponent'
import {PhysicsComponent} from './components/physicscomponent'

import * as glm from 'gl-matrix'


class Entity extends Transform(Base)
{
	constructor()
	{
		super();
		this.bDestroyed = false;
		this.bCollision = false;
		this.bPhysics = false;

		this.bLifeSpan = false;
		this.LifeSpan = 0;
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
	DrawTexture(texname, color)
	{
		this.core.Render.DrawTexture(this, texname, color);
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
export {Entity};
