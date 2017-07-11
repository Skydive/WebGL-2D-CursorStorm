precision highp float;

attribute vec2 Vertex;
attribute vec2 UV;

uniform mat3 M, V;

varying vec2 fUV;


mat3 transpose(in mat3 inMatrix) {
    vec3 i0 = inMatrix[0];
    vec3 i1 = inMatrix[1];
    vec3 i2 = inMatrix[2];

    mat3 outMatrix = mat3(
             vec3(i0.x, i1.x, i2.x),
             vec3(i0.y, i1.y, i2.y),
             vec3(i0.z, i1.z, i2.z)
             );

    return outMatrix;
}

void main(void)
{
	fUV = UV;

	vec3 tVertex = V * M * vec3(Vertex.x, Vertex.y, 1);
	gl_Position = vec4(tVertex.xy, 0, 1);
}
