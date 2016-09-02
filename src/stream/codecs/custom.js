VideoStream.Codecs.CUSTOM = {
	encoder: {
		multipass: true,
		fromURL: true,
		shaders: {
			fragment: 'codecs/custom/encoder.frag'
		}
	}
	// TODO write decoder
}
