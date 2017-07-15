import {Base} from '../base'

class RenderComponent extends Base
{
	constructor()
	{
		super();
	}

	DrawTexture(texname, color)
	{
		if(color == undefined)
		{
			color = [1.0, 1.0, 1.0, 1.0];
		}

		let tex = this.core.Resource.Get(texname);
		let gl = this.core.Render.gl;
		let w = 5;
		let h = 5;
		if(tex.image !== null)
		{
			w = tex.image.naturalWidth;
			h = tex.image.naturalHeight;
		}
		let x = this.owner.Location[0];
		let y = this.owner.Location[1];

		let shader = this.core.Resource.Get("ShaderEntity");
		shader.Texture = tex;
		shader.Enable();

		let pipeline = this.core.Render.pipeline;

		let V = pipeline.GetViewMatrix();
		gl.uniformMatrix3fv(shader.uV, false, V);

		let M = pipeline.GetModelMatrix(
			[x, y],
			this.owner.Rotation+this.owner.OffsetRotation,
			[w*this.owner.Scale[0], h*this.owner.Scale[1]]);
		gl.uniformMatrix3fv(shader.uM, false, M);

		gl.uniform4fv(shader.uColor, new Float32Array(color));


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
		gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		shader.Disable();
	}

}
export {RenderComponent};
