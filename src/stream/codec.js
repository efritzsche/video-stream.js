/**
 *  Apply a codec to a VideoCanvas (create one if necessary) and load configuration from VideoStream.Codecs
 */
VideoStream.prototype.setVideoCodec = function(codecName, videoCanvas = null){
	var codecConfig = VideoStream.Codecs[codecName.toUpperCase()];
	
	if(videoCanvas == null){
		var canvas = document.createElement('CANVAS');
		canvas.setAttribute('style', 'display: none;');
		
		canvas.width = this.video.videoWidth;
		canvas.height = this.video.videoHeight;
		
		videoCanvas = this.createVideoCanvas();
		
		document.querySelector('body').appeendChild(canvas);
	}
	
	// load encoder
	if(codecConfig.encoder){
		function setCodecEncoder(codecShaders = null){
			
		}
		
		// load encoding shaders
		if(codecConfig.encoder.shaders){
			// load shaders from url if necessary
			if(codecConfig.encoder.shaders.fromURL){
				var loadedCodecShaders = 0;
				var codecShaders = {};
				function asyncLoadCodecShaders(){
					// wait until all shaders are loaded
					if((++loadedCodecShaders) >= 2){
						// call setCodecEncoders asynchronous after shaders are downloaded from server
						setCodecEncoders(codecShaders);
					}
				}
				VideoStream.utils.loadTextFromURL(codecConfig.encoder.shaders.vertex, this.codecDir)
				.then(function(vertex){
					codecShaders.vertex = vertex || VideoStream.VertexShaders.DEFAULT;
					asyncLoadCodecShaders();
				});
				VideoStream.utils.loadTextFromURL(codecConfig.encoder.shaders.fragment, this.codecDir)
				.then(function(fragment){
					codecShaders.fragment = fragment || VideoStream.FragmentShader.DEFAULT;
					asyncLoadCodecShaders();
				});
			}
			else{
				var codecShaders = {};
				codecShaders.vertex = codecConfig.encoder.shaders.vertex || VideoStream.VertexShaders.DEFAULT;
				codecShaders.fragment = codecConfig.encoder.shaders.fragment || VideoStream.FragmentShader.DEFAULT;
				
				// instantly call setCodecEncoder because all resources are already loaded
				setCodecEncoder(codecShaders);
			}
		}
	}
}

/**
 * Directory where codecs are located.
 */
VideoStream.prototype.codecDir = './codecs';
