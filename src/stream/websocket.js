/**
* Streams the given stream in chunks to a URL via WebSockets.
*/
VideoStream.WebSocketStream = function(url, stream, options = {}){
	// change relative URL to absolute
	if(/^ws(s)?:\/\//i.test(url) == false){
		url =
			(location.protocol == 'https:' ? 'wss' : 'ws')
			+ location.href.substring(
				location.href.indexOf(':'),
				location.href.lastIndexOf('/') + 1
			)
			+ url;
	}
	this.url = url;
	this.stream = stream
	
	// set options (or default if not defined)
	this.mimeType = options.mimeType ? options.mimeType : 'video/webm;codecs=vp9';
	var mimeTypeFallback = options.mimeTypeFallback ? options.mimeTypeFallback : 'video/webm';
	this.protocols = options.protocols ? options.protocols : ['video', 'videostream', 'videofile', 'videochunks'];
	this.timeslice = options.timeslice ? options.timeslice : VideoStream.DEFAULT_CHUNK_LENGTH;
	
	// select MIME type
	if(MediaRecorder.isTypeSupported(this.mimeType) == false){
		if(MediaRecorder.isTypeSupported(mimeTypeFallback)){
			this.mimeType = mimeTypeFallback;
		}
		else{
			throw new Error('No requested MIME type for recording supported.');
		}
	}
	
	return this;
}

/**
 * Streams the currently running video to a given WebSocket server.
 */
VideoStream.prototype.streamToServer = function(url, options){
	return new VideoStream.WebSocketStream(url, this.video.stream, options);
}


VideoStream.WebSocketStream.prototype.start = function(){
	if(this.mediaRecorder == false){
		console.log('WebSocketStream is already running.');
		return; // stream already running
	}
	
	var webSocketStream = this;
	
	// setup the WebSocket
	this.webSocket = new WebSocket(this.url, this.protocols);
	this.webSocket.binaryType = 'blob';
	
	this.webSocket.onopen = function(){
		// setup the MediaRecorder
		webSocketStream.mediaRecorder = new MediaRecorder(webSocketStream.stream, {mimeType: webSocketStream.mimeType});
		// set data chunk handler
		webSocketStream.mediaRecorder.ondataavailable = function(event){
			webSocketStream.webSocket.send(event.data);
		};
		// start recorder with chunks every 'timeslice' seconds
		webSocketStream.mediaRecorder.start(webSocketStream.timeslice);
	};
	this.webSocket.onclose = function(){
		// stop recorder
		webSocketStream.mediaRecorder.stop();
		// reset recorder
		webSocketStream.mediaRecorder = null;
	}
}

VideoStream.WebSocketStream.prototype.stop = function(){
	if(this.mediaRecorder == false){
		console.log('WebSocketStream is not running.');
		return; // no stream running
	}
	// call close listener to stop recorder
	this.webSocket.onclose();
	this.webSocket.onclose = function(){};
	// close connection
	this.webSocket.close();
}


VideoStream.prototype.DEFAULT_CHUNK_LENGTH = 250;
