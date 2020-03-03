/**
 * Sebastian Fojcik
 */

/**
 * Bufor na dane z wypełnieniem jednolitym
 */
class BufferRGB extends Buffer{
    constructor(webgl, mode) {
        super(webgl, mode);
        this._compileShaders(vertexShaderSource, fragmentShaderSource);
        this._compileProgramShader();
    }

    /**
     * Ustawienie danych bufora.
     * @param {[PointRGB]} points
     */
    setBufferData(points) {
        this._useBuffer();
        // Zamiana [p1, p2] do [p1.x, p1.y, p1.r, p1.g, p1.b, p2.x, p2.y, ...]
        let vertices = points.reduce( (acc, p) => {
            const xNor = webgl.normX(p.x);
            const yNor = webgl.normY(p.y);
            return acc.concat(xNor, yNor, p.r, p.g, p.b );
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
        const colorAttrLocation = gl.getAttribLocation(this.program, "vertColor");

        gl.vertexAttribPointer(
            positionAttribLocation,                      // Id atrybutu
            2,                                      // Ilość floatów na atrybut
            gl.FLOAT,                                    // Typ zmiennych w tablicy
            false,                            // Normalizacja
            5 * Float32Array.BYTES_PER_ELEMENT,   // Rozmiar bloku przekazywanego do shadera
            0                                     // Offset
        );

        gl.vertexAttribPointer(
            colorAttrLocation,
            3,
            gl.FLOAT,
            false,
            5 * Float32Array.BYTES_PER_ELEMENT,
            2 * Float32Array.BYTES_PER_ELEMENT
        );

        gl.enableVertexAttribArray(positionAttribLocation);
        gl.enableVertexAttribArray(colorAttrLocation);
        webgl.currentBuffer = this;
    }

    _setUniforms() {
        const depthUniformPosition = gl.getUniformLocation(this.program, "depth");
        gl.uniform1f(depthUniformPosition, this.depth);

        const moveUniformPosition = gl.getUniformLocation(this.program, "move");
        gl.uniform2f(moveUniformPosition, this.move.x*2/this.webgl.width, -this.move.y*2/this.webgl.height);
    }
}