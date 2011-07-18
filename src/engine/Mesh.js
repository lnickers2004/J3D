J3D.Mesh = function(source, isStatic){
	if (!source) {
		source = J3D.Primitive.getEmptyGeometry();
		this.isStatic = false;
	} else {
		this.isStatic = isStatic || true;
	} 
	
	this.renderMode = J3D.RENDER_AS_OPAQUE;
	
	this.vertSize = 3;
	this.uvSize = 2;
	this.colorSize = 4;

	this.vertices = new Float32Array(source.vertices);
	this.vertNum = source.vertices.length / this.vertSize;
	
	this.hasElements = source.tris.length > 0;
	
	this.tris = new Uint16Array(source.tris);
	this.triNum = source.tris.length;

	this.colors = new Float32Array(source.colors);

	this.normals = new Float32Array(source.normals);
	
	this.hasUV1 = source.uv1.length > 0;
	if(this.hasUV1){
		this.uv1 = new Float32Array(source.uv1);
	} else {
		this.uv1 = new Float32Array(this.vertNum * this.uvSize);
	}
	
	this.hasUV2 = source.uv2.length > 0;
	if(this.hasUV2){
		this.uv2 = new Float32Array(source.uv2);
	} else {
		this.uv2 = new Float32Array(this.vertNum * this.uvSize);
	}

	//this.buffersReady = false;
	this.vertBuf;
	this.colorBuf;
	this.normBuf;
	this.uv1buf;
	this.uv2buf;
	this.triBuf;
	
	if(this.isStatic) this.bindBuffers();
}

J3D.Mesh.prototype.setTransparency = function(transparency, srcFactor, dstFactor) {
	if(!transparency) {
		this.renderMode = J3D.RENDER_AS_OPAQUE;
	} else {
		this.renderMode = J3D.RENDER_AS_TRANSPARENT;
		this.srcFactor = srcFactor;
		this.dstFactor = dstFactor;
	}
}

J3D.Mesh.prototype.flip = function(){
	var tv = [];
	
	for(var i = 0; i < this.vertices.length; i += 3) {
		tv.push(this.vertices[i], this.vertices[i+2], this.vertices[i+1]);
	}
	
	this.vertices = new Float32Array(tv);
	
	var tn = [];
	
	for(var i = 0; i < this.normals.length; i += 3) {
		var v = new v3(this.normals[i], this.normals[i+1], this.normals[i+2])
		v.neg();
		tn = tn.concat(v.xyz());
	}
	
	this.normals = new Float32Array(tn);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuf);
	gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normBuf);
	gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);
	
	return this;
}

J3D.Mesh.prototype.bindBuffers = function(){
	if(this.buffersReady) return;
	
	this.vertBuf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuf);
	gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
	
	this.colorBuf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuf);
	gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
	
	this.normBuf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normBuf);
	gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);
	
	this.uv1buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.uv1buf);
	gl.bufferData(gl.ARRAY_BUFFER, this.uv1, gl.STATIC_DRAW);
	
	this.uv2buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.uv2buf);
	gl.bufferData(gl.ARRAY_BUFFER, this.uv2, gl.STATIC_DRAW);

	this.triBuf = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.triBuf);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.tris, gl.STATIC_DRAW);
	
	this.buffersReady = true;
}


