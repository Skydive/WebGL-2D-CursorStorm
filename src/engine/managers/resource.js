import {Base} from 'engine/base'


class Resource extends Base
{
	constructor()
	{
		super();
		this.ResourceMap = {};
		this.Redundancy = 0;
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
			console.error("Resource identifier: "+name+" for "+basepath+" already taken!"); return;
		}

		let gl = this.core.Render.gl;
		let Compile = (s) => {
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

		this.Log(`Compiled Shader: ${name}`);

		gl.attachShader(shader.Program, vert);
		gl.attachShader(shader.Program, frag);

		shader.Link();
		this.Log(`Linked Shader: ${name}`);

		this.ResourceMap[name] = shader;
	}

	LoadTexture(name, basepath)
	{
		if(Object.keys(this.ResourceMap).indexOf(name) > -1)
			return;

		let img = new Image();
		img.src = basepath;
		this.Redundancy++;
		img.onload = () => {
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
			this.Log(`Precached Texture: ${name}`);
			this.Redundancy--;
		};
		this.ResourceMap[name] = {
			data: null,
			image: null,
		};
	}

	LoadAnimation(name, basepath, count)
	{
		this.ResourceMap[name] = {
			count: count
		};
		for(let i=0; i<count; i++)
		{
			let path = basepath.replace("%", i);
			this.LoadTexture(name+"_"+i, path);
		}
		this.Log(`Precached Animation: ${name}`);
	}
}
export {Resource};
