
const Direction_static = Object.freeze({'NORTH':0, 'EAST':1, 'SOUTH':2, 'WEST':3});

const Direction_left_right = Object.freeze({'LEFT':0, 'RIGHT':1});

function isNumber(obj) {  
    return typeof obj === 'number' && !isNaN(obj)  
}

function getDirectionString(fc, compare = (a, b) => a === b) {

    if (isNumber(fc) && fc >= Direction_static.NORTH && fc <= Direction_static.WEST) {
        return Object.keys(Direction_static).find(k => compare(Direction_static[k], fc));
    } else {
        return Object.keys(Direction_static).find(k => compare(Direction_static[k], 0));
    }
}

function rotate(fc, di) {

    if (isNumber(fc) && isNumber(di)) {
        if (di == Direction_left_right.LEFT) {
            if (fc >= Direction_static.NORTH && fc <= Direction_static.WEST) {
                fc = (fc == Direction_static.NORTH ? Direction_static.WEST : fc-1);
            } else {
                fc = Direction_static.WEST;
            }
        } else if (di == Direction_left_right.RIGHT) {
            if (fc >= Direction_static.NORTH && fc <= Direction_static.WEST) {
                fc = (fc == Direction_static.WEST ? Direction_static.NORTH : fc+1);
            } else {
                fc = Direction_static.NORTH;
            }
        } else {
            fc = Direction_static.NORTH;
        }
    } else {
        fc = Direction_static.NORTH;
    }

    return fc;
}

module.exports = {
    Direction_static,
    Direction_left_right,
    rotate,
    getDirectionString
}



