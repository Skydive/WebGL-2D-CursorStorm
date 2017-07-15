import {Entity} from '../engine/entity';

class CameraEntity extends Entity
{
	constructor()
	{
		super();
		this.Speed = 10;
		this.Target = null;
	}

	BeginPlay()
	{
		super.BeginPlay();
	}

	Tick(dt)
	{
		this.core.Render.pipeline.CameraLocation = vec3.clone(this.Location);
		this.core.Render.pipeline.CameraRotation = quat.clone(this.Rotation);
	}
}
