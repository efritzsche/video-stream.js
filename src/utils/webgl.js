// TODO move functions into module (compileShader -> WebGL.compileShader, etc.)

// Code partial taken from:
// http://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html
// http://webglfundamentals.org/webgl/lessons/webgl-2d-drawimage.html
// http://webglfundamentals.org/webgl/lessons/webgl-image-processing.html

function compileShader(gl, shaderSource, shaderType){
	var shader = gl.createShader(shaderType);
	gl.shaderSource(shader, shaderSource);
	gl.compileShader(shader);
	if(gl.getShaderParameter(shader, gl.COMPILE_STATUS) == false){
		throw 'Could not compile shader: ' + gl.getShaderInfoLog(shader);
	}
	return shader;
}

function compileShaderFromScript(gl, scriptId){
	var shaderScript = document.getElementById(scriptId);
	var shaderSource = shaderScript.text;
	var shaderType;
	if(shaderScript.type == 'x-shader/x-vertex'){
		shaderType = gl.VERTEX_SHADER;
	}
	else if(shaderScript.type == 'x-shader/x-fragment'){
		shaderType = gl.FRAGMENT_SHADER;
	}
	return compileShader(gl, shaderSource, shaderType);
};


function createProgram(gl, vertexShader, fragmentShader){
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if(gl.getProgramParameter(program, gl.LINK_STATUS) == false){
		throw 'Program filed to link: ' + gl.getProgramInfoLog (program);
	}
	return program;
};

function createProgramFromScripts(gl, vertexShaderId, fragmentShaderId){
	var vertexShader = compileShaderFromScript(gl, vertexShaderId);
	var fragmentShader = compileShaderFromScript(gl, fragmentShaderId);
	return createProgram(gl, vertexShader, fragmentShader);
}


function setupTexture(gl){
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	
	// TODO may change parameter, see http://webglfundamentals.org/webgl/lessons/webgl-image-processing-continued.html
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	
	return texture;
}

function createTextureInfo(gl, image, width = image.width, height = image.height){
	var texture = setupTexture(gl);
	
	var textureInfo = {
		width: width,
		height: height,
		texture: texture
	};
	//gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	
	return textureInfo;
}

function createTextureFramebufferInfo(gl, width, height){
	var texture = setupTexture(gl);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	var framebuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
	
	return {
		width: width,
		height: height,
		texture: texture,
		framebuffer: framebuffer
	};
}


// location = {
//     matrixLocation,
//     textureMatrixLocation
// }
function drawImage(gl, textureInfo, x, y, locations, matrixCache){
	if(!x){
		x = 0;
	}
	if(!y){
		y = 0;
	}
	
	if(!matrixCache){
		var scaleMatrix = makeScale(textureInfo.width, textureInfo.height, 1);
		var translationMatrix = makeTranslation(x, y, 0);
		var projectionMatrix = make2DProjection(textureInfo.width, textureInfo.height, 1);
		matrixCache = matrixMultiply(scaleMatrix, translationMatrix);
		matrixCache = matrixMultiply(matrixCache, projectionMatrix);
	}
	gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
	gl.uniformMatrix4fv(locations.matrixLocation, false, matrixCache);
	gl.uniformMatrix4fv(locations.textureMatrixLocation, false, makeIdentity());
	gl.drawArrays(gl.TRIANGLES, 0, 6);
	
	return matrixCache;
}


function makeIdentity(){
	return [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	];
}

function make2DProjection(width, height, depth){
	// Note: This matrix flips the Y axis so 0 is at the top.
	return [
		 2 / width,   0, 0, 0,
		 0, -2 / height, 0, 0,
		 0,  0, 2 / depth,  0,
		-1,  1, 0, 1
	];
	// Matrix without flip:
	//[
	//   2 / textureInfo.width,   0, 0, 0,
	//   0,  2 / textureInfo.height, 0, 0,
	//   0,  0, 2, 0,
	//  -1, -1, 0, 1
	//];
	
}

function makeTranslation(tx, ty, tz){
	return [
		 1,  0,  0,  0,
		 0,  1,  0,  0,
		 0,  0,  1,  0,
		tx, ty, tz,  1
	];
}

function makeScale(sx, sy, sz){
	return [
		sx, 0,  0,  0,
		0, sy,  0,  0,
		0,  0, sz,  0,
		0,  0,  0,  1
	];
}

function matrixMultiply(a, b){
	var a00 = a[0*4+0];
	var a01 = a[0*4+1];
	var a02 = a[0*4+2];
	var a03 = a[0*4+3];
	var a10 = a[1*4+0];
	var a11 = a[1*4+1];
	var a12 = a[1*4+2];
	var a13 = a[1*4+3];
	var a20 = a[2*4+0];
	var a21 = a[2*4+1];
	var a22 = a[2*4+2];
	var a23 = a[2*4+3];
	var a30 = a[3*4+0];
	var a31 = a[3*4+1];
	var a32 = a[3*4+2];
	var a33 = a[3*4+3];
	var b00 = b[0*4+0];
	var b01 = b[0*4+1];
	var b02 = b[0*4+2];
	var b03 = b[0*4+3];
	var b10 = b[1*4+0];
	var b11 = b[1*4+1];
	var b12 = b[1*4+2];
	var b13 = b[1*4+3];
	var b20 = b[2*4+0];
	var b21 = b[2*4+1];
	var b22 = b[2*4+2];
	var b23 = b[2*4+3];
	var b30 = b[3*4+0];
	var b31 = b[3*4+1];
	var b32 = b[3*4+2];
	var b33 = b[3*4+3];
	return [a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30,
	        a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31,
	        a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32,
	        a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33,
	        a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30,
	        a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31,
	        a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32,
	        a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33,
	        a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30,
	        a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31,
	        a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32,
	        a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33,
	        a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30,
	        a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31,
	        a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32,
	        a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33];
}
