const ml5 = require(`ml5`);

const video = document.getElementById(`video`);
const result = document.querySelector(`.result`);

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


const init = () => {
  recogniseMe();
};

init();
