import {Entity} from './engine/entity'



class Cursor extends Entity
{
	constructor()
	{
		super();
		this.Scale = [5, 5];
		this.Acceleration = 1200;
		this.Velocity = [0, 0];
		this.AngularVelocity = 4;
	}

	BeginPlay()
	{
		super.BeginPlay();
	}

	KeyboardControls(dt)
	{
		let r = 0;
		let th = 0;
		if     (this.core.Input.KeyDown("W"))	{r = 1;}
		else if(this.core.Input.KeyDown("S"))	{r = -1;}
		if     (this.core.Input.KeyDown("D"))	{th = 1;}
		else if(this.core.Input.KeyDown("A"))	{th = -1;}
		if(r != 0)
		{
			this.Velocity[0] += -r*this.Acceleration*Math.sin(this.Rotation)*dt;
			this.Velocity[1] += r*this.Acceleration*Math.cos(this.Rotation)*dt;
		}
		if(th != 0)
		{
			this.Rotation += th * this.AngularVelocity * dt;
			this.Rotation %= (2 * Math.PI);
		}
	}

	KeyboardControls(dt)
	{
		let r = 0;
		let th = 0;
		if     (this.core.Input.KeyDown("W"))	{r = 1;}
		else if(this.core.Input.KeyDown("S"))	{r = -1;}
		if     (this.core.Input.KeyDown("D"))	{th = 1;}
		else if(this.core.Input.KeyDown("A"))	{th = -1;}
		if(r != 0)
		{
			this.Velocity[0] += -r*this.Acceleration*Math.sin(this.Rotation)*dt;
			this.Velocity[1] += r*this.Acceleration*Math.cos(this.Rotation)*dt;
		}
		if(th != 0)
		{
			this.Rotation += th * this.AngularVelocity * dt;
			this.Rotation %= (2 * Math.PI);
		}
	}

	PhoneControls(dt)
	{
		let beta = this.core.Input.phone.beta;
		if(beta != null)
		{
			let r = -(beta-45)/50;
			this.Velocity[0] += -r*this.Acceleration*Math.sin(this.Rotation)*dt;
			this.Velocity[1] += r*this.Acceleration*Math.cos(this.Rotation)*dt;
		}
		let gamma = this.core.Input.phone.gamma;
		if(gamma != null)
		{
			this.Rotation += gamma/50 * this.AngularVelocity * dt;
			this.Rotation %= (2 * Math.PI);
		}
	}

	Tick(dt)
	{

		this.KeyboardControls(dt);
		this.PhoneControls(dt);

		this.Location[0] += this.Velocity[0]*dt;
		this.Location[1] += this.Velocity[1]*dt;

		this.Velocity[0] *= 1 - 0.7*dt;
		this.Velocity[1] *= 1 - 0.7*dt;
		console.log(this.Location);
	}

	DrawTexture(x, y, r, xs, ys, tex)
	{
		let gl = this.core.Render.gl;
		let w = 5;
		let h = 5;
		if(tex.image !== null)
		{
			w = tex.image.naturalWidth;
			h = tex.image.naturalHeight;
		}
		x = x - w/2;
		y = y - h/2;

		let shader = this.core.Resource.Get("ShaderEntity");
		shader.Texture = tex;
		shader.Enable();

		let pipeline = this.core.Render.pipeline;

		let V = pipeline.GetViewMatrix();
		gl.uniformMatrix3fv(shader.uV, false, V);

		let M = pipeline.GetModelMatrix([x, y], r, [w*xs, h*ys])
		gl.uniformMatrix3fv(shader.uM, false, M);

		var vertices = [
			-1, 1, 0,
			-1,-1, 0,
			 1,-1, 0,
			 1, 1, 0];

		var indices = [
			0, 1, 2,
			0, 2, 3];

		var textureCoordinates = [
		    0.0,  0.0,
		    0.0,  1.0,
		    1.0,  1.0,
		    1.0,  0.0];

		var vertex_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		gl.vertexAttribPointer(shader.aVertex, 3, gl.FLOAT, false, 0, 0);

		var tex_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, tex_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
		gl.vertexAttribPointer(shader.aUV, 2, gl.FLOAT, false, 0, 0);

		var Index_Buffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
		gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		shader.Disable();
	}

	Render()
	{
		super.Render();
		this.DrawTexture(this.Location[0], this.Location[1], this.Rotation, this.Scale[0], this.Scale[1], this.core.Resource.Get("TextureCursor"));
	}
}
export {Cursor};
