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
	channels: [ 'sodapoppin' ]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
    //console.log(`[${chalk.hex(tags['color']).bold(tags['display-name'])}] ${message}`);
    let msg = new Message();
    msg.message = message;
    msg.name = tags['display-name'];
    msg.color = tags['color'];
    CHAT_QUEUE.send(msg);
});

async function processQueue() {
    if (CHAT_QUEUE.length() < 10) {
        console.log("Waiting for queue to populate...");
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
    console.log(`[${chalk.hex(msg.color).bold(msg.name)}] ${msg.message} `)
}

processQueue();