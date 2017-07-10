import {Base} from './base'

class Shader extends Base
{
	constructor()
	{
		super();
		this.Program = null;
	}

	BeginPlay()
	{
		let gl = this.core.Render.gl;
		this.Program = gl.createProgram();
	}

	Link()
	{
		let gl = this.core.Render.gl;
		gl.linkProgram(this.Program);
	}

	Enable()
	{
		let gl = this.core.Render.gl;
		gl.useProgram(this.Program);
	}

	Disable() {}
}


class EntityShader extends Shader
{
	constructor()
	{
		super();
		this.uM = null;

		this.uColor = null;
		this.uTime = null;
		this.uTexture = null;

		this.aVertex = null;
		this.aUV = null;

		this.Texture = null;
	}

	Link()
	{
		let gl = this.core.Render.gl;
		super.Link();

		this.uM = gl.getUniformLocation(this.Program, "M");

		this.uColor = gl.getUniformLocation(this.Program, "Color");
		this.uTexture = gl.getUniformLocation(this.Program, "Texture");
		this.uTime = gl.getUniformLocation(this.Program, "Time");

		this.aVertex = gl.getAttribLocation(this.Program, "Vertex");
		gl.enableVertexAttribArray(this.aVertex);

		this.aUV = gl.getAttribLocation(this.Program, "UV");
		gl.enableVertexAttribArray(this.aUV);
	}

	Enable()
	{
		super.Enable();
		let gl = this.core.Render.gl;
		gl.uniform1f(this.uTime, this.core.GetElapsedTime());

		if(this.Texture !== null)
		{
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.Texture);
			gl.uniform1i(this.uTexture, 0);
		}
	}

	Disable()
	{
		let gl = this.core.Render.gl;
		super.Disable();
		if(this.Texture !== null)
		{
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}
}

export {Shader, EntityShader};
