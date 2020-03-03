/**
 * Bufor na dane z wypełnieniem jednolitym
 */
class BufferST extends Buffer{
    constructor(webgl, mode, img) {
        super(webgl, mode);
        this._compileShaders(vertexShaderTex, fragmentShaderTex);
        this._compileProgramShader();
        if(!img.complete) {
            img.onload = () => this._setTexture(img);
        } else {
            this._setTexture(img)
        }
    }

    /**
     * Ustawienie danych bufora.
     * @param {[PointST]} points
     */
    setBufferData(points) {
        this._useBuffer();
        // Zamiana [p1, p2] do [p1.x, p1.y, p1.s, p1.t, p2.x, p2.y, ...]
        let vertices = points.reduce( (acc, p) => {
            const xNor = webgl.normX(p.x);
            const yNor = webgl.normY(p.y);
            return acc.concat(xNor, yNor, p.s, p.t );
        }, [] );
        vertices = new Float32Array(vertices);

        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );
        this.numOfVertices = points.length;
    }

    setIndexData(indices) {
        if(indices == null)
            this.numOfIndices = 0;
        this._useBuffer();
        indices = new Uint16Array(indices);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        this.numOfIndices = indices.length;
    }

    // noinspection DuplicatedCode
    draw() {
        this._useProgram();
        this._useBuffer();
        this._setUniforms();
        this._useTexture();
        if(this.numOfIndices === 0) {
            gl.drawArrays(this.mode, 0, this.numOfVertices);
        } else {
            gl.drawElements(this.mode, this.numOfIndices, gl.UNSIGNED_SHORT, 0);
        }
    }

    /**
     * Ustawia bufor
     */
    _useBuffer() {
        if(webgl.currentBuffer === this) return;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        const positionAttribLocation = gl.getAttribLocation(this.program, "vertPosition");
        const texCoordAttrLocation = gl.getAttribLocation(this.program, "vertTexCoord");

        gl.vertexAttribPointer(
            positionAttribLocation,                      // Id atrybutu
            2,                                      // Ilość floatów na atrybut
            gl.FLOAT,                                    // Typ zmiennych w tablicy
            false,                            // Normalizacja
            4 * Float32Array.BYTES_PER_ELEMENT,   // Rozmiar bloku przekazywanego do shadera
            0                                     // Offset
        );

        gl.vertexAttribPointer(
            texCoordAttrLocation,
            2,
            gl.FLOAT,
            false,
            4 * Float32Array.BYTES_PER_ELEMENT,
            2 * Float32Array.BYTES_PER_ELEMENT
        );

        gl.enableVertexAttribArray(positionAttribLocation);
        gl.enableVertexAttribArray(texCoordAttrLocation);
        webgl.currentBuffer = this;
    }


    _setUniforms() {
        const depthUniformPosition = gl.getUniformLocation(this.program, "depth");
        gl.uniform1f(depthUniformPosition, this.depth);

        const moveUniformPosition = gl.getUniformLocation(this.program, "move");
        gl.uniform2f(moveUniformPosition, this.move.x*2/this.webgl.width, -this.move.y*2/this.webgl.height);
    }

    _useTexture() {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.activeTexture(gl.TEXTURE0);
    }

    _setTexture(img) {
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
            gl.UNSIGNED_BYTE,
            img
        );
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}