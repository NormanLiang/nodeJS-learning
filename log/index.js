
const fs = require('fs');

const LOG_PATH = './log/robot.log'

var options = {
    flags: 'a', 
    encoding: 'utf8',

}


var stderr = fs.createWriteStream(LOG_PATH, options);

let logger = new console.Console(stderr);

module.exports = logger;
