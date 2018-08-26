const ml5 = require(`ml5`);
const PIXI = require(`pixi.js`);
const p2 = require(`p2`);

//video
const video = document.getElementById(`video`);
const result = document.querySelector(`.result`);
const allWords = [];

//WEBGL
const resultcanvas = document.querySelector(`.resultcanvas`);
let world = void 0,
  boxShape = void 0,
  boxBody = void 0,
  planeShape = void 0,
  planeBody = void 0,
  rect = void 0,
  currentWord = void 0;
const app = new PIXI.Application({
  width: 533, height: 400});

//FORM
const form = document.querySelector(`.messagemaker`);
const messageField = document.querySelector(`.messagefield`);
const backspace = form.querySelector(`.backspace`);
const lenSlider = form.querySelector(`.lenSlider`);
const genTxtLength = form.querySelector(`.genTxtLength`);
const genTxtTemperature = form.querySelector(`.genTxtTemperature`);
const tempSlider = form.querySelector(`.tempSlider`);
const words = [];
let generatedTextLength = void 0,
  generatedTextTemp = void 0;

//lstm
const lstm = ml5.LSTMGenerator(`models/woolf/`, modelReady);
let lstmdata = void 0;
const generatedText = document.querySelector(`.generatedText`);
const tweetBtn = document.querySelector(`.twitter-share-button`);

const recogniseMe = function recogniseMe() {
  navigator.mediaDevices.getUserMedia({video: true}).then(function (stream) {
    video.srcObject = stream;
    video.play();
  });

  ml5.imageClassifier(`MobileNet`, video).then(function (classifier) {
    setInterval(function () {
      loop(classifier);
    }, 1000);
  });
};

const loop = function loop(classifier) {
  classifier.predict().then(function (results) {
    const res = results[0].className.split(`, `);
    currentWord = res[0];
    result.innerText = currentWord;
  });
};

const addWord = function addWord() {
  if (currentWord == null) {
    console.log(`nog niets herkent`);
  } else {
    if (allWords.indexOf(currentWord) === - 1) {
      allWords.push(currentWord);
      console.log(`word added`);
      addBox();
      addGraphics(currentWord);
    } else {
      console.log(`already in`);
    }
  }
};

const startp2 = function startp2() {
  world = new p2.World();

  planeShape = new p2.Plane();
  planeBody = new p2.Body({position: [0, - 180],
    color: 0xFFFFFF});

  const wallShapeLeft = new p2.Plane();
  const wallBodyLeft = new p2.Body({
    position: [- 266, 0],
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

const addBox = function addBox() {
  boxShape = new p2.Box({width: 100, height: 50});
  boxBody = new p2.Body({
    mass: 1000,
    // position: [0, 400],
    position: [Math.random() * (160 - - 160) - 160, 400],
    angularVelocity: 1,
    height: resultcanvas.innerHeight
  });
  boxBody.addShape(boxShape);
  world.addBody(boxBody);
};

const startPixi = function startPixi() {
  // zoom = 100;


  resultcanvas.appendChild(app.view);

  app.renderer.backgroundColor = 0x488968;

  // Add transform to the container
  app.stage.position.x = app.renderer.width / 2;
  app.stage.position.y = app.renderer.height / 2;
  // app.stage.scale.x =  zoom;
  app.stage.scale.y = - 1;
};

const addGraphics = function addGraphics() {
  rect = new PIXI.Graphics();
  rect.beginFill(0x107757);
  rect.drawRect(- boxShape.width / 2, - boxShape.height / 2, boxShape.width, boxShape.height);
  const text = new PIXI.Text(`${  currentWord}`, {
    fontFamily: `Arial`,
    fontSize: 14,
    fill: 0xFFFFFF
  });

  text.anchor.set(0.5, 0.5);

  text.position.x = 0;

  text.scale.y = - 1;

  rect.interactive = true;
  rect.buttonMode = true;

  rect.customProperty = currentWord;

  rect.on(`pointerdown`, onBtnClick);

  rect.addChild(text);
  app.stage.addChild(rect);
};

const animate = function animate() {
  requestAnimationFrame(animate);
  if (allWords.length !== 0) {
    world.step(1 / 10);

    rect.position.x = boxBody.position[0];
    rect.position.y = boxBody.position[1];
    rect.rotation = boxBody.angle;

    app.renderer.render(app.stage);
  }
};

const onBtnClick = function onBtnClick(e) {

  words.push(e.target.customProperty);

  messageField.value = words.join(` `);

  console.log(`searchfield Succes`);
};

const deleteLastWord = function deleteLastWord() {
  words.splice(- 1, 1);
  messageField.value = words.join(` `);
  console.log(`deleted`);
};

const changeLengthValue = e  => {
  genTxtLength.innerText = `Wordlength: ${e.srcElement.value}`;
  generatedTextLength = e.srcElement.value;
};

const changeTempValue = e => {
  genTxtTemperature.innerText = `Temperature: ${e.srcElement.value}`;
  generatedTextTemp = e.srcElement.value;
};

const modelReady = () => {
  console.log(`ready to use`);
};

const generateMsg = e => {
  e.preventDefault();

  if (messageField.value !== ``) {
    lstmdata = {
      seed: messageField.value,
      length: generatedTextLength,
      temperature: generatedTextTemp
    };
  }

  lstm.generate(lstmdata, gotData);
};

const gotData = (err, result) => {
  if (err) {
    console.log(err);
  } else {
    console.log(result);
  }

  const finalRes = result.replace(/\n/g, ``).replace(`\r`, ``).replace(`;`, ``);
  generatedText.innerText = finalRes;

  tweetBtn.href = `https://twitter.com/intent/tweet?text=${finalRes}  --Generated with CamTweet`;
  console.log(tweetBtn.href);
};

const init = () => {

  //camgenerator
  recogniseMe();

  //webgl
  startp2();
  animate();

  //FORM
  backspace.addEventListener(`click`, deleteLastWord);
  lenSlider.addEventListener(`input`, changeLengthValue);
  tempSlider.addEventListener(`input`, changeTempValue);

  //generate message
  form.addEventListener(`submit`, function (e) {
    generateMsg(e, messageField.value);
  });
};

window.onload = init;
