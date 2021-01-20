var express = require('express');
var app = express();
var index = require('./routes/index');
var hbs = require('hbs');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('./log/index');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.engine('html', hbs.__express); 

//bodyParser must come befoe router
app.use(bodyParser.urlencoded({extended: false}));

//router
app.use('/', index);

app.use(express.static(__dirname + '/views'));

app.listen(8081);

console.log('server is running, please visit http://127.0.0.1:8081 to test');
logger.log('server running at http://127.0.0.1:8081');

