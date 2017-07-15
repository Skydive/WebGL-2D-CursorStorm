import {Base} from './base'
import {Transform} from './mixins/transform'
import {CollisionComponent} from './components/collisioncomponent'
import {PhysicsComponent} from './components/physicscomponent'
import {RenderComponent} from './components/rendercomponent'
import * as glm from 'gl-matrix'


class Entity extends Transform(Base)
{
	constructor()
	{
		super();
		this.bDestroyed = false;

		this.bCollision = false;
		this.bPhysics = false;
		this.bRender = false;
	}

	BeginPlay()
	{
		if(this.bCollision)
			this.Collision = this.CreateObject(CollisionComponent);
		if(this.bPhysics)
			this.Physics = this.CreateObject(PhysicsComponent);
		if(this.bRender)
			this.Render = this.CreateObject(RenderComponent);
	}

	// Collision
	OnCollisionStart(collided, dt){}
	OnCollision(collided, dt){}
	OnCollisionEnd(collided, dt){}

	// Render
	Draw(){}


	Tick(dt)
	{
		if(this.bPhysics)
			this.Physics.Tick(dt);
		if(this.bCollision)
			this.Collision.Tick(dt);
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
