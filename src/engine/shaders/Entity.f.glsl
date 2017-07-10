precision mediump float;

varying vec2 fVertex;
varying vec2 fUV;

uniform vec4 Color;
uniform float Time;

uniform sampler2D Texture;

void main(void)
{
	gl_FragColor = texture2D(Texture, fUV).rgba * Color.rgba;
}
