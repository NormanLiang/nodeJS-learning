const assert = require('assert');
const robot = require('../lib/robot');
const DEF = require('../lib/def');
const FUNS = require('../lib/funs');
const { table } = require('../log');

const test_cases_valid_place = [
    'PLACE 0,0,NORTH',
    'PLACE 1,4,EAST',
    'PLACE 2,3,WEST',
    'PLACE 3,2,SOUTH',
    'PLACE 4,1,NORTH'
]

const test_cases_invalid_place = [
    null,
    undefined,
    '',
    ' ',
    'PA 0,0,NORTH',
    '0,0,EAST',
    'PLACE 0,0',
    'PLACE 0,5,WEST',
    'PLACE 5,0,EAST',
    'PLACE 0,0,NOATH',
    'PLACE 0, 0, NORTH',
    'PLACE -1,2,SOUTH',
    'PLACE 4,-1,NORTH'    
]

const test_cases_move = [
    'HAHA',
    'MO',
    undefined,
    null,
    '',
    'MOVE',
]

//f is defined in def.js
const test_cases_move_positon = {
    'PLACE 0,0,NORTH': {x:0, y:1, f:0},
    'PLACE 2,4,NORTH': {x:2, y:4, f:0},
    'PLACE 0,0,EAST': {x:1, y:0, f:1},
    'PLACE 4,3,EAST': {x:4, y:3, f:1},
    'PLACE 2,0,SOUTH': {x:2, y:0, f:2},
    'PLACE 2,3,SOUTH': {x:2, y:2, f:2},
    'PLACE 1,4,WEST': {x:0, y:4, f:3},
    'PLACE 0,2,WEST': {x:0, y:2, f:3}
}

const test_cases_rotate_left = [
    'LE',
    'N',
    undefined,
    null,
    '',
    'LEFT',
]

const test_cases_rotate_right = [
    'RI',
    'N',
    undefined,
    null,
    '',
    'RIGHT',  
]

const test_cases_rotate_left_positon = {
    'PLACE 0,0,NORTH': {x:0, y:0, f:3},
    'PLACE 1,1,EAST': {x:1, y:1, f:0},
    'PLACE 2,2,SOUTH': {x:2, y:2, f:1},
    'PLACE 3,4,WEST': {x:3, y:4, f:2}    
}

const test_cases_rotate_right_positon = {
    'PLACE 0,0,NORTH': {x:0, y:0, f:1},
    'PLACE 2,1,EAST': {x:2, y:1, f:2},
    'PLACE 4,2,SOUTH': {x:4, y:2, f:3},
    'PLACE 3,3,WEST': {x:3, y:3, f:0}    
}

const test_cases_report = [
    'RE',
    'AA',
    undefined,
    null,
    '',
    'REPORT',  
]

const test_cases_report_positon = {
    'PLACE 0,0,NORTH': {x:0, y:0, f:0},
    'PLACE 1,1,EAST': {x:1, y:1, f:1},
    'PLACE 2,2,SOUTH': {x:2, y:2, f:2},
    'PLACE 3,3,WEST': {x:3, y:3, f:3}    
}

const test_cases_on_valid_command = [
    null,
    undefined,
    '',
    ' ',
    'PA 0,0,NORTH',
    '0,0,EAST',
    'PLACE 0,0',
]

describe('#robot.js', ()=> {

    describe('#isValidPlace()', ()=> {
        it('isValidPlace() on testcases', ()=>{
            for (i=0; i<test_cases_on_valid_command.length; i++) {
//                console.log(test_cases_on_valid_command[i]);
                valid = FUNS.isValidPlace(test_cases_on_valid_command[i]);
                assert.strictEqual(valid, false);
            }
            
            for (i=0; i<test_cases_valid_place.length; i++) {
//                console.log(test_cases_valid_place[i]);
                valid = FUNS.isValidPlace(test_cases_valid_place[i]);
                assert.strictEqual(valid, true);
            }
                
        });
    });

    describe('#act()', ()=> {

        it('place test valid test', ()=>{

            for (i=0; i<test_cases_valid_place.length; i++) {
                cmd = test_cases_valid_place[i].split(' ');
                cmd_info = cmd[1].split(',');            
                e_x = parseInt(cmd_info[0]);
                e_y = parseInt(cmd_info[1]);
                e_f = DEF.Direction_static[cmd_info[2]];

                ret = robot.act(test_cases_valid_place[i]);

                pos = robot.getInfo(robot.Robot_Info.POS);
                pos_x = pos.x;
                pos_y = pos.y;
                facing = robot.getInfo(robot.Robot_Info.FACING);  
                tables = robot.getInfo(robot.Robot_Info.ONTABLE); 
                    
                assert.strictEqual(pos_x, e_x);
                assert.strictEqual(pos_y, e_y);  
                assert.strictEqual(facing, e_f);
                assert.strictEqual(ret, true);
            }
        });

        it ('place invalid test', ()=> {

            for (i=0; i<test_cases_invalid_place.length; i++) {

                e_x = robot.getInfo(robot.Robot_Info.POS).x;
                e_y = robot.getInfo(robot.Robot_Info.POS).y;
                e_f = robot.getInfo(robot.Robot_Info.FACING);

                ret = robot.act(test_cases_invalid_place[i]);

                pos_x = robot.getInfo(robot.Robot_Info.POS).x;
                pos_y = robot.getInfo(robot.Robot_Info.POS).y;
                facing = robot.getInfo(robot.Robot_Info.FACING);

                // console.log('11', pos_x, pos_y, facing, ret, test_cases_invalid_place[i]);
                assert.strictEqual(pos_x, e_x);
                assert.strictEqual(pos_y, e_y);  
                assert.strictEqual(facing, e_f);
                assert.strictEqual(ret, false);  
                
                // console.log('test on invalid cases ' + i + ' success');
            }
            
        });

        it ('MOVE test when the robot is off table', ()=>{
            robot.robotReset();

            for (i=0; i<test_cases_move.length; i++) {
                ret = robot.act(test_cases_move[i]);

                if (i != test_cases_move.length-1) {
                    assert.strictEqual(ret, false);
                } else {
                    assert.strictEqual(ret, true);
                }
                on_table = robot.getInfo(robot.Robot_Info.ONTABLE);
                assert.strictEqual(on_table, false);
                // console.log('test on move before on table ' + i + ' success');
            }

            // console.log(test_cases_move_positon);

        });

        it('move test when the robot is on table', ()=>{
            robot.robotReset();
            for (var key in test_cases_move_positon) {
                // console.log('key is ', key);
                // console.log('Value is', test_cases_move_positon[key]);
                robot.act(key);

                on_table = robot.getInfo(robot.Robot_Info.ONTABLE);
                assert.strictEqual(on_table, true);

                for (i=0; i<test_cases_move.length; i++) {    
                    ret = robot.act(test_cases_move[i]);
                    if (i != test_cases_move.length-1) {
                        assert.strictEqual(ret, false);
                    } else {
                        assert.strictEqual(ret, true);
                    }
                }
                pos_x = robot.getInfo(robot.Robot_Info.POS).x;
                pos_y = robot.getInfo(robot.Robot_Info.POS).y;
                facing = robot.getInfo(robot.Robot_Info.FACING);

                assert.strictEqual(pos_x, test_cases_move_positon[key].x);
                assert.strictEqual(pos_y, test_cases_move_positon[key].y);
                assert.strictEqual(facing, test_cases_move_positon[key].f);

                // console.log('test on move after on table ' + key + ' success');
            }
        });

        it ('left test off table', ()=>{
            robot.robotReset();

            for (i=0; i<test_cases_rotate_left.length; i++) 
            {
                ret = robot.act(test_cases_rotate_left[i]);
                
                // console.log('command check ' + i);
                if (i != test_cases_rotate_left.length-1) {
                    //make sure the last one is the valid left command, the others are invalid
                    assert.strictEqual(ret, false);
                } else {
                    assert.strictEqual(ret, true);  
                } 
                on_table = robot.getInfo(robot.Robot_Info.ONTABLE);
                // console.log('on table check');
                assert.strictEqual(on_table, false);
                // console.log('test on left rotating before on table ' + i + ' success');
            }
        });

        it('left test on table', ()=>{
            for (var key in test_cases_rotate_left_positon) {
                // console.log(key);
                robot.robotReset();
                robot.act(key);
                for (i=0; i<test_cases_rotate_left.length; i++) {
                    ret = robot.act(test_cases_rotate_left[i]);
                    on_table = robot.getInfo(robot.Robot_Info.ONTABLE);
                    // console.log('command valid check');
                    if (i != test_cases_rotate_left.length-1) {
                        assert.strictEqual(ret, false);
                    } else {
                        assert.strictEqual(ret, true);
                    }
                    // console.log('on table check');
                    assert.strictEqual(on_table, true);
                }                
                pos_x = robot.getInfo(robot.Robot_Info.POS).x;
                pos_y = robot.getInfo(robot.Robot_Info.POS).y;
                facing = robot.getInfo(robot.Robot_Info.FACING);

                // console.log('position check');
                assert.strictEqual(pos_x, test_cases_rotate_left_positon[key].x);
                assert.strictEqual(pos_y, test_cases_rotate_left_positon[key].y);
                assert.strictEqual(facing, test_cases_rotate_left_positon[key].f);
                // console.log('test on left rotating after on table ' + key + ' success');
            }
        }); 

        it ('right test off table', ()=>{
            robot.robotReset();
            for (i=0; i<test_cases_rotate_right.length; i++) 
            {
                ret = robot.act(test_cases_rotate_right[i]);
                if (i != test_cases_rotate_right.length-1) {
                    assert.strictEqual(ret, false);
                } else {
                    assert.strictEqual(ret, true);
                }
                on_table = robot.getInfo(robot.Robot_Info.ONTABLE);
                assert.strictEqual(on_table, false);
                // console.log('test on left rotating before on table ' + i + ' success');
            }
        });

        it ('right test on table', ()=>{
            
            for (var key in test_cases_rotate_right_positon) {
                robot.robotReset();
                robot.act(key);
                for (i=0; i<test_cases_rotate_right.length; i++) {
                    ret = robot.act(test_cases_rotate_right[i]);
                    // console.log('valid check');
                    if (i != test_cases_rotate_right.length-1) {
                        assert.strictEqual(ret, false);
                    } else {
                        assert.strictEqual(ret, true);
                    }
                    on_table = robot.getInfo(robot.Robot_Info.ONTABLE);
                    // console.log('on table check');
                    assert.strictEqual(on_table, true);
                }                
                pos_x = robot.getInfo(robot.Robot_Info.POS).x;
                pos_y = robot.getInfo(robot.Robot_Info.POS).y;
                facing = robot.getInfo(robot.Robot_Info.FACING);
                // console.log('postion check');
                assert.strictEqual(pos_x, test_cases_rotate_right_positon[key].x);
                assert.strictEqual(pos_y, test_cases_rotate_right_positon[key].y);
                assert.strictEqual(facing, test_cases_rotate_right_positon[key].f);
                // console.log('test on left rotating after on table ' + key + ' success');
            }
        });

        it ('report test on table', ()=>{
            robot.robotReset();
            for (i=0; i<test_cases_report.length; i++) 
            {
                ret = robot.act(test_cases_report[i]);
                on_table = robot.getInfo(robot.Robot_Info.ONTABLE);
                if (i != test_cases_report.length-1) {
                    assert.strictEqual(ret, false);
                } else {
                    assert.strictEqual(ret, true);
                }
                assert.strictEqual(on_table, false);
                // console.log('test on report before on table ' + i + ' success');
            }
        });

        it ('report test on table', ()=>{
            for (var key in test_cases_report_positon) {
                robot.robotReset();
                robot.act(key);
                for (i=0; i<test_cases_report.length; i++) {
                    ret = robot.act(test_cases_report[i]);
                    on_table = robot.getInfo(robot.Robot_Info.ONTABLE);

                    if (test_cases_report[i] == 'REPORT'){
                        assert.strictEqual(ret, true);
                    } else {
                        assert.strictEqual(ret, false);
                    }
                    assert.strictEqual(on_table, true);
                }                
                pos_x = robot.getInfo(robot.Robot_Info.POS).x;
                pos_y = robot.getInfo(robot.Robot_Info.POS).y;
                facing = robot.getInfo(robot.Robot_Info.FACING);

                assert.strictEqual(pos_x, test_cases_report_positon[key].x);
                assert.strictEqual(pos_y, test_cases_report_positon[key].y);
                assert.strictEqual(facing, test_cases_report_positon[key].f);
                // console.log('test on report after on table ' + key + ' success');
            }
        });

    });


    describe('#rotate() in def.js', ()=>{
        it('rotate() on left', ()=>{
            assert.strictEqual(DEF.rotate(0, 0), 3);
            assert.strictEqual(DEF.rotate(1, 0), 0);
            assert.strictEqual(DEF.rotate(2, 0), 1);
            assert.strictEqual(DEF.rotate(3, 0), 2);

            assert.strictEqual(DEF.rotate(null, 0), 0);
            assert.strictEqual(DEF.rotate(undefined, 0), 0);
            assert.strictEqual(DEF.rotate(0, null), 0);
            assert.strictEqual(DEF.rotate(0, undefined), 0);
        });

        it('rotate() on right', ()=>{
            assert.strictEqual(DEF.rotate(0, 1), 1);
            assert.strictEqual(DEF.rotate(1, 1), 2);
            assert.strictEqual(DEF.rotate(2, 1), 3);
            assert.strictEqual(DEF.rotate(3, 1), 0);

            assert.strictEqual(DEF.rotate(null, 0), 0);
            assert.strictEqual(DEF.rotate(undefined, 0), 0);
            assert.strictEqual(DEF.rotate(0, null), 0);
            assert.strictEqual(DEF.rotate(0, undefined), 0);
        });  

    });

    describe('#getDirectionString() in def.js', ()=>{
        it('getDirectionString() ', ()=>{
            assert.strictEqual(DEF.getDirectionString(0), 'NORTH');
            assert.strictEqual(DEF.getDirectionString(1), 'EAST');
            assert.strictEqual(DEF.getDirectionString(2), 'SOUTH');
            assert.strictEqual(DEF.getDirectionString(3), 'WEST');
            assert.strictEqual(DEF.getDirectionString(4), 'NORTH');
            assert.strictEqual(DEF.getDirectionString(40), 'NORTH');
            assert.strictEqual(DEF.getDirectionString(-1), 'NORTH');
            assert.strictEqual(DEF.getDirectionString(null), 'NORTH');
            assert.strictEqual(DEF.getDirectionString(undefined), 'NORTH');
        });
    });

    describe('#isValidPlace() in funs.js', ()=>{
        it('isValidPlace()', ()=>{
            assert.strictEqual(FUNS.isValidPlace('PLACE 0,0,NORTH'), true); 
        });

        it('isValidPlace() on PLACE 0 0 NORTH', ()=>{
            assert.strictEqual(FUNS.isValidPlace('PLACE 0 0 NORTH'), false);
        });

        it('isValidPlace() on PLBCE 0,0,NORTH', ()=>{
            assert.strictEqual(FUNS.isValidPlace('PLBCE 0,0,NORTH'), false);
        });

        it('isValidPlace() on PLACE 0,0,NOATH', ()=>{
            assert.strictEqual(FUNS.isValidPlace('PLACE 0,0,NOATH'), false);
        });

        it('isValidPlace() on place 0,0,north', ()=>{
            assert.strictEqual(FUNS.isValidPlace('place 0,0,north'), true);
        });

        it('isValidPlace() on null', ()=>{
            assert.strictEqual(FUNS.isValidPlace(null), false);
        });

        it('isValidPlace() on undefined', ()=>{
            assert.strictEqual(FUNS.isValidPlace(undefined), false);
        });

    });

    // describe('#parseCmd() in funs.js', ()=>{
    //     it('parseCmd()', ()=>{
    //         assert.strictEqual(FUNS.parseCmd('PLACE 0,0,NORTH'), true);

    //     });
    // });

   

});

