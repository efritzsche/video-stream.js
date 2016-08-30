/**
 * Device types for below function.
 */
VideoStream.DeviceType = {
	VIDEO_INPUT: 'videoinput',
	AUDIO_INPUT: 'audioinput'
};


/**
 * Static function that lists all available devices filtered by device type.
 */
VideoStream.listDevices = function(deviceType){
	return new Promise(function(resolve, reject){
		navigator.mediaDevices.enumerateDevices()
		.then(function(devices){
			var filteredDevices = [];
			for(var i = 0; i < devices.length; i++){
				if(devices[i].kind == deviceType){
					filteredDevices[filteredDevices.length] = devices[i];
				}
			}
			resolve(filteredDevices);
		});
	});
};


/**
 * This function sets up a video only stream with the given resolution and
 * can optional select the device by a given id.
 */
VideoStream.prototype.setupVideoOnlyStream = function(resolution, videoDevice = null){
	var video = this.video;
	return new Promise(function(resolve, reject){
		var mediaReady = function(stream){
			video.src = window.URL.createObjectURL(stream);
			video.onloadedmetadata = resolve;
		}
		
		var constrains = {audio: false, video: resolution};
		if(navigator.mediaDevices.getUserMedia){
			if(videoDevice != null){
				// clone
				constrains.video = JSON.parse(JSON.stringify(resolution));
				// TODO set device id
				//constrains.video.deviceId = [{sourceId: videoDevice.deviceId}];
			}
			navigator.mediaDevices.getUserMedia(constrains)
			.then(mediaReady)
			.catch(reject);
		}
		else if(navigator.getUserMedia){
			if(videoDevice != null){
				// clone
				constrains.video = JSON.parse(JSON.stringify(resolution));
				if(!constrains.video.optional){
					constrains.video.optional = []
				}
				constrains.video.optional.push({sourceId: videoDevice.deviceId});
			}
			navigator.getUserMedia(constrains, mediaReady, reject);
		}
		else{
			reject(new Error('Video capture is not supported in this browser.'));
		}
	});
};
