const logger = require('../log');
const module_define = require('./def')
const FUN = require('./funs')


const place_index = {
    cmd: 0,
    content: 1, 
    pos_x: 0,
    pos_y: 1,
    facing: 2,
}

const ROBOT_POS_X_MAX = 4;
const ROBOT_POS_X_MIN = 0;

const ROBOT_POS_Y_MAX = 4;
const ROBOT_POS_Y_MIN = 0;

const Robot_state = {
    IDLE: 0,
    POSITIONING: 1,
    MOVING: 2,
    ROTATING: 3,
    REPORTING: 4
}

function Robot(pos, facing) {

    this.facing = facing;
    this.pos = pos;

    this.on_table = false;
    this.state = Robot_state.IDLE;
//    this.fc_report = module_define.getDirectionString(facing);

    this.trace = '';
}

var robot = new Robot({x:0, y:0}, module_define.Direction_static.NORTH);

function position(cmd) {

    var cmd_info = cmd.split(' ');
    var reg = /place/i;

//    console.log('position is called' + ' ' + cmd);
    if (reg.test(cmd_info[place_index.cmd]))
    {
        pos_info = cmd_info[place_index.content].split(',');
        pox = parseInt(pos_info[place_index.pos_x]);
        poy = parseInt(pos_info[place_index.pos_y]);
        dir = pos_info[place_index.facing];

        if (module_define.Direction_static[pos_info[place_index.facing]] != undefined) {
            if (pox >= ROBOT_POS_X_MIN && pox <= ROBOT_POS_X_MAX && poy >= ROBOT_POS_Y_MIN && poy <= ROBOT_POS_Y_MAX) {
                robot.pos.x = pox;
                robot.pos.y = poy;
                robot.facing = module_define.Direction_static[pos_info[place_index.facing]];
    
                robot.state = Robot_state.POSITIONING;
//                console.log('position success');
            }
            else {
                //invalid position
                logger.log('invalid position from cmd: ' + cmd);
//                console.log('invalid position');
                robot.state = Robot_state.IDLE;
            }
        }
        else {
//            console.log('invalid direction');
            logger.log('invalid direction from cmd: ' + cmd);
            robot.state = Robot_state.IDLE;
        }
    }
    else
    {
        // invalid cmd 
        logger.log('invalid command from cmd: ' + cmd);
//        console.log('invalid command');
        robot.state = Robot_state.IDLE;
    }
}

function left(cmd) {

    robot.facing = module_define.rotate(robot.facing, module_define.Direction_left_right.LEFT);

    robot.state = Robot_state.ROTATING;
}

function right(cmd) {

    robot.facing = module_define.rotate(robot.facing, module_define.Direction_left_right.RIGHT);

    robot.state = Robot_state.ROTATING;
}

function move(cmd) {

//    console.log('move is called...');
    x = robot.pos.x;
    y = robot.pos.y;

    switch (robot.facing) {
        case module_define.Direction_static.NORTH:
            robot.pos.y += (robot.pos.y == ROBOT_POS_Y_MAX ? 0 : 1);
            break;
        case module_define.Direction_static.EAST:
            robot.pos.x += (robot.pos.x == ROBOT_POS_X_MAX ? 0 : 1);
            break;
        case module_define.Direction_static.WEST:
            robot.pos.x -= (robot.pos.x == ROBOT_POS_X_MIN ? 0 : 1);
            break;
        case module_define.Direction_static.SOUTH:
            robot.pos.y -= (robot.pos.y == ROBOT_POS_Y_MIN ? 0 : 1);
            break;
        default:
            break;
    }

    if (robot.pos.x == x && robot.pos.y == y) {
        robot.state = Robot_state.IDLE;
    }
    else {
        robot.state = Robot_state.MOVING;
    }
}

function report(cmd) {

    robot.state = Robot_state.REPORTING;
//    robot.fc_report = module_define.getDirectionString(robot.facing);
}

var funs = {
    'PLACE': position,
    'MOVE': move,
    'LEFT': left,
    'RIGHT': right,
    'REPORT': report,
}

function act(cmd) {

//    console.log('act is called ' + cmd);

    if (typeof(cmd)=='string')
    {
        if (FUN.isValidPlace(cmd))
        {
    //        console.log('calling place ');
            funs['PLACE'](cmd);
            if (robot.state != Robot_state.IDLE) {
                robot.on_table = true;
    //            console.log('robot on table');
            }
        }
        else if (funs.hasOwnProperty(cmd) && robot.on_table)
        {
//            console.log('calling move');
            funs[cmd]();
        }
    
        if (robot.on_table) {
            fc_rp = module_define.getDirectionString(robot.facing);
            logger.log(cmd, robot.pos.x, robot.pos.y, fc_rp);
            robot.trace += cmd + '$$' + robot.pos.x + ',' +robot.pos.y + ',' + fc_rp + '%%';
        }
        else {
            robot.trace += cmd + '%%';
        }
    }

    return (robot.state==Robot_state.REPORTING ? true : false);
}

function getPositionX() {
//    console.log('on table' + robot.on_table);
    return (robot.on_table? robot.pos.x : undefined);
}

function getPositionY() {
    return (robot.on_table? robot.pos.y : undefined);
}

function getFacing() {
    return (robot.on_table? robot.facing : undefined);
}

function getTracing() {
    return robot.trace;
}

function getOntable() {
    return robot.on_table;
}

function reset() {
    robot.facing = module_define.Direction_static.NORTH;
    robot.pos = {x:0, y:0};

    robot.on_table = false;
    robot.state = Robot_state.IDLE;

    robot.trace = '';    
}

module.exports = {
    act,
    getPositionX,
    getPositionY,
    getFacing,
    reset,
    getOntable,
    getTracing
};
