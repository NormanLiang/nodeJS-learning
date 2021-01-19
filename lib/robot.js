const logger = require('../log');
const DEF = require('./def')
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

const ONTABLE = 'ONTABLE';
const STATE = 'STATE';
const POS = 'POS';
const FACING = 'FACING';
const TRACE = 'TRACE'; 


const Robot_state = {
    IDLE: 0,
    POSITIONING: 1,
    MOVING: 2,
    ROTATING: 3,
    REPORTING: 4
}

const Robot_Info = {
    ONTABLE: 0,
    POS: 1,
    STATE: 2,
    FACING: 3,
    TRACE: 4
}


function Robot(pos, facing) {

    this.facing = facing;
    this.pos = pos;

    this.on_table = false;
    this.state = Robot_state.IDLE;

    this.trace = '';
}

var robot = new Robot({x:0, y:0}, DEF.Direction_static.NORTH);

function position(cmd) {

    var cmd_info = cmd.split(' ');

    pos_info = cmd_info[place_index.content].split(',');
    pox = parseInt(pos_info[place_index.pos_x]);
    poy = parseInt(pos_info[place_index.pos_y]);
    dir = pos_info[place_index.facing];

    if (DEF.Direction_static[pos_info[place_index.facing]] != undefined) {
        if (pox >= ROBOT_POS_X_MIN && pox <= ROBOT_POS_X_MAX && poy >= ROBOT_POS_Y_MIN && poy <= ROBOT_POS_Y_MAX) {
            robot.pos.x = pox;
            robot.pos.y = poy;
            robot.facing = DEF.Direction_static[pos_info[place_index.facing]];

            robot.state = Robot_state.POSITIONING;
        }
        else {
            //invalid position
            logger.log('invalid position from cmd: ' + cmd);
            robot.state = Robot_state.IDLE;
        }
    }
    else {
        //invalid direction
        logger.log('invalid direction from cmd: ' + cmd);
        robot.state = Robot_state.IDLE;
    }

}

function left(cmd) {

    robot.facing = DEF.rotate(robot.facing, DEF.Direction_left_right.LEFT);

    robot.state = Robot_state.ROTATING;
}

function right(cmd) {

    robot.facing = DEF.rotate(robot.facing, DEF.Direction_left_right.RIGHT);

    robot.state = Robot_state.ROTATING;
}

function move(cmd) {

    x = robot.pos.x;
    y = robot.pos.y;

    switch (robot.facing) {
        case DEF.Direction_static.NORTH:
            robot.pos.y += (robot.pos.y == ROBOT_POS_Y_MAX ? 0 : 1);
            break;
        case DEF.Direction_static.EAST:
            robot.pos.x += (robot.pos.x == ROBOT_POS_X_MAX ? 0 : 1);
            break;
        case DEF.Direction_static.WEST:
            robot.pos.x -= (robot.pos.x == ROBOT_POS_X_MIN ? 0 : 1);
            break;
        case DEF.Direction_static.SOUTH:
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
}

function getState() {
    return robot.state;
}

function getPosition() {
    return (robot.on_table? {x:robot.pos.x, y:robot.pos.y} : undefined);
}


var funs = {
    'MOVE': move,
    'LEFT': left,
    'RIGHT': right,
    'REPORT': report,
}

function act(cmd) {

    let validcmd = false; 

    if (typeof(cmd)=='string')
    {
        if (FUN.isValidPlace(cmd))
        {
            position(cmd);
            if (robot.state != Robot_state.IDLE) {
                robot.on_table = true;
                // console.log('on table');
            } else {
                // console.log('not on table');
            }
            validcmd = true;
        }
        else if (funs.hasOwnProperty(cmd))
        {
            if (robot.on_table) {
                funs[cmd]();
            }
            validcmd = true;
        } else {

            let ptt = /\breset\b/i;
            if (DEF.DEBUG && ptt.test(cmd)) {
                reset();
                validcmd = true;
            }
        }
    
        if (robot.on_table) {
            let fc_rp = DEF.getDirectionString(robot.facing);
            logger.log(cmd, robot.pos.x, robot.pos.y, fc_rp);
            robot.trace += cmd + '$$' + robot.pos.x + ',' +robot.pos.y + ',' + fc_rp + '%%';
        }
        else {
            robot.trace += cmd + '%%';
        }
    }

    return validcmd;
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
    robot.facing = DEF.Direction_static.NORTH;
    robot.pos = {x:0, y:0};

    robot.on_table = false;
    robot.state = Robot_state.IDLE;

    robot.trace = '';    
}

function setTracing(str) {
    robot.trace = str;   
}

function getInfo(idx) {

    let ret = null;

    switch (idx)
    {
        case Robot_Info.ONTABLE:
            ret = getOntable();
            break;
        case Robot_Info.STATE:
            ret = getState()
            break;
        case Robot_Info.FACING:
            ret = getFacing();
            break;
        case Robot_Info.POS:
            ret = getPosition();
            break;
        case Robot_Info.TRACE:
            ret = getTracing();
            break;
        default:
            break;
    }
    
    return ret;
}

//  
//  robot module export only 2 fucntions and two defines
//  the last two functions: reset and settracing are only used for test 
//
//  act: input ==> command, output ==> isValidCommand
//  if command is valid, the robot would make action, but not going to report until take 'REPORT' command.
//
//  getInfo: input ==> info index (defined in Robot_Info), output ==> info value. ie. getInfo(OnTable) ==> true or false  
//
//  Robot_Info defined info index: ONTABLE, STATE, POS, TRACE, FACING
//  
//  Robot_state defined robot state: IDLE, MOVING, REPORTING, ROTATING
//
module.exports = {
    act,
    getInfo,
    Robot_Info,
    Robot_state,
    reset,
    setTracing
};
