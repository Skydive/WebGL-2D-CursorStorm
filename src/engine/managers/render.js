import {Base} from '../base'

import {EntityShader} from '../shader'
import EntShaderVSrc from '../shaders/Entity.v.glsl';
import EntShaderFSrc from '../shaders/Entity.f.glsl';


import * as glm from 'gl-matrix'


const BASIS_VECTOR = [1, 0];

class Pipeline extends Base
{
	constructor()
	{
		super();
		this.CameraLocation = glm.vec2.create();
		this.CameraRotation = 0;
	}

	GetProjectionMatrix(w, h) { return null; }
	GetViewMatrix()
	{
		let w = this.core.Render.displayWidth;
		let h = this.core.Render.displayHeight;
		let V = glm.mat3.create();

		glm.mat3.scale(V, V, [1/w,  1/h]);


		glm.mat3.translate(V, V, [-this.CameraLocation[0], -this.CameraLocation[1]]);

		//glm.mat3.translate(V, V, [w/2 , h/2]);
		//glm.mat3.transpose(V, V);
		return V
	}
	GetModelMatrix(loc, rad, scale)
	{
		let M = glm.mat3.create();

		glm.mat3.translate(M, M, loc);
		glm.mat3.rotate(M, M, rad);
		glm.mat3.scale(M, M, scale);

		return M;
	}
}

class Render extends Base
{
	constructor()
	{
		super();
		this.pipeline = null;
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
			this.gl = this.canvas.getContext("webgl");
		}
		catch(e)
		{
			console.error("WebGL not supported!");
			throw "WebGL not supported!";
		}

		let gl = this.gl;

		this.pipeline = this.CreateObject(Pipeline);

		this.core.Resource.LoadShader("ShaderEntity", EntShaderVSrc, EntShaderFSrc, EntityShader);

		var resizeTimeout;
		window.addEventListener("resize", resizeThrottler.bind(this), false);
		function resizeThrottler()
		{
			if(!resizeTimeout)
			{
				resizeTimeout = setTimeout(function()
				{
		    		resizeTimeout = null;
		    		this.ResizeViewport.bind(this)();
		  		}.bind(this), 66);
			}
		}
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
		gl.clearColor(0.1, 0.05, 0.05, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);
	}

	RenderPresent()
	{

	}
}
export {BASIS_VECTOR, Render};
