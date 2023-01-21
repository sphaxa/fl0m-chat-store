const axios = require('axios');
const fs = require('fs');
const { appLog } = require('./logger');

const EMOTE_URL = "https://api.betterttv.net/3/cached/users/twitch/25093116"; 
const EMOTE_FILE = './data/bttv_emotes.json';

function loadEmotes() {
    axios
    .get(EMOTE_URL)
    .then(res => {
      appLog(`BTTV found ${res.data.channelEmotes.length} emotes`);
      storeData(res.data);
    })
    .catch(error => {
      console.error(error);
    });
}

function reloadEmotes() {
    loadEmotes();
    console.log("BTTV Emotes Reloaded");
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