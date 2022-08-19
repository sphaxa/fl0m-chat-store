const tmi = require('tmi.js');
const chalk = require('chalk');

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
	channels: [ 'moonmoon' ]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
    let msg = new Message();
    msg.message = message;
    msg.name = tags['display-name'];
    msg.color = tags['color'];
    CHAT_QUEUE.send(msg);
});

async function processQueue() {
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

async function parseNextMessage() {
    let msg = CHAT_QUEUE.receive();
    if (checkIfBot(msg)) {
        return;
    }
    console.log(`[${chalk.hex(msg.color).bold(msg.name)}] ${msg.message} `);
}

function checkIfBot(msg) {
    if (msg.name === "Nightbot") {
        console.log(`🤖 ${chalk.black.bgRed(msg.name)} ${msg.message} `);
        return true;
    }
    return false;
}

processQueue();