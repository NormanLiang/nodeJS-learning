

function isValidPlace(str) {
    var patt = /\bplace\b [0-9],[0-9],\bnorth\b|\bsouth\b|\bwest\b|\beast\b/i

    return patt.test(str);
}


function parseCmd(cmd) {

    var strings = cmd.split("\r\n");
    return strings;
}


module.exports = {
    parseCmd,
    isValidPlace
}

