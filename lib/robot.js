const logger = require('../log');
const DEF = require('./def')
const FUN = require('./funs')




const ROBOT_POS_X_MAX = DEF.TABLE_MAX_LENGTH-1;
const ROBOT_POS_X_MIN = 0;

const ROBOT_POS_Y_MAX = DEF.TABLE_MAX_WIDTH-1;
const ROBOT_POS_Y_MIN = 0;

const ONTABLE = 'ONTABLE';
const STATE = 'STATE';
const POS = 'POS';
const FACING = 'FACING';
const TRACE = 'TRACE'; 


const Robot_state = {
    IDLE: 0,
    PLACING: 1,
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


var Robot = function (pos, facing) {

    this.facing = facing;
    this.pos = {};
    this.pos.x = pos.x;
    this.pos.y = pos.y;

    this.on_table = false;
    this.state = Robot_state.IDLE;

    this.trace = '';

    this.setState = function (st) {
        this.state = st;
    }

    this.move = function () {
        x = this.pos.x;
        y = this.pos.y;
    
        switch (robot.facing) {
            case DEF.Direction_static.NORTH:
                this.pos.y += (this.pos.y == ROBOT_POS_Y_MAX ? 0 : 1);
                break;
            case DEF.Direction_static.EAST:
                this.pos.x += (this.pos.x == ROBOT_POS_X_MAX ? 0 : 1);
                break;
            case DEF.Direction_static.WEST:
                this.pos.x -= (this.pos.x == ROBOT_POS_X_MIN ? 0 : 1);
                break;
            case DEF.Direction_static.SOUTH:
                this.pos.y -= (this.pos.y == ROBOT_POS_Y_MIN ? 0 : 1);
                break;
            default:
                break;
        }
    
        if (this.pos.x == x && this.pos.y == y) {
            this.setState(Robot_state.IDLE);
        }
        else {
            this.setState(Robot_state.MOVING);
        }        
    }

    this.left = function () {
        this.facing = DEF.rotate(this.facing, DEF.Direction_left_right.LEFT);
        this.setState(Robot_state.ROTATING);
    }
    
    this.right = function () {
        this.facing = DEF.rotate(this.facing, DEF.Direction_left_right.RIGHT);
        this.setState(Robot_state.ROTATING);
    }
    
    this.report = function () {
        this.setState(Robot_state.REPORTING);
    }

    this.place = function (cmd) {
        const place_index = {
            cmd: 0,
            content: 1, 
            pos_x: 0,
            pos_y: 1,
            facing: 2,
        }
        var cmd_info = cmd.split(' ');
    
        pos_info = cmd_info[place_index.content].split(',');
        pox = parseInt(pos_info[place_index.pos_x]);
        poy = parseInt(pos_info[place_index.pos_y]);
        dir = pos_info[place_index.facing];
    
        if (DEF.Direction_static[pos_info[place_index.facing]] != undefined) {
            if (pox >= ROBOT_POS_X_MIN && pox <= ROBOT_POS_X_MAX && poy >= ROBOT_POS_Y_MIN && poy <= ROBOT_POS_Y_MAX) {
                this.pos.x = pox;
                this.pos.y = poy;
                this.facing = DEF.Direction_static[pos_info[place_index.facing]];
    
                this.setState(Robot_state.PLACING);
            }
            else {
                //invalid position
                logger.log('invalid position from cmd: ' + cmd);
                this.setState(Robot_state.IDLE);
            }
        }
        else {
            //invalid direction
            logger.log('invalid direction from cmd: ' + cmd);
            this.setState(Robot_state.IDLE);
        }
    
    }

    this.setOntable = function (on) {
        this.on_table = on;
    }

    this.getOntable = function () {
        return this.on_table;
    }

    this.getState = function () {
        return this.state;
    }
     
    this.reset = function () {
        this.facing = DEF.Direction_static.NORTH;
        this.pos = {x:0, y:0};
    
        this.setOntable(false);
        this.setState(Robot_state.IDLE);
    
        this.trace = '';    
    }

    this.getPosition = function () {
        return (this.on_table? {x:this.pos.x, y:this.pos.y} : undefined);
    }

    this.getFacing = function () {
        return this.facing;
    }

    this.setTracing = function (cmd) {
        let fc_rp = DEF.getDirectionString(this.facing);

        if (this.on_table) {
            let fc_rp = DEF.getDirectionString(this.facing);
//            logger.log(cmd, robot.pos.x, robot.pos.y, fc_rp);
            this.trace += cmd + '$$' + this.pos.x + ',' +this.pos.y + ',' + fc_rp + '%%';
        }
        else {
            this.trace += cmd + '%%';
        }
    }

    this.getTracing = function () {
        return this.trace;
    }

    this.resetTracing = function () {
        this.trace = '';
    }

    this.acting = function (cmd) {
        
        if (/\bmove\b/i.test(cmd)) {
            this.move();
        } else if (/\bleft\b/i.test(cmd)) {
            this.left();
        } else if (/\bright\b/i.test(cmd)) {
            this.right();
        } else if (/\breport\b/i.test(cmd)) {
            this.report();
        } else {

        }
    }
    
}

var robot = new Robot({x:0, y:0}, DEF.Direction_static.NORTH);


function cmdCheck(cmd) {
    var patt_d = /\bmove\b|\bleft\b|\bright\b|\breport\b/i;

    return patt_d.test(cmd);
}


function act(cmd) {

    let validcmd = false; 

    if (typeof(cmd)=='string')
    {
        if (FUN.isValidPlace(cmd))
        {
            robot.place(cmd);
            if (robot.getState() != Robot_state.IDLE) {
                robot.setOntable(true);
                // console.log('on table');
            } else {
                // console.log('not on table');
            }
            validcmd = true;
        }
        else if (cmdCheck(cmd))
        {
            if (robot.getOntable()) {
                robot.acting(cmd);
            }
            validcmd = true;
        } else {

            let ptt = /\breset\b/i;
            if (DEF.DEBUG && ptt.test(cmd)) {
                robot.reset();
                validcmd = true;
            }
        }

        if (DEF.DEBUG) {
            robot.setTracing(cmd);
        }
        
    }

    return validcmd;
}



function getInfo(idx) {

    let ret = null;

    switch (idx)
    {
        case Robot_Info.ONTABLE:
            ret = robot.getOntable();
            break;
        case Robot_Info.STATE:
            ret = robot.getState()
            break;
        case Robot_Info.FACING:
            ret = robot.getFacing();
            break;
        case Robot_Info.POS:
            ret = robot.getPosition();
            break;
        case Robot_Info.TRACE:
            ret = robot.getTracing();
            break;
        default:
            break;
    }
    
    return ret;
}

function robotReset() {
    robot.reset();
}

function robotResetTrace() {
    robot.resetTracing();
}

//  
//  robot module export only 2 fucntions and two defines
//  the last two functions: reset and settracing are only used for test 
//
//  act: input ==> command, output ==> isValidCommand
//  if command is valid, the robot would make action, but not going to report until received 'REPORT' command.
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
    robotReset,
    robotResetTrace
};
