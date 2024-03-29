const tmi = require('tmi.js');
const chalk = require('chalk');
require('./modules/logger');

const _7tv = require('./modules/7tv');
const bttv = require('./modules/bttv');
const ffz = require('./modules/ffz');

var tempmessages = require('./templates/temp.json');
var chatdata = require('./templates/data.json');
//var emotes = require('./data/emotes.json');

class Queue {
    constructor() { this.q = []; }
    send( item )  { this.q.push(item); }
    receive()     { return this.q.shift(); }
    length()      { return this.q.length; }
}

class Message {
    constructor(name, message, color) {
        this.name = name;
        this.message = message;
        this.color = color;
    } 
}

const CHAT_QUEUE = new Queue();

const client = new tmi.Client({
	channels: [ 'fl0m' ]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
    let msg = new Message();
    msg.message = message;
    msg.name = tags['display-name'];
    msg.color = tags['color'];
    CHAT_QUEUE.send(msg);
});

function loadData() {
    loadEmotes();
}

function processQueue() {
    if (CHAT_QUEUE.length() < 10) {
        console.log(chalk.bgGreen.black("Waiting for queue to populate..."));
        setTimeout(() => {processQueue()}, 10000);
    } else {
        while (CHAT_QUEUE.length() > 0) {
            parseNextMessage();
        }
        processQueue();
    }
}

function parseNextMessage() {
    let msg = CHAT_QUEUE.receive();
    if (ifStoreTemp(msg)) {
        return;
    }
    if (checkIfBot(msg)) {
        return;
    }
    console.log(`[${chalk.hex(msg.color).bold(msg.name)}] ${msg.message} `);
}

function checkIfBot(msg) {
    if (msg.name == "Nightbot") {
        console.log(`🤖 ${chalk.black.bgRed(msg.name)} ${msg.message} `);
        processNightbot(msg);
        return true;
    }
    return false;
}

function ifStoreTemp(msg) {
    if (msg.message.startsWith("%?")) {
        tempmessages.lastJoris = msg.name;
        console.log(`[${chalk.bgBlue.bold(msg.name)}] ${msg.message} `);
        appLog(msg.name + " triggered joris!");
        return true;
    }
    return false;
}

function processNightbot(msg) {
    let msg_array = msg.message.split(' ');
    if (msg.message.includes("pops a 1deag on")) {
        let name = msg_array[0];
        let hitname = msg_array[5];
        chatdata['1deags'][name] = chatdata['1deags'][name]++;
        appLog(name + " hit " + hitname + " with a 1deag!");
    }
}

function loadEmotes() {
    _7tv.loadEmotes();
    bttv.loadEmotes();
    ffz.loadEmotes();
}

loadData();
processQueue();