import {Base} from '../base'

import * as glm from 'gl-matrix'


const BASIS_VECTOR = [1, 0];

class Pipeline extends Base
{
	constructor()
	{
		super();
		this.CameraLocation = glm.vec2.create();
		this.CameraRotation = glm.vec2.create();
	}

	GetProjectionMatrix(w, h) { return null; }
	GetViewMatrix() { return null; }
	GetModelMatrix(loc, rad, scale)
	{
		let M = glm.mat3.create();
		glm.mat3.translate(M, M, loc);
		glm.mat3.rotate(M, M, rad);
		glm.mat3.scale(M, M, scale);
	}
}

class Render extends Base
{
	constructor()
	{
		super();
		this.pipeline = new Pipeline();
		this.canvasid = null;
		this.canvas = null;
		this.gl = null;
	}

	BeginPlay()
	{
		this.canvas = document.getElementById(this.canvasid);
		if(!this.canvas)
		{
			console.error("Canvas ID not found!");
			throw "Canvas ID not found!";
		}

		try
		{
			this.gl =  this.canvas.getContext("webgl2")
					|| this.canvas.getContext("webgl");
		}
		catch(e)
		{
			console.error("WebGL not supported!");
			throw "WebGL not supported!";
		}

		let gl = this.gl;
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);

		this.ResizeViewport();
	}

	ResizeViewport()
	{
		let gl = this.gl;
		this.displayWidth = this.canvas.clientWidth;
		this.displayHeight = this.canvas.clientHeight;
		if(this.canvas.width != this.displayWidth || this.canvas.height != this.displayHeight)
		{
			this.canvas.width = this.displayWidth;
			this.canvas.height = this.displayHeight;
		}
		gl.viewport(0, 0, this.canvas.width, this.canvas.height);
	}

	RenderClear()
	{
		let gl = this.gl;
		gl.clearColor(0.5, 0.5, 0.5, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	RenderPresent(){}
}
export {BASIS_VECTOR, Render};
