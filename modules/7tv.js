const axios = require('axios');
const fs = require('fs');
const { appLog } = require('./logger');

const EMOTE_URL = "https://api.7tv.app/v2/users/25093116/emotes";
const EMOTE_FILE = './data/7tv_emotes.json';

function loadEmotes() {
    axios
    .get(EMOTE_URL)
    .then(res => {
      appLog(`7TV found ${res.data.length} emotes`);
      storeData(res.data);
    })
    .catch(error => {
      console.error(error);
    });
}

function reloadEmotes() {
    loadEmotes();
    console.log("7TV Emotes Reloaded");
}

function storeData(data) {
  fs.writeFile(EMOTE_FILE, JSON.stringify(data), err2 => {
    if (err2) {
      console.log(err2);
      return;
    }
  });
}

module.exports = { loadEmotes, reloadEmotes }