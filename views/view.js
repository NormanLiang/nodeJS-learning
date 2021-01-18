
var bt_place = document.getElementById('place');
var bt_move = document.getElementById('move')
var bt_left = document.getElementById('left')
var bt_right = document.getElementById('right')
var bt_report = document.getElementById('report')

var bt_send = document.getElementById('send')

bt_place.addEventListener('click', function() {
    
    var val = document.getElementById('command');
    var num1 = document.getElementById('num1');
    var num2 = document.getElementById('num2');
    var dir = document.getElementById('direction');

    if (num1.value == "" || num1.value == undefined || num1.value == null){
        num1.value = 0;
    }
    if (num2.value == "" || num2.value == undefined || num2.value == null){
        num2.value = 0;
    }    

    if (val.value == "" || val.value == undefined || val.value == null) {
        val.value = 'PLACE ';
    }
    else {
        val.value += '\nPLACE '; 
    }

    val.value += num1.value + ',' + num2.value + ',' + dir.value;

}, false);

bt_move.addEventListener('click', function() {
    var val = document.getElementById('command');
    if (val.value == "" || val.value == undefined || val.value == null) {
        val.value = "MOVE";
    }
    else {
        val.value += '\nMOVE';
    }

}, false);

bt_left.addEventListener('click', function() {
    var val = document.getElementById('command');
    if (val.value == "" || val.value == undefined || val.value == null) {
        val.value = "LEFT";
    }
    else {
        val.value += '\nLEFT';
    }
}, false);

bt_right.addEventListener('click', function() {
    var val = document.getElementById('command');
    if (val.value == "" || val.value == undefined || val.value == null) {
        val.value = "RIGHT";
    }
    else {
        val.value += '\nRIGHT';
    }
}, false);

bt_report.addEventListener('click', function() {
    var val = document.getElementById('command');
    if (val.value == "" || val.value == undefined || val.value == null) {
        val.value = "REPORT";
    }
    else {
        val.value += '\nREPORT';
    }
}, false);

