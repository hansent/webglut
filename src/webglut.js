function initWebGlut(window_title){

	//set teh window title, fps will be updated
	document.title = window_title+" | fps: (sampling)";

	//empty teh body and make it fill the window
	document.body.innerHTML = "";
	document.body.style.margin = 0;
	document.body.style.padding = 0;
	document.body.style.overflow = 'hidden';

	//create a new canvas element
	var canvas = document.createElement('canvas');
	canvas.setAttribute('id', 'gl-canvas');
	document.body.appendChild(canvas);
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.innerHTML = "you do need a WebGL capable browser to try WebGL related things :/"

	//initiaize openGL context from canvas
	gl = canvas.getContext("experimental-webgl");
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	initGLMatrixContext(gl);
	gl.canvas_element = canvas;
	gl.active_program = null;
	gl.initialized = true;

	//create glut context, stores callback function and other global stuff (like framerate counting etc.)
	glut_ctx = new Object();
	glut_ctx.wglutIdleFunc = function(){};
	glut_ctx.wglutDisplayFunc = function(){};
	glut_ctx.wglutReshapeFunc  = function(w,h){};

	glut_ctx.fps = 0.0;
	glut_ctx.framecounter  = 0;
	glut_ctx.fps_base_time = (new Date()).getTime();
	glut_ctx.count_frame = function(){
		glut_ctx.framecounter++;
		if (glut_ctx.framecounter == 100){
			glut_ctx.framecounter = 0;
			var now = (new Date()).getTime();
			var dt = (now - glut_ctx.fps_base_time)/1000.0; //in seconds
			glut_ctx.fps_base_time = now;
			glut_ctx.fps = (100/dt);
			document.title = window_title+" | fps: " + glut_ctx.fps.toFixed(2);
		}
	};

	glut_ctx.resize_context = function(){
		var w = window.innerWidth;
		var h = window.innerHeight;
		gl.canvas_element.width  = w;
		gl.canvas_element.height = h;
		gl.viewport(0, 0, w, h);
     	glut_ctx.wglutReshapeFunc(w,h);
	};

	glut_ctx.main_loop_update = function(){
		glut_ctx.wglutIdleFunc();
		glut_ctx.wglutDisplayFunc();
		glut_ctx.count_frame();
	};

	gl.webglut_context = glut_ctx;
}

function wglutDisplayFunc(display_func){
	gl.webglut_context.wglutDisplayFunc = display_func;
}

function wglutReshapeFunc(reshape_func){
	gl.webglut_context.wglutReshapeFunc = reshape_func;
}

function wglutIdleFunc(idle_func){
	gl.webglut_context.wglutIdleFunc = idle_func;
}

function wglutStartMainLoop(){
	window.onresize = gl.webglut_context.resize_context;
	gl.webglut_context.resize_context();
	setInterval(gl.webglut_context.main_loop_update, 15);
}