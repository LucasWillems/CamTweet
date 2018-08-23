const ml5 = require(`ml5`);

const video = document.getElementById(`video`);
const result = document.querySelector(`.result`);

import vertexSource from './lib/vertex-source.js';
import fragmentSource from './lib/fragment-source.js';

const recogniseMe = () => {
  navigator.mediaDevices.getUserMedia({video: true})
  .then(stream => {
    video.srcObject = stream;
    video.play();
  });

  ml5.imageClassifier(`MobileNet`, video)
  .then(classifier => {
    setInterval(() => {
      loop(classifier);
    }, 1000);
  });
};

const loop = classifier => {
  classifier.predict()
    .then(results => {
      const res = results[0].className.split(`, `);
      result.innerText = res[0];
    });
};

const createShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
};

const createProgram = (gl, vertexShader, fragmentShader) => {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
};

const startGL = () => {
  const canvas = document.querySelector(`.resultcanvas`),
    gl = canvas.getContext(`webgl`);

  // const vertexSource = document.getElementById(`vertex-source`).text;
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);

  // const fragmentSource = document.getElementById(`fragment-source`).text;
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  const program = createProgram(gl, vertexShader, fragmentShader);

  const positionAttribute = gl.getAttribLocation(program, `a_position`);
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // three 2d points
  const positions = new Float32Array([
    0.5, 0.5,
    0, 0.5,
    0.5, 0,

    0, 0,
    0, 0.5,
    0.5, 0
  ]);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  // Clear the canvas
  gl.clearColor(0, 1, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);
  gl.enableVertexAttribArray(positionAttribute);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
};

const init = () => {
  recogniseMe();

  startGL();
};

window.onload = init;
