function compile_shader(shader_source, shader_type){
	var shader = gl.createShader(shader_type);
	gl.shaderSource(shader, shader_source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}
	return shader;
}

function shader_from_script(id, shader_type){
	var shaderScript = document.getElementById(id);
	if (!shaderScript)
		throw "Unable to load shader from script element with id:"+id;

	if (shader_type === undefined) {
		if (shaderScript.type == "x-shader/x-fragment")
			shader_type = gl.FRAGMENT_SHADER
		else if (shaderScript.type == "x-shader/x-vertex")
			shader_type = gl.VERTEX_SHADER
		else
			throw "Unable to determine shader type for "+id;
	}

	var shader_source = "";
	var k = shaderScript.firstChild;
	while (k) {
		if (k.nodeType == 3)
			shader_source += k.textContent;
		k = k.nextSibling;
	}

	return compile_shader(shader_source, shader_type);

}

function shader_from_url(url, shader_type){
	if ( shader_type === undefined ) {
		var file_extension = url.substring(url.length -3);
		if (file_extension == ".vs")
			shader_type = gl.VERTEX_SHADER
	    else if (file_extension == ".fs")
			shader_type = gl.FRAGMENT_SHADER
		else
			throw "Unknown shader type: "+url;
   }

	shader_source = load_url(url);
	return compile_shader(shader_source, shader_type);
}



var ShaderProgram = Class.extend({
  init: function(vertex_shader, fragment_shader){
	this.vs = false;
	this.fs = false;

	this.program = gl.createProgram();
	if (vertex_shader){
		var vs;
		if (vertex_shader.substring(0,1) === "#")
			vs = shader_from_script(vertex_shader.substring(1));
		else
			vs = shader_from_url(vertex_shader);
		this.attach_vertex_shader(vs);
	}
	if (fragment_shader){
		var fs;
		if (fragment_shader.substring(0,1) === "#")
			fs = shader_from_script(fragment_shader.substring(1));
		else
			fs = shader_from_url(fragment_shader);
		this.attach_fragment_shader(fs);
	}

  },

  attach_vertex_shader: function(vs){
	this.vs = vs;
	gl.attachShader(this.program, vs);
	if (this.fs && this.vs)
		this.link();
  },

  attach_fragment_shader: function(fs){
	this.fs = fs;
	gl.attachShader(this.program, fs);
	if (this.fs && this.vs)
		this.link();
  },

  link: function(){
	if (this.fs && this.vs){
		gl.linkProgram(this.program);
		if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
			throw "ShaderLinkError: Unable to link shader program!";
		this.configure();

	}else{
		console.log("cannot link yet, need vertex and fragment shader attached!");
	}
  },

  configure: function(){
	this.pMatrixUniform   = gl.getUniformLocation(this.program, "uProjectionMatrix");
	this.mvMatrixUniform  = gl.getUniformLocation(this.program, "uModelViewMatrix");
	this.vertexPosition   = gl.getAttribLocation(this.program,  "aVertexPosition");
  },

  enable: function() {
	gl.active_program = this;
	gl.useProgram(this.program);
	gl.uniformMatrix4fv(this.pMatrixUniform, false, gl.getProjectionMatrix().toFloat32());
	gl.uniformMatrix4fv(this.mvMatrixUniform, false, gl.getModelViewMatrix().toFloat32());
	gl.enableVertexAttribArray(this.vertexPosition);
  },

  disable: function(){
	gl.useProgram(null);
  }

});
