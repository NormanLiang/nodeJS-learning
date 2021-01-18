
var express = require('express');
var router = express.Router();
var robot = require('../lib/robot');
var FUNS = require('../lib/funs');
var module_define = require('../lib/def');


router.get('/', function(req, res, next) {
    res.render('index');
});

router.post('/', function(req, res, next) {

    cmds = FUNS.parseCmd(req.body.cmd);

    for (i=0; i<cmds.length; i++)
    {
        if (robot.act(cmds[i]))
        {
            let pos_x = robot.getPositionX();
            let pos_y = robot.getPositionY();
            let facing = module_define.getDirectionString(robot.getFacing());
            let trace = robot.getTracing();

            var report = `${pos_x},${pos_y},${facing}`;
            res.send({'CMD':req.body.cmd, 'REPORT': report, 'TRACE': trace});
//            res.send({'POS X': pos_x, 'POS Y': pos_y, 'FACING': facing});
            break;
        }
    }
    
    
});



module.exports = router;

