precision highp float;

varying vec2 fUV;

uniform vec4 Color;
uniform float Time;

uniform sampler2D Texture;

void main(void)
{
	vec4 tex = texture2D(Texture, fUV);
	if(tex == vec4(1.0, 1.0, 1.0, 1.0))
	{
		tex.rgb = tex.rgb*Color.rgb;
	}
	gl_FragColor = vec4(tex.rgb, tex.a);

	if(gl_FragColor.a == 0.0)
		discard;
}
