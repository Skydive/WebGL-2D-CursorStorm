precision highp float;

varying vec2 fUV;

uniform vec4 Color;
uniform float Time;

uniform sampler2D Texture;

void main(void)
{
	//gl_FragColor = vec4(0, 1, 0, 1);

	gl_FragColor = texture2D(Texture, fUV).rgba * Color;
	if(gl_FragColor.a != 1.0)
		discard;
}
