const ml5 = require(`ml5`);
const PIXI = require(`pixi.js`);
const p2 = require(`p2`);
const $ = require(`jquery`);
// const querystring = require(`querystring`);
//
// const express = require(`express`);
// const request = require(`ajax-request`);
// console.log(request);

// const appl = express();

//video
const video = document.getElementById(`video`);
const result = document.querySelector(`.result`);

//WEBGL
const resultcanvas = document.querySelector(`.resultcanvas`);

//FORM
const form = document.querySelector(`.spotifyForm`);
const searchfield = document.querySelector(`.searchfield`);

//SPOTIFY
// const stateKey = `spotify_auth_state`;
const clientId = `3ec5dcfd1a6f418086c7ecba1e4b00f9`; // Your client id
const clientSecret = `fb742021dbb24377851ed3612717ea12`; // Your secret
// const redirectUri = `http://localhost:8888/callback`; // Your redirect uri



// import vertexSource from './lib/vertex-source.js';
// import fragmentSource from './lib/fragment-source.js';

const app = new PIXI.Application({
  width: 480, height: 480});


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
      console.log(`word added`);
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
  planeBody = new p2.Body({position: [ 0, - 230],
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


  app.renderer.backgroundColor = 0x488968;

    // Add transform to the container
  app.stage.position.x =  app.renderer.width / 2;
  app.stage.position.y =  app.renderer.height / 2;
  // app.stage.scale.x =  zoom;
  app.stage.scale.y =  - 1;

};

const addGraphics = () => {
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
  searchfield.value = e.target.customProperty;
  console.log(`searchfield Succes`);
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


const requestSpotify = () => {
  $.ajax({
    type: `POST`,
    url: `https://accounts.spotify.com/api/token`,
    /*eslint-disable */
    grant_type: `client_credentials`,
    /*eslint-enable */

    headers: {
      Authorization: `Basic ${  new Buffer(`${clientId}:${clientSecret}`).toString(`base64`)}`
    },


  });
};
//


const searchSong = (e, v) => {
  e.preventDefault();
  console.log(v);

  $.ajax({
    url: `https://api.spotify.com/v1/search`,
    data: {
      q: v,
      type: `album`
    },
    success: response
  });
};


const response = r => {
  console.log(r);
};

const init = () => {
  recogniseMe();

  startp2();
  animate();
  // getScope();
  requestSpotify();

  form.addEventListener(`submit`, (e => {
    searchSong(e, searchfield.value);
  }));

};




window.onload = init;
