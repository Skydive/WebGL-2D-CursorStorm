import {Entity} from 'engine/entity'
import {Animation} from 'engine/animation'
import {Effect} from 'framework/effect'

import {ShipPawn} from 'game/shippawn'
import {ShipController} from 'game/shipcontroller'

import * as glm from 'gl-matrix'


const COIN_TABLE = [
{
	type: "bronze",
	color: [0.56, 0.35, 0.14],
	scale: 1,
	value: 100
},
{
	type: "silver",
	color: [0.75, 0.75, 0.75],
	scale: 1,
	value: 200
},
{
	type: "gold",
	color: [1.00, 0.84, 0.00],
	scale: 1,
	value: 500
}]


class Coin extends Entity
{
	constructor()
	{
		super();
		this.bPhysics = false;
		this.bCollision = true;

		this.Scale = [0.1, 0.1];

		this.Type = "";
		this.Color = [255, 255, 255];
		this.Value = 0;
	}

	static Precache(core)
	{
		core.Resource.LoadAnimation("Animation_Coin_Spin", "res/tex/coin/coin_%.png", 8);
	}

	BeginPlay()
	{
		super.BeginPlay();

		this.Collision.CollisionClassList = [ShipPawn];
		this.Collision.RadiusScale = 0.7;

		this.CoinSpin = Animation.Create(this.core, "Animation_Coin_Spin");
		this.CoinSpin.Duration = 0.6;
		this.CoinSpin.bLoop = true;
		this.CoinSpin.Start();
	}

	PostBeginPlay()
	{
		if(!this.AssignCoin(this.Type))
		{
			this.AssignCoin(COIN_TABLE[Math.floor(Math.random() * COIN_TABLE.length)].type);
		}
	}

	AssignCoin(type)
	{
		for(let k in COIN_TABLE)
		{
			let v = COIN_TABLE[k];
			if(v.type == type)
			{
				this.Type = v.type;
				this.Color = glm.vec3.clone(v.color);
				glm.vec2.scale(this.Scale, this.Scale, v.scale);
				this.Value = v.value;
				return true;
			}
		}
		return false;
	}

	Tick(dt)
	{
		this.Collision.FromTexture("Animation_Coin_Spin");
		this.CoinSpin.Tick(dt);
		super.Tick(dt);
	}

	OnCollision(collided, dt)
	{
		let Controller = collided.ControllerPtr.Deref;
		if(Controller != null
		&& Controller.isChildOfClass(ShipController))
		{
			Controller.Money += this.Value;
		}
		this.Destroy();
	}

	OnDestroyed()
	{
		let ExplodeEffect = this.Spawn(Effect);
		ExplodeEffect.Location = glm.vec2.clone(this.Location);
		ExplodeEffect.Sequence = Animation.Create(this.core, "Animation_Projectile_Explode");
		ExplodeEffect.Sequence.Duration = 0.25;
	}

	Render()
	{
		this.DrawTexture(this.CoinSpin.GetFrame(), 1, this.Color);
	}
}
export {Coin};
