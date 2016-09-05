VideoStream.utils.loadFileFromURL = function(file, dir = '.'){
	if(!file){
		return new Promise(function(resolve){resolve(null);});
	}
	var path = file;
	if(file.startsWith('/') == false && file.startsWith(/((http(s)?)|(file)):\/\//) == false){
		path = dir.endsWith('/') ? dir + file : dir + '/' + file;
	}
	
	return new Promise(function(resolve, reject){
		var xhr = new XMLHttpRequest();
		
		xhr.onreadystatechange = function(){
			if(this.readyState == 4){
				if(this.status == 200){
					resolve(this.responseText);
				}
				else{
					reject(this.status, this);
				}
			}
		};
		xhr.onerror = function(){
			reject(this.status, this);
		};
		
		xhr.open('GET', path, true);
		xhr.send();
	})
	.catch(function(status, xhr){
		var errorText = 'Error while loading file! [Status: ' + status + ']';
		console.log(errorText);
		console.log(xhr);
		throw new Error(errorText);
	});
}


VideoStream.utils.loadShadersFromURL = function(vertexShaderURL, fragmentShaderURL, dir = '.'){
	return new Promise(function(resolve, reject){
		var loadedShaders = 0;
		var shaders = {};
		function asyncLoadShaders(){
			// wait until all shaders are loaded
			if((++loadedShaders) >= 2){
				resolve(shaders);
			}
		}
		VideoStream.utils.loadFileFromURL(vertexShaderURL, dir)
		.then(function(vertex){
			shaders.vertex = vertex;
			asyncLoadShaders();
		})
		.catch(function(e){
			reject(e);
		});
		VideoStream.utils.loadFileFromURL(fragmentShaderURL, dir)
		.then(function(fragment){
			shaders.fragment = fragment;
			asyncLoadShaders();
		})
		.catch(function(e){
			reject(e);
		});
	});
}
