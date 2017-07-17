import {Base} from '../base'

class RenderComponent extends Base
{
	constructor()
	{
		super();
	}

	BeginPlay()
	{
		super.BeginPlay();
	}

	DrawTexture(texname, color)
	{

		let tex = this.core.Resource.Get(texname);
		let gl = this.core.Render.gl;
		let w = 5;
		let h = 5;
		if(tex.image !== null)
		{
			w = tex.image.naturalWidth;
			h = tex.image.naturalHeight;
		}

		let shader = this.owner.shader;
		shader.Texture = tex;
		shader.Enable();

		let pipeline = this.core.Render.pipeline;

		let V = pipeline.GetViewMatrix();
		gl.uniformMatrix3fv(shader.uV, false, V);

		let M = pipeline.GetModelMatrix(
			this.owner.Location,
			this.owner.Rotation+this.owner.OffsetRotation,
			[w*this.owner.Scale[0], h*this.owner.Scale[1]]);
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
export {RenderComponent};
