/**
 * A wrapper for VideoStream.VideoCanvas which accepts images instead of videos.
 */
VideoStream.ImageCanvas = function(image, canvas){
	// mask image as video
	image.videoWidth = image.width;
	image.videoHeight = image.height;
	// create internal VideoCanvas
	this.internalVideoCanvas = new VideoStream.VideoCanvas(image, canvas);
	
	return this;
}


VideoStream.ImageCanvas.prototype.setShaders = function(glShadersSources){
	this.internalVideoCanvas.setShaders(glShadersSources);
}

VideoStream.ImageCanvas.prototype.getGlContext = function(){
	return this.internalVideoCanvas.getGlContext();
}

VideoStream.ImageCanvas.prototype.setGlProgram = function(glProgram){
	this.internalVideoCanvas.setGlProgram();
}

VideoStream.ImageCanvas.prototype.getGlProgram = function(){
	return this.internalVideoCanvas.getGlProgram();
}


VideoStream.ImageCanvas.prototype.update = function(){
	this.internalVideoCanvas.update();
}

VideoStream.ImageCanvas.prototype.draw = function(){
	this.internalVideoCanvas.draw();
}

VideoStream.ImageCanvas.prototype.show = function(){
	var imageCanvas = this;
	requestAnimationFrame(function(time){
		imageCanvas.draw();
	});
}
