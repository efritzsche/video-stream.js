/**
 * This static UI function fills the given HTML <select> element with HTML
 * <option> elements that represent each found device.
 * A device type to filter is optional, the default is the video input type.
 */
VideoStream.ui.deviceSelector = function(selectElement, deviceType = VideoStream.DeviceType.VIDEO_INPUT){
	VideoStream.listDevices(deviceType)
	.then(function(devices){
		
		var genericText;
		switch(deviceType){
		case VideoStream.DeviceType.VIDEO_INPUT :
			genericText = VideoStream.ui.language['generic-camera'];
			break;
		case VideoStream.DeviceType.AUDIO_INPUT :
			genericText = VideoStream.ui.language['generic-audio-input'];
			break;
		default:
			genericText = VideoStream.ui.language['generic-input'];
		}
		
		for(var i = 0, genericIndex = 1; i < devices.length; i++){
			var label = devices[i].label === '' ? genericText + ' #' + (genericIndex++) : devices[i].label;
			
			var option = document.createElement('OPTION');
			option.setAttribute('value', devices[i].deviceId);
			var text = document.createTextNode(label);
			option.appendChild(text);
			selectElement.appendChild(option);
		}
	});
}

VideoStream.ui.language['generic-input'] = 'Generic Input';
VideoStream.ui.language['generic-camera'] = 'Generic Camera';
VideoStream.ui.language['generic-audio-input'] = 'Generic Audio Input';
