const ml5 = require(`ml5`);
const PIXI = require(`pixi.js`);
const p2 = require(`p2`);

const video = document.getElementById(`video`);
const result = document.querySelector(`.result`);
const resultcanvas = document.querySelector(`.resultcanvas`);


// import vertexSource from './lib/vertex-source.js';
// import fragmentSource from './lib/fragment-source.js';

const app = new PIXI.Application({
  width: window.innerWidth / 2, height: 500});


let world, boxShape, boxBody, planeShape, planeBody, rect, currentWord;

const allWords = [];

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
      currentWord = res[0];
      result.innerText = currentWord;
    });
};

const addWord = () => {
  if (currentWord == null) {
    console.log(`nog niets herkent`);
  } else {
    if (allWords.indexOf(currentWord) === - 1) {
      allWords.push(currentWord);
      console.log(allWords);
      addBox();
      addGraphics(currentWord);
    } else {
      console.log(`already in`);
    }
  }
};

const startp2 = () => {
  world = new p2.World();

  planeShape = new p2.Plane();
  planeBody = new p2.Body({position: [ 0, - 250],
    color: 0xFFFFFF});

  const wallShapeLeft = new p2.Plane();
  const wallBodyLeft = new p2.Body({
    position: [ - 300, 0],
    angle: - Math.PI / 2
  });


  // const wallShapeRight = new p2.Plane();
  // const wallBodyRight = new p2.Body({position: [400, 400]});



  planeBody.addShape(planeShape);
  world.addBody(planeBody);

  wallBodyLeft.addShape(wallShapeLeft);
  world.addBody(wallBodyLeft);
  //
  // wallBodyRight.addShape(wallShapeRight);
  // world.addBody(wallBodyRight);

  startPixi();

  const addword = document.querySelector(`.addword`);
  addword.addEventListener(`click`, addWord);

};

const addBox = () => {
  boxShape = new p2.Box({width: 100, height: 50});
  boxBody = new p2.Body({
    mass: 1000,
    // position: [0, 400],
    position: [Math.random() * (300 - - 300) - 300, 400],
    angularVelocity: 1,
    height: resultcanvas.innerHeight
  });
  boxBody.addShape(boxShape);
  world.addBody(boxBody);

};

const startPixi = () => {
  // zoom = 100;


  resultcanvas.appendChild(app.view);

  console.log(resultcanvas);

  app.renderer.backgroundColor = 0x488968;

    // Add transform to the container
  app.stage.position.x =  app.renderer.width / 2;
  app.stage.position.y =  app.renderer.height / 2;
  // app.stage.scale.x =  zoom;
  app.stage.scale.y =  - 1;

  console.log(app.renderer.width);
};

const addGraphics = () => {
  console.log(currentWord);
  rect = new PIXI.Graphics();
  rect.beginFill(0x107757);
  rect.drawRect(- boxShape.width / 2, - boxShape.height / 2, boxShape.width, boxShape.height);
  const text = new PIXI.Text(`${currentWord}`, {
    fontFamily: `Arial`,
    fontSize: 14,
    fill: 0xFFFFFF,
  });

  text.position.x = - 50;

  text.scale.y = - 1;


  rect.interactive = true;
  rect.buttonMode = true;

  rect.customProperty = currentWord;

  rect.on(`pointerdown`, onBtnClick);




  rect.addChild(text);
  app.stage.addChild(rect);

};

const onBtnClick = e => {
  console.log(e.target.customProperty);
};

const animate = () => {
  requestAnimationFrame(animate);
  if (allWords.length !== 0) {
    world.step(1 / 10);

    rect.position.x = boxBody.position[0];
    rect.position.y = boxBody.position[1];
    rect.rotation = boxBody.angle;

    app.renderer.render(app.stage);

  }
};

const init = () => {
  recogniseMe();

  startp2();
  animate();

};




window.onload = init;
