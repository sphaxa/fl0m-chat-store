const axios = require('axios');
const fs = require('fs');
const { appLog } = require('./logger');

const EMOTE_URL = "https://api.betterttv.net/3/cached/frankerfacez/users/twitch/25093116";
const EMOTE_FILE = './data/ffz_emotes.json';

function loadEmotes() {
    axios
    .get(EMOTE_URL)
    .then(res => {
      appLog(`FFZ found ${res.data.length} emotes`);
      storeData(res.data);
    })
    .catch(error => {
      console.error(error);
    });
}

function reloadEmotes() {
    loadEmotes();
    console.log("FFZ Emotes Reloaded");
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