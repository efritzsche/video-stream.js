VideoStream.Resolution = {
	QVGA: {
		width: {ideal: 320, max: 320},
		height: {ideal: 180, max: 180}
	},
	VGA: {
		width: {ideal: 640, max: 640},
		height: {ideal: 360, max: 360}
	},
	HD: {
		width: {ideal: 1280, max: 1280},
		height: {ideal: 720, max: 720}
	}
};

VideoStream.ResolutionOld = {
	QVGA: {
		 mandatory: {
			maxWidth: 320,
			maxHeight: 180
		}
	},
	VGA: {
		mandatory: {
			maxWidth: 640,
			maxHeight: 360
		}
	},
	HD: {
		mandatory: {
			minWidth: 1280,
			minHeight: 720
		}
	}
};

if(!navigator.mediaDevices.getUserMedia && (navigator.getUserMedia || navigator.webkitGetUserMedia)){
	VideoStream.Resolution = VideoStream.ResolutionOld;
	navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia);
}
