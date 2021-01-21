const MAX_NUM_POSITION_X = 4;
const MAX_NUM_POSITION_Y = 4;

function isNumber(obj) {  
    return typeof obj === 'number' && !isNaN(obj)  
}

function isValidPlace(str) {
//    var patt = /\bplace\b [0-9],[0-9],\bnorth\b|\bsouth\b|\bwest\b|\beast\b/i

    if (typeof str === 'string') {
        cmds = str.split(' ');
        var patt = /\bplace\b/i;
        if (patt.test(cmds[0])) {
            if (cmds.length > 1) {
                cmds = cmds[1].split(',');
                var patt_d = /\bnorth\b|\bsouth\b|\bwest\b|\beast\b/i;
                num_1 = parseInt(cmds[0]);
                num_2 = parseInt(cmds[1]); 
                if (num_1 >= 0 && num_1 <= MAX_NUM_POSITION_X && 
                    num_2 >= 0 && num_2 <= MAX_NUM_POSITION_Y &&
                    patt_d.test(cmds[2])) {
                    return true;
                } else {
                }
            }
        } else {
    
        }
    }

    return false;
}


function parseCmd(cmd) {
    // console.log('cmd is ...'+cmd);
    var strings = cmd.split("\r\n");
    return strings;
}


module.exports = {
    parseCmd,
    isValidPlace,
    isNumber,
}

