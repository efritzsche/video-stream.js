VideoStream.Codecs['CUSTOM'] = {
	encoder: {
		shaders: {
			multipass: false,
			fromURL: true,
			fragment: 'codecs/custom/encoder.frag'
		},
		encodeFrame: function(data){/* TODO call function */}
	}
	// TODO write decoder
}
