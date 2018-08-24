const fragmentSource =


  `
  // fragment shaders don't have a default precision so we need
  // to pick one. mediump is a good default. It means "medium precision"
  precision mediump float;

  varying vec4 v_colorPosition;

  void main() {
    // gl_FragColor is a special variable a fragment shader
    // is responsible for setting
    gl_FragColor = vec4(v_colorPosition.x, 1, v_colorPosition.y, 1); // return redish-purple
  }

    `;

export default fragmentSource;
