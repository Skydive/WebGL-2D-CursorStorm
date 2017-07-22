import {Base} from 'engine/base'

import {EntityShader} from 'engine/shader'
import EntShaderVSrc from 'engine/shaders/Entity.v.glsl'
import EntShaderFSrc from 'engine/shaders/Entity.f.glsl'

import * as glm from 'gl-matrix'


const BASIS_VECTOR = [1, 0];

const RECT_VERTICES = [
	-1, 1, 0,
	-1,-1, 0,
	 1,-1, 0,
	 1, 1, 0];

const RECT_INDICES = [
	0, 1, 2,
	0, 2, 3];

const RECT_TEXCOORDS = [
	0.0,  0.0,
	0.0,  1.0,
	1.0,  1.0,
	1.0,  0.0];

class Pipeline extends Base
{
	constructor()
	{
		super();
		this.CameraLocation = glm.vec2.create();
		this.CameraRotation = 0;
		this.CameraMag = [1, 1];
	}

	GetProjectionMatrix(w, h) { return null; }
	GetViewMatrix()
	{
		let w = this.core.Render.displayWidth;
		let h = this.core.Render.displayHeight;
		console.log(w, h);
		let V = glm.mat3.create();

		glm.mat3.scale(V, V, [1/w,  1/h]);
		glm.mat3.scale(V, V, [this.CameraMag[0], this.CameraMag[1]])
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
		this.RenderBackgroundFunc = null;

		this.PrimitiveBuffers = new Object();
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
				resizeTimeout = setTimeout(() => {
		    		resizeTimeout = null;
		    		this.ResizeViewport.bind(this)();
		  		}, 66);
			}
		}
		this.ResizeViewport();

		this.PrimitiveBuffers.Square = {};
		let s = this.PrimitiveBuffers.Square;
		s.Vertex = gl.createBuffer();
		s.VertexLength = RECT_VERTICES.length;
		gl.bindBuffer(gl.ARRAY_BUFFER, s.Vertex);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(RECT_VERTICES), gl.STATIC_DRAW);

		s.Index = gl.createBuffer();
		s.IndexLength = RECT_INDICES.length;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, s.Index);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(RECT_INDICES), gl.STATIC_DRAW);

		s.UV = gl.createBuffer();
		s.UVLength = RECT_TEXCOORDS.length;
		gl.bindBuffer(gl.ARRAY_BUFFER, s.UV);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(RECT_TEXCOORDS), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
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
		gl.clearColor(0.5, 0.05, 0.05, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);
	}

	RenderPresent()
	{

	}

	RenderBackground()
	{
		if(this.RenderBackgroundFunc != null)
			this.RenderBackgroundFunc();
	}

	SetRenderBackground(func)
	{
		this.RenderBackgroundFunc = func;
	}

	DrawTexture(transform, texname, color)
	{
		color = (color == undefined) ? [1.0, 1.0, 1.0, 1.0] : [color[0], color[1], color[2], 1.0];

		let tex = this.core.Resource.Get(texname);
		let gl = this.core.Render.gl;
		let w = 5;
		let h = 5;
		if(tex.image !== null)
		{
			w = tex.image.naturalWidth;
			h = tex.image.naturalHeight;
		}

		let shader = this.core.Resource.Get("ShaderEntity");
		shader.Texture = tex;
		shader.Enable();

		let pipeline = this.core.Render.pipeline;

		let V = pipeline.GetViewMatrix();
		gl.uniformMatrix3fv(shader.uV, false, V);

		let M = pipeline.GetModelMatrix(
			transform.Location,
			transform.Rotation+transform.OffsetRotation,
			[w*transform.Scale[0], h*transform.Scale[1]]);
		gl.uniformMatrix3fv(shader.uM, false, M);

		gl.uniform4fv(shader.uColor, new Float32Array(color));


		let SquareBuffer = this.core.Render.PrimitiveBuffers.Square;
		gl.bindBuffer(gl.ARRAY_BUFFER, SquareBuffer.Vertex);
		gl.vertexAttribPointer(shader.aVertex, 3, gl.FLOAT, false, 0, 0);


		gl.bindBuffer(gl.ARRAY_BUFFER, SquareBuffer.UV);
		gl.vertexAttribPointer(shader.aUV, 2, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, SquareBuffer.Index);
		gl.drawElements(gl.TRIANGLES, SquareBuffer.IndexLength, gl.UNSIGNED_SHORT, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		shader.Disable();
	}
}
export {BASIS_VECTOR, Render};
