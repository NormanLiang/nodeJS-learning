from typing import List, get_type_hints
import xmltodict
import sys
import requests
import json
from enum import Enum

TEST_URL = 'http://127.0.0.1:8081/'

g_logfile = None

CONST_HARD_RETURN = '\r\n'

VALID_COMMANDS = [
    'PLACE',
    'MOVE',
    'LEFT',
    'RIGHT',
    'REPORT'
]

VALID_DIRECTION = [
    'NORTH',
    'EAST',
    'SOUTH',
    'WEST'
]

class DIR(Enum):
    DIR_LEFT = 0
    DIR_RIGHT = 1


class FACING(Enum):
    FC_NORTH = 0
    FC_EAST = 1
    FC_SOUTH = 2
    FC_WEST = 3


TABLE_SIZE_X_MIN = 0
TABLE_SIZE_X_MAX = 4
TABLE_SIZE_Y_MIN = 0
TABLE_SIZE_Y_MAX = 4

class robot():

    def __init__(self):
        self.__onTable = False
        self.__posX = 0
        self.__posY = 0
        self.__facing = 'NORTH'

    def rotate(self, cmd):

        if self.__onTable:

            if (cmd == VALID_COMMANDS[2]):
                ROTATE_LEFT = {
                    'NORTH':'WEST',
                    'EAST':'NORTH',
                    'SOUTH':'EAST',
                    'WEST':'SOUTH'
                }
                self.__facing = ROTATE_LEFT[self.__facing]
            else:
                ROTATE_RIGHT = {
                    'NORTH':'EAST',
                    'EAST':'SOUTH',
                    'SOUTH':'WEST',
                    'WEST':'NORTH'
                }
                self.__facing = ROTATE_RIGHT[self.__facing]
            
            return True
        else:
            return False

    def move(self, *cmd):
        
        ret = False
        if self.OnTable:
            
            funs = {
                'NORTH': lambda x: x+1 if x<TABLE_SIZE_Y_MAX else x,
                'EAST': lambda x: x+1 if x<TABLE_SIZE_X_MAX else x,
                'SOUTH': lambda x: x-1 if x>TABLE_SIZE_Y_MIN else x,
                'WEST': lambda x: x-1 if x>TABLE_SIZE_X_MIN else x,
            }

            f = funs.get(self.__facing)
            if f is not None:
                if self.__facing == 'NORTH' or self.__facing == 'SOUTH':
                    self.__posY = f(self.__posY)
                else:
                    self.__posX = f(self.__posX)
            
            ret = True 
        else:
            pass

        return ret
    
    @property
    def OnTable(self):
        return self.__onTable

    @OnTable.setter
    def OnTable(self, on):
        self.__onTable = on


    def checkPos(self, x, y):
        if x >= TABLE_SIZE_X_MIN and x <= TABLE_SIZE_X_MAX and y >= TABLE_SIZE_Y_MIN and y <= TABLE_SIZE_Y_MAX:
            return True
        else:
            return False

    def place(self, cmd):

        ret = False
        pos_if = cmd.split(' ')[1]
        pos_if = pos_if.split(',')
        x = pos_if[0]
        y = pos_if[1]
        f = pos_if[2]

        if f in VALID_DIRECTION and self.checkPos(int(x), int(y)):
            self.__facing = f
            self.__posX = int(x)
            self.__posY = int(y)
            self.OnTable = True

            ret = True
            
        return ret

    def report(self, *args):
        if (self.OnTable):
            return (str(self.__posX) + ',' + str(self.__posY) + ',' + self.__facing)
        else:
            return ''

    def reset(self):
        self.__onTable = False
        self.__posX = 0
        self.__posY = 0
        self.__facing = 'NORTH'        

    def act(self, cmd):
        funs = {
            VALID_COMMANDS[0]: self.place,
            VALID_COMMANDS[1]: self.move,
            VALID_COMMANDS[2]: self.rotate,
            VALID_COMMANDS[3]: self.rotate,
            VALID_COMMANDS[4]: self.report
        }

        if cmd.startswith(VALID_COMMANDS[0]):
            f = funs.get(VALID_COMMANDS[0])
        else:
            f = funs.get(cmd, None)

        if f is not None:
            return f(cmd)
        
        return False


g_robot = robot()

TEST_LOG_FILENAME = 'test.log'

g_logfile = open(TEST_LOG_FILENAME, 'w', newline='')



def open_json(tar):
    js = None
    try:
        js = json.loads(tar)
    except:
        pass

    return js

def isValidCmd(cmd):

    if cmd in VALID_COMMANDS:
        return True
    else:
        cmd = cmd.split(' ')[0]
        if cmd in VALID_COMMANDS:
            return True

    return False

def outputInfile(cmd, ispass):
    if ispass:
        g_logfile.write('test pass on ' + cmd + CONST_HARD_RETURN)
        print('test pass on ' + cmd)           
    else:
        g_logfile.write('test fail on ' + cmd + CONST_HARD_RETURN)
        print('test fail on ' + cmd)     

def verify_result(js):

    global g_logfile

    if 'TRACE' in js.keys() and 'REPORT' in js.keys():
        cmds = js['CMD']
        trace = js['TRACE']
        report = js['REPORT']

        cmds = cmds.split('\r\n')
        trace = trace.split('%%')

        for i in range(0, len(cmds)):
            if (isValidCmd(cmds[i])):
                ret = g_robot.act(cmds[i])

                if ret:
                    res = trace[i].split('$$')[1]
                    re = g_robot.report()
                    if res == re:
                        outputInfile(trace[i], True)
                    else:
                        outputInfile(trace[i], False)

                else:
                    if g_robot.OnTable:
                        pass
                    else:
                        if trace[i] == cmds[i]:
                            outputInfile(trace[i], True)
                        else:
                            outputInfile(trace[i], False)
        
    elif 'RES' in js.keys():

        if js['RES'] == 'NOT ON TABLE: ERROR IN RELEASE CODE' or js['RES'] == 'ERROR':
            if g_robot.OnTable:
                if isValidCmd(js['CMD']): 
                    outputInfile(js['CMD'], False)
                else:
                    outputInfile(js['CMD'], True)
            else:
                outputInfile(js['CMD'], True)


def test_case(cs):
    if isinstance(cs, List):
        cmd = {'cmd':'\r\n'.join(cs)}
    else:
        cmd = {'cmd': cs}
    try:
        res = requests.post(TEST_URL, data=cmd, timeout=5)
        js = open_json(res.text)
        g_logfile.write('group test start' + CONST_HARD_RETURN)
        verify_result(js)
        g_logfile.write('group test end' + CONST_HARD_RETURN)
        # g_robot.reset()

    except Exception as e:
        print(e)
    finally:
        pass




for arg in sys.argv:

    if arg.endswith('.xml'):

        g_logfile.write('start ----' + arg + '\r\n')
        with open(arg) as f:
            f_xml = xmltodict.parse(f.read())
            group_cases = f_xml['testcases']['group']

            for case in group_cases:
                if case is not None:
                    test_case(case['s'])
        g_logfile.write('end ----' + arg + '\r\n')

g_logfile.close()
