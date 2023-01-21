(function() {

	const _getNativeContext = HTMLCanvasElement.prototype.getContext;

	HTMLCanvasElement.prototype.getContext = function(contextType, contextAttributes) {

		if (contextType == 'nes') {
			return new NesRenderingContext(this, contextAttributes);
		}

		return _getNativeContext.apply(this, arguments);
	};

}());
	
	