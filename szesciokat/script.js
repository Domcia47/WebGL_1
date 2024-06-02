console.error('works');

const vertexShaderTxt = `
precision mediump float;

attribute vec2 vertPosition;
attribute vec3 vertColor;

varying vec3 fragColor;

void main() {
    fragColor = vertColor;
    gl_Position = vec4(vertPosition, 0.0, 1.0);
}
`;

const fragmentShaderTxt = `
precision mediump float;

varying vec3 fragColor;

void main() {
    gl_FragColor = vec4(fragColor, 1.0);
}
`;

const Hex = function () {
    const canvas = document.getElementById('main-canvas');
    const gl = canvas.getContext('webgl');
    let canvasColor = [0.68, 0.85, 0.90]; // Blado niebieski kolor

    checkGl(gl);

    gl.clearColor(...canvasColor, 1.0);  // R,G,B, A 
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderTxt);
    gl.shaderSource(fragmentShader, fragmentShaderTxt);

    gl.compileShader(vertexShader);
    checkShaderCompile(gl, vertexShader);
    gl.compileShader(fragmentShader);
    checkShaderCompile(gl, fragmentShader);

    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    checkLink(gl, program);

    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);

    gl.validateProgram(program);

    // Nowe wierzchołki dla sześciokąta (środek + sześć wierzchołków wokół)
    let hexagonVerts = [
        //  X,      Y,     R,    G,    B
        0.0,     0.0,    1.0,  0.0,  0.0,  // Środek, czerwony
        0.7,     0.0,    0.0,  1.0,  0.0,  // Pierwszy wierzchołek, zielony
        0.35,    0.61,   0.0,  0.0,  1.0,  // Drugi wierzchołek, niebieski
        -0.35,   0.61,   1.0,  1.0,  0.0,  // Trzeci wierzchołek, żółty
        -0.7,    0.0,    1.0,  0.0,  1.0,  // Czwarty wierzchołek, fioletowy
        -0.35,  -0.61,   0.0,  1.0,  1.0,  // Piąty wierzchołek, cyjan
        0.35,   -0.61,   1.0,  1.0,  1.0,  // Szósty wierzchołek, biały
        0.7,     0.0,    0.0,  1.0,  0.0   // Zamykający wierzchołek, zielony
    ];

    const hexagonVertBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, hexagonVertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(hexagonVerts), gl.STATIC_DRAW);

    const posAttrLoc = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        posAttrLoc,
        2,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0
    );

    gl.enableVertexAttribArray(posAttrLoc);

    const colorAttrLoc = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        colorAttrLoc,
        3,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        2 * Float32Array.BYTES_PER_ELEMENT
    );

    gl.enableVertexAttribArray(colorAttrLoc);

    // render time

    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 8);
};

function checkGl(gl) {
    if (!gl) {
        console.log('WebGL not supported, use another browser');
    }
}

function checkShaderCompile(gl, shader) {
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('shader not compiled', gl.getShaderInfoLog(shader));
    }
}

function checkLink(gl, program) {
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(program));
    }
}

// Inicjalizacja renderowania po załadowaniu strony
window.onload = Hex;