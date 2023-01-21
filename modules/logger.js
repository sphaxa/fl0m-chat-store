const chalk = require('chalk');

function appLog(message) {
    console.log("🔷 " + chalk.bgBlue.black("App") + " " + message);
}

module.exports = { appLog }