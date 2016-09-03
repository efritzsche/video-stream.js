VideoStream.utils.loadFileFromURL = function(file, dir = '.'){
	if(!file){
		return new Promise(function(resolve){resolve(null);});
	}
	var path = file;
	if(file.startsWith('/') == false && file.startsWith(/http(s):\/\/|file:\/\//) == false){
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