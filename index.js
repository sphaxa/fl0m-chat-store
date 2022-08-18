const tmi = require('tmi.js');

class Queue {
    constructor() { this.q = []; }
    send( item )  { this.q.push(item); }
    receive()     { return this.q.shift(); }
    length()      { return this.q.length; }
}

const CHAT_QUEUE = new Queue();

const client = new tmi.Client({
	channels: [ 'fl0m' ]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
    CHAT_QUEUE.send(`${tags['display-name']}: ${message}`);
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
    console.log(CHAT_QUEUE.receive());
}

processQueue();