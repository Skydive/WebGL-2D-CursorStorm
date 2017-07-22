precision highp float;

attribute vec3 Vertex;
attribute vec2 UV;

uniform mat4 M, V, P;

varying vec2 fUV;

void main(void)
{
	fUV = UV;
	gl_Position = P * V * M * vec4(Vertex, 1);
}
