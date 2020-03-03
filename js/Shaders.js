/**
 * Sebastian Fojcik
 */

const vertexShaderSource = `
uniform float depth;
uniform vec2 move;
attribute vec2 vertPosition;
attribute vec3 vertColor;
varying vec3 fragColor;

void main() {
    fragColor = vertColor;
    gl_Position = vec4(vertPosition + move, depth, 1.0);
    gl_PointSize = 10.0;
}
`;

const fragmentShaderSource = `
precision mediump float;
varying vec3 fragColor;

void main() {
    gl_FragColor = vec4(fragColor, 1.0);
}
`;

// ----------------------------------------------

const vertexShaderTex = `
uniform float depth;
uniform vec2 move;
attribute vec2 vertPosition;
attribute vec2 vertTexCoord;
varying vec2 fragTexCoord;

void main() {
    fragTexCoord = vertTexCoord;
    gl_Position = vec4(vertPosition + move, depth, 1.0);
    gl_PointSize = 10.0;
}
`;

const fragmentShaderTex = `
precision mediump float;
varying vec2 fragTexCoord;
uniform sampler2D sampler;

void main() {
    gl_FragColor = texture2D(sampler, fragTexCoord);
}
`;