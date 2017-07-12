import * as glm from 'gl-matrix'


let Transform = (superclass) => class extends superclass {
	constructor()
	{
		super();
		this.Location = glm.vec2.create();
		this.Rotation = 0;
		this.OffsetLocation = glm.vec2.create();
		this.OffsetRotation = 0;
		this.Scale = [1, 1];
	}

	GetForwardVector()
	{
		let v = glm.vec2.create();
		let R = glm.mat2.create();
		glm.mat2.fromRotation(R, this.Rotation+this.OffsetRotation);
		glm.vec2.transformMat2(v, [1, 0], R);
		return v;
	}

	GetRightVector()
	{
		let v = glm.vec2.create();
		let R = glm.mat2.create();
		glm.mat2.fromRotation(R, this.Rotation+this.OffsetRotation);
		glm.vec2.transformMat2(v, [0, 1], R);
		return v;
	}
};

export {Transform};
