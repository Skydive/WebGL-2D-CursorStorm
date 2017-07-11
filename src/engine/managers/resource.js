import {Base} from '../base'

class Resource extends Base
{
	constructor()
	{
		super();
		this.ResourceMap = {};
	}

	BeginPlay(){}

	Get(res)
	{
		return this.ResourceMap[res];
	}

	LoadShader(name, vertsrc, fragsrc, cls)
	{
		if(Object.keys(this.ResourceMap).indexOf(name) > -1)
		{
			console.error("Resource identifier: "+name+" for "+basepath+" already taken!");
			throw "Resource identifier: "+name+" for "+basepath+" already taken!";
		}

		let gl = this.core.Render.gl;
		function Compile(s)
		{
			gl.compileShader(s);
			if(!gl.getShaderParameter(s, gl.COMPILE_STATUS))
			{
				console.error("Could not compile shader: " + gl.getShaderInfoLog(s));
				throw "Could not compile shader: " + gl.getShaderInfoLog(s);
			}
		}

		let shader = this.CreateObject(cls);
		shader.BeginPlay();

		let vert = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vert, vertsrc);
		Compile(vert);

		let frag = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(frag, fragsrc);
		Compile(frag);

		gl.attachShader(shader.Program, vert);
		gl.attachShader(shader.Program, frag);

		shader.Link();
		this.ResourceMap[name] = shader;
	}

	LoadTexture(name, basepath)
	{
		if(Object.keys(this.ResourceMap).indexOf(name) > -1)
		{
			console.error("Resource identifier: "+name+" for "+basepath+" already taken!");
			throw "Resource identifier: "+name+" for "+basepath+" already taken!";
		}

		let img = new Image();
		img.src = basepath;
		img.onload = function()
		{
			let gl = this.core.Render.gl;
			var texture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
			this.ResourceMap[name].data = texture;
			this.ResourceMap[name].image = img;
		}.bind(this);
		this.ResourceMap[name] = {
			data: null,
			image: null,
		};
	}
}
export {Resource};
