
//class for VBO's
// data:  this is teh vertex data,  a regular array should be passed, with all the vertex data
// format:  specifies what kind of data and how many coordiantes.
//          eg. "vvv" would mean teh buffer has 3 component vertices e.g. (x,y,z)
//          "vvvccc", would interleave a 3 vector for position with a 3 compnent color for each vertex
//          "vvvccctt" adds two texture coordinates to the vertex.  this way you can just call draw on the
//          buffer object and it will set up teh binding and attribute pointers for you correctly
//
// Here is an example, sets up a VBO for a very simple triangle.
// i.e.just 3 vertices (0,1,0), (-1,-1,0), and (1,-1,-)
//
// var verts = [0,1,0, -1,-1,0, 1,-1,0];
// var vbo = new VertexBuffer("vvv", verts);

var VertexBuffer = Class.extend({
	init: function(format, data){
		this.buffer = gl.createBuffer();
		this.format = format;
		this.item_size = 3;//format.lenght;
		if (data)
			this.set_data(data);
		else
			data = [];
	},

	set_data: function(data){
		this.data = data;
		this.num_items = this.data.length/this.item_size;
		this.pack();
	},

	pack: function(){
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
		this.buffer.itemsize = this.item_size;
		this.buffer.numItems = this.num_items;
	},

	draw: function(shader, mode){
		if (mode == undefined)
			mode = gl.TRIANGLES;
		shader.enable();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		gl.vertexAttribPointer(shader.vertexPosition, this.item_size, gl.FLOAT, false, 0, 0);
		gl.drawArrays(mode, 0, this.num_items);
	}
});