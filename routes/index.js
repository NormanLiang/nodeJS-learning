
var express = require('express');
var router = express.Router();
var robot = require('../lib/robot');
var FUNS = require('../lib/funs');
var DEF = require('../lib/def');


const RETURN_STATE = {
    RETURN_REPORTING: 0,
    RETURN_OK: 1,
    RETURN_ERROR: 2
}

router.get('/', function(req, res, next) {
    res.render('index');
});

router.post('/', function(req, res, next) {

    let cmds = FUNS.parseCmd(req.body.cmd);
    let res_state = RETURN_STATE.RETURN_ERROR;
    let pos_x, pos_y, facing, trace, report;

    for (i=0; i<cmds.length; i++)
    {
        if (robot.act(cmds[i]))
        {
            //it's at least a valid command
            if (robot.getInfo(robot.Robot_Info.STATE) == robot.Robot_state.REPORTING) { 
                res_state = RETURN_STATE.RETURN_REPORTING;

                break;  //if received a 'REPORT', send response and ingnore the rest command

            } else {
                // command is valid, but not going to report pos
                res_state = RETURN_STATE.RETURN_OK;
            }
        
        }
    }

    switch (res_state) {

        case RETURN_STATE.RETURN_REPORTING:
            //goint to report the pos and facing
            pos_x = robot.getInfo(robot.Robot_Info.POS).x;
            pos_y = robot.getInfo(robot.Robot_Info.POS).y;
            facing = DEF.getDirectionString(robot.getInfo(robot.Robot_Info.FACING));
            trace = robot.getInfo(robot.Robot_Info.TRACE);
    
            report = `${pos_x},${pos_y},${facing}`;
    
            if (DEF.DEBUG) {
                res.send({'CMD':req.body.cmd, 'REPORT': report, 'TRACE': trace});
            } else {
                res.send({'POS X': pos_x, 'POS Y': pos_y, 'FACING': facing});
            }  
            robot.robotResetTrace();          
            break;

        case RETURN_STATE.RETURN_OK:
            if (DEF.DEBUG) {
                if (robot.getInfo(robot.Robot_Info.ONTABLE)) {
                    pos_x = robot.getInfo(robot.Robot_Info.POS).x;
                    pos_y = robot.getInfo(robot.Robot_Info.POS).y;
                    facing = DEF.getDirectionString(robot.getInfo(robot.Robot_Info.FACING));
                    trace = robot.getInfo(robot.Robot_Info.TRACE);
        
                    report = `${pos_x},${pos_y},${facing}`;
                    res.send({'CMD':req.body.cmd, 'REPORT': report, 'TRACE': trace});
                    
                } else {
                    res.send({'CMD':req.body.cmd, 'RES': 'NOT ON TABLE: ERROR IN RELEASE CODE'});
                }
                
            } else {
                if (robot.getInfo(robot.Robot_Info.ONTABLE)) {
                    res.send({'CMD':req.body.cmd, 'RES': 'OK'});
                } else {
                    res.send({'CMD':req.body.cmd, 'RES': 'ERROR'});
                }
                
            }
            robot.robotResetTrace();
            break;

        case RETURN_STATE.RETURN_ERROR:
            res.send({'CMD':req.body.cmd, 'RES': 'ERROR'});
            robot.robotResetTrace();
            break;

        default:
            break;
    }
});



module.exports = router;

