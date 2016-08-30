VideoStream.VertexShaders = {
DEFAULT:
'\
attribute vec4 a_position;\
\
uniform mat4 u_matrix;\
uniform mat4 u_textureMatrix;\
\
varying vec2 v_coordinate;\
\
void main(){\
	gl_Position = u_matrix * a_position;\
	v_coordinate = (u_textureMatrix * a_position).xy;\
}\
'
};
