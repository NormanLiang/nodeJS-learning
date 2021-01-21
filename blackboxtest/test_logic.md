Test Logic

DEBUG is defined in def.js. 

Python test command: python3 test.py testcase1.xml testcase2.xml ... 

1. If the robot is not on the table, server only receive correct 'PLACE'. For the other command, server should not response. When the project is set in debug mode, server would response 'NOT ON TABLE'.
   
2. If the robot is on the table, server can receive valid command. For those invalid command, server should return 'ERROR'. For valid command, the server should return position and facing information when the command is 'REPORT'. When the command is not 'REPORT' and the command is valid, the server should act but only return 'OK'.
   
3. If the robot is on the table, the robot should moving inside the table. If the command would control the robot out of the table, the command is still be received without any action. Server should return 'OK'.







