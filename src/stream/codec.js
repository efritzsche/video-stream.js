/**
 *  Apply a codec to a VideoCanvas (create one if necessary) and load configuration from VideoStream.Codecs
 */
VideoStream.prototype.VideoCodec = function(codecName, videoCanvas = null){
	var codecConfig = VideoStream.Codecs[codecName.toUpperCase()];
	
	if(videoCanvas == null){
		var canvas = document.createElement('CANVAS');
		canvas.setAttribute('style', 'display: none;');
		
		canvas.width = this.video.videoWidth;
		canvas.height = this.video.videoHeight;
		
		videoCanvas = this.createVideoCanvas();
	}
}
