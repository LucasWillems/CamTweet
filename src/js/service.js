const $ = require(`jquery`);
const form = document.querySelector(`.spotifyForm`);
const searchfield = document.querySelector(`.searchfield`);


// const stateKey = `spotify_auth_state`;
const clientId = `3ec5dcfd1a6f418086c7ecba1e4b00f9`; // Your client id
const clientSecret = `fb742021dbb24377851ed3612717ea12`; // Your secret
// const redirectUri = `http://localhost:8888/callback`; // Your redirect uri

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


const searchSong = e => {

  e.preventDefault();

  console.log(`hello`);

  // $.ajax({
  //   url: `https://api.spotify.com/v1/search`,
  //   data: {
  //     q: `uppermost`,
  //     type: `album`
  //   },
  //   success: response
  // });
};

// const response = r => {
//   console.log(r);
// };


const init = () => {
  requestSpotify();

  form.addEventListener(`submit`, (e => {
    searchSong(e, searchfield.value);
  }));
};

init();
