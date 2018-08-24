const PIXI = require(`pixi.js`);
const p2 = require(`p2`);

class BoxResult {
  constructor() {
    const boxShape = new p2.Box({width: 200, height: 100});
    const boxBody = new p2.Body({
      mass: 1000,
      position: [Math.random() * (300 - - 300) - 300, 400],
      angularVelocity: 1,
    });
    boxBody.addShape(boxShape);
    world.addBody(boxBody);
  }
}

export default BoxResult;
