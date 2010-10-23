
function IncludeJS(jsFile) {
    document.write('<script type="text/javascript" src="'+ jsFile + '"></scr' + 'ipt>');
}

IncludeJS("src/gl.js");
IncludeJS("src/class.js");
IncludeJS("src/request.js");
IncludeJS("src/glMatrix.js");
IncludeJS("src/ShaderProgram.js");
IncludeJS("src/VertexBuffer.js");
IncludeJS("src/webglut.js");
