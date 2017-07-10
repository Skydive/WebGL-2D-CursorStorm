precision mediump float;

attribute vec2 Vertex;
attribute vec2 UV;

uniform mat3 M;

varying vec3 fVertex;
varying vec2 fUV;

void main(void)
{
	fUV = UV;
	fVertex = vec3(M * vec3(Vertex, 1));
	gl_Position = M * vec3(Vertex, 1);
}
