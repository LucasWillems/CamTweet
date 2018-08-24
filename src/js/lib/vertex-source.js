const vertexSource =
  `
      attribute vec4 a_position;
      varying vec4 v_colorPosition;

      void main() {

        gl_Position = a_position;
        v_colorPosition = (a_position + 0.5) / 2.0;
      }
    `;

export default vertexSource;
