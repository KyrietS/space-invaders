/**
 * Sebastian Fojcik
 */

/** Globalna zmienna trzymająca kontekst WebGL */
let gl;

/**
 * Pomocnicza klasa reprezentująca bufor z danymi do narysowania
 */
class Buffer {
    constructor(webgl, mode) {
        this.webgl = webgl;

        this.mode = mode;
        this.vertexBuffer = gl.createBuffer();
        this.numOfVertices = 0;
        this.indexBuffer = gl.createBuffer();
        this.numOfIndices = 0;

        this.depth = 0.0;
        this.move = new Point(0,0);
    }

    /**
     * Tworzenie shaderów.
     */
    _compileShaders(vertexShaderSource, fragmentShaderSource) {
        this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
        this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

        gl.shaderSource(this.vertexShader, vertexShaderSource);
        gl.shaderSource(this.fragmentShader, fragmentShaderSource);

        gl.compileShader(this.vertexShader);
        if(!gl.getShaderParameter(this.vertexShader, gl.COMPILE_STATUS)) {
            console.error("Compile vertex shader error: ", gl.getShaderInfoLog(this.vertexShader));
            return;
        }

        gl.compileShader(this.fragmentShader);
        if(!gl.getShaderParameter(this.fragmentShader, gl.COMPILE_STATUS)) {
            console.error("Compile fragment shader error: ", gl.getShaderInfoLog(this.fragmentShader));
        }
    }

    /**
     * Tworzenie programu shadera.
     */
    _compileProgramShader() {
        this.program = gl.createProgram();
        gl.attachShader(this.program, this.vertexShader);
        gl.attachShader(this.program, this.fragmentShader);

        gl.linkProgram(this.program);
        if(!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error("Link error: ", gl.getProgramInfoLog(this.program));
            return;
        }

        gl.validateProgram(this.program);
        if(!gl.getProgramParameter(this.program, gl.VALIDATE_STATUS)) {
            console.error("Validate error: ", gl.getProgramInfoLog(this.program));
        }
    }

    _useProgram() {
        gl.useProgram(this.program);
    }
}

/**
 * Klasa zarządzająca kontekstem WebGL.
 */
class WebGL {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;
        this._setContext();
    }

    createBufferRGB(mode) {
        return new BufferRGB(this, mode);
    }

    createBufferST(mode, img) {
        return new BufferST(this, mode, img);
    }

    /**
     * Ustawia wypełnienie ekranu
     * @param {Color} color
     */
    clear(color = new Color("#000000")) {
        gl.clearColor(color.nor.r, color.nor.g, color.nor.b, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    /**
     * Blokuje wykonywania dopóki poprzednie polecenia nie zostaną zakończone
     */
    finish() {
        gl.finish();
    }

    /**
     * Przygotowuje kontekst WebGL do pracy.
     * @private
     */
    _setContext() {
        gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        // brak wsparcia dla WebGL
        if(!gl) {
            alert("Twoja przeglądarka nie wspiera WebGL");
        }
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.depthMask(true);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable ( gl.BLEND ) ;

        this.clear();
    }

    /**
     * Normalizacja współrzędnej do [-1, 1]
     */
    normX(x) {
        return x * 2 / this.width - 1;
    }

    /**
     * Normalizacja współrzędnej do [-1, 1]
     */
    normY(y) {
        return -y * 2 / this.height + 1;
    }
}
