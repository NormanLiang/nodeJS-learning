const FUNS = require('./funs');

const Direction_static = Object.freeze({'NORTH':0, 'EAST':1, 'SOUTH':2, 'WEST':3});

const Direction_left_right = Object.freeze({'LEFT':0, 'RIGHT':1});

const DEBUG = false;


const TABLE_MAX_LENGTH = 5;
const TABLE_MAX_WIDTH = 5;

function getDirectionString(fc, compare = (a, b) => a === b) {

    if (FUNS.isNumber(fc) && fc >= Direction_static.NORTH && fc <= Direction_static.WEST) {
        return Object.keys(Direction_static).find(k => compare(Direction_static[k], fc));
    } else {
        return Object.keys(Direction_static).find(k => compare(Direction_static[k], 0));
    }
}

function rotate(fc, di) {

    if (FUNS.isNumber(fc) && FUNS.isNumber(di)) {
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

//
// this module provides all the definations including 
// the directions : (Direction_static: NORTH, SOUTH, EAST, WEST)
// left right direction : (Direction_left_right: LEFT, RIGHT)
// how to rotate under the direction defination : (rotate: input=>direction, output=>direction after rotate)
// how to get the string from direction defination: (getDirectionString: input=>direction, output=>strings)
// the width and length of the table: (TABLE_MAX_WIDTH: 5, TABLE_MAX_LENGTH: 5)
// is the project running on debug mode. (DEBUG: false in default)
//
module.exports = {
    Direction_static,
    Direction_left_right,
    rotate,
    getDirectionString,
    TABLE_MAX_WIDTH,
    TABLE_MAX_LENGTH,
    DEBUG
}



