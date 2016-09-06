VideoStream.VideoCanvas = function(video, canvas){
	var glContextAttributes = {
		alpha                          : false,
		depth                          : false,
		stencil                        : false,
		antialias                      : false,
		premultipliedAlpha             : false,
		preserveDrawingBuffer          : false,
		preferLowPowerToHighPerformance: false,
		failIfMajorPerformanceCaveat   : false
	};
	// TODO keep an eye on WebGL2 (OpenGL ES 3.0) browser support
	this.gl = canvas.getContext('webgl', glContextAttributes) || canvas.getContext('experimental-webgl', glContextAttributes);
	
	this.video = video;
	this.canvas = canvas;
	
	this.textureInfo = createTextureInfo(this.gl, video, video.videoWidth, video.videoHeight);
	
	return this;
};

// make VideoCanvas easier accessible
var VideoCanvas = VideoStream.VideoCanvas;

// simplify creation of VideoCanvas
VideoStream.prototype.createVideoCanvas = function(canvas){
	return new VideoStream.VideoCanvas(this.video, canvas);
};


/**
 * Sets the shader used to render the video onto the canvas.
 * Returns the generated Program.
 */
VideoStream.VideoCanvas.prototype.setShaders = function(glShadersSources){
	if(!glShadersSources){
		glShadersSources = {};
	}
	if(!glShadersSources.vertex){
		glShadersSources.vertex = VideoStream.VertexShaders.DEFAULT;
	}
	if(!glShadersSources.fragment){
		glShadersSources.fragment = VideoStream.FragmentShaders.DEFAULT;
	}
	var glVertexShader = compileShader(this.gl, glShadersSources.vertex, this.gl.VERTEX_SHADER);
	var glFragmentShader = compileShader(this.gl, glShadersSources.fragment, this.gl.FRAGMENT_SHADER);
	
	var glProgram = createProgram(this.gl, glVertexShader, glFragmentShader);
	
	glProgram.attributes = {
		positionLocation: this.gl.getAttribLocation(glProgram, 'a_position')
	};
	glProgram.uniforms = {
		matrixLocation: this.gl.getUniformLocation(glProgram, 'u_matrix'),
		textureMatrixLocation: this.gl.getUniformLocation(glProgram, 'u_textureMatrix')
	};
	
	var buffer = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
	this.gl.enableVertexAttribArray(glProgram.attributes.positionLocation);
	this.gl.vertexAttribPointer(glProgram.attributes.positionLocation, 2, this.gl.FLOAT, false, 0, 0);
	
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1]), this.gl.STATIC_DRAW);
	
	this.setGlProgram(glProgram);
	
	return glProgram;
};


VideoStream.VideoCanvas.prototype.getGlContext = function(){
	return this.gl;
};

VideoStream.VideoCanvas.prototype.setGlProgram = function(glProgram){
	this.gl.useProgram(glProgram);
	this.glProgram = glProgram;
};

VideoStream.VideoCanvas.prototype.getGlProgram = function(){
	return this.glProgram;
};


VideoStream.VideoCanvas.prototype.draw = function(){
	//gl.clear(gl.COLOR_BUFFER_BIT);
	this.matrixCache = drawImage(this.gl, this.textureInfo, 0, 0, this.glProgram.uniforms, this.matrixCache);
};

VideoStream.VideoCanvas.prototype.update = function(){
	this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureInfo.texture);
	this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.video);
};

VideoStream.VideoCanvas.prototype.start = function(){
	this.isRunning = true;
	var videoCanvas = this;
	var render = function(time){
		videoCanvas.update();
		videoCanvas.draw();
		if(videoCanvas.isRunning == true){
			requestAnimationFrame(render);
		}
	};
	requestAnimationFrame(render);
};

VideoStream.VideoCanvas.prototype.stop = function(){
	this.isRunning = false;
};


/**
 * Streams the canvas to a given WebSocket server.
 */
VideoStream.VideoCanvas.prototype.streamToServer = function(url, options = {}){
	var fps = options.fps ? options.fps : VideoStream.VideoCanvas.DEFAULT_FPS;
	return new VideoStream.WebSocketStream(url, this.canvas.captureStream(fps), options);
}

VideoStream.VideoCanvas.prototype.DEFAULT_FPS = 25;
