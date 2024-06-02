console.error('works');

const vertexShaderTxt = `
precision mediump float;

attribute vec2 vertPosition;

void main() {
    gl_Position = vec4(vertPosition, 0.0, 1.0);
}
`;

const fragmentShaderTxt = `
precision mediump float;

uniform vec3 uTriangleColor;

void main() {
    gl_FragColor = vec4(uTriangleColor, 1.0);
}
`;

let triangleColor = [1.0, 0.0, 0.0]; // Początkowy kolor: czerwony

function Triangle() {
    const canvas = document.getElementById('main-canvas');
    const gl = canvas.getContext('webgl');
    let canvasColor = [0.68, 0.85, 0.90]; // Jasnoniebieski kolor

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

    // Wierzchołki trójkąta
    let triangleVerts = [
        0.0, 0.5,
        -0.5, -0.5,
        0.5, -0.5
    ];

    const triangleVertBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVerts), gl.STATIC_DRAW);

    const posAttrLoc = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        posAttrLoc,
        2,
        gl.FLOAT,
        gl.FALSE,
        2 * Float32Array.BYTES_PER_ELEMENT,
        0
    );

    gl.enableVertexAttribArray(posAttrLoc);

    const colorUniformLoc = gl.getUniformLocation(program, 'uTriangleColor');

    // Czas renderowania
    gl.useProgram(program);
    gl.uniform3fv(colorUniformLoc, triangleColor);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // Nasłuchiwanie przycisku zmiany koloru trójkąta
    document.getElementById('color-button').addEventListener('click', () => {
        triangleColorChange(gl, colorUniformLoc, program);
    });
}

function checkGl(gl) {
    if (!gl) {
        console.log('Brak wsparcia WebGL, użyj inną przeglądarkę');
    }
}

function checkShaderCompile(gl, shader) {
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader nie skompilowany', gl.getShaderInfoLog(shader));
    }
}

function checkLink(gl, program) {
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('BŁĄD podczas łączenia programu!', gl.getProgramInfoLog(program));
    }
}

function triangleColorChange(gl, colorUniformLoc, program) {
    triangleColor = [Math.random(), Math.random(), Math.random()];
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniform3fv(colorUniformLoc, triangleColor);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}
