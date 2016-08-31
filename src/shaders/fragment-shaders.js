VideoStream.FragmentShaders = {
DEFAULT:
'\
precision mediump float;\
\
varying vec2 v_coordinate;\
\
uniform sampler2D texture;\
\
void main(){\
	gl_FragColor = texture2D(texture, v_coordinate).rgba;\
}\
',
GRAYSCALE:
'\
precision mediump float;\
\
const vec3 CHANNEL_MULTIPLY = vec3(0.2125, 0.7154, 0.0721);\
\
varying vec2 v_coordinate;\
\
uniform sampler2D texture;\
\
void main(){\
	gl_FragColor = vec4(vec3(dot(texture2D(texture, v_coordinate).rgb, CHANNEL_MULTIPLY)), 1);\
}\
',
GRAY_SCALE: this.GRAYSCALE // DEPRECATED, only for compatibility
};
