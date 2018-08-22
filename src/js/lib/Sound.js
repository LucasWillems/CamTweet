window.AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();

let buff = null;

class loadSound {
  constructor(url, bufferName) {
    console.log(bufferName);
    const request = new XMLHttpRequest();
    request.open(`GET`, url, true);
    request.responseType = `arraybuffer`;

// Decode asynchronously
    request.onload = function() {
      context.decodeAudioData(request.response, function(buffer) {
        bufferName = buffer;
        buff = buffer;
        console.log(buff);
        return {buff: buff.responseText};
      });
    };
    request.send();
  }
}


export default loadSound;
