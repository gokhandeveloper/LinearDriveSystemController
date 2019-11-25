console.log('INIT');

var express = require('express');
var app = express();
var path = require('path');
app.use(express.static('public'));
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./params.ini');
var Commands = require('./commands.js');
require('events').EventEmitter.prototype._maxListeners = 100;
var com = new Commands();

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + 'index.html'));
});

app.get('/move', function (req, res) {
    //mockStepperDelayOfExecution(req, res);
    doMove(req, function (data) {
        console.log('->Move finished.');
        res.json(data);
    });
});
app.get('/getParams', function (req, res) {
    //mockStepperDelayOfExecution(req, res);
    var machine = req.query['machine'];
    var data = createParamObject(machine);
    console.log(data);
    res.json(data);

});

var server = app.listen(8083, function () {
    var host = "localhost";
    var port = server.address().port;
    console.log("Express listening at http://%s:%s", host, port);
});

function doMove(req, callback) {
    //get parameters
    var steps = req.query['steps'];
    var speed = req.query['speed'];
    var direction = req.query['direction'];
    console.log("steps =" + steps);
    console.log("speed = " + speed);
    console.log("direction = " + direction);
    com.moveStepper(steps, speed, direction, function (data) {
        console.log(data);
        callback(data);
    });
}

function createParamObject(machine) {
    var params = {
        moveUrl: properties.get('track.' + machine + '.moveUrl'),
        defaultSpeedInSteps: properties.get('track.' + machine + '.defaultSpeedInSteps'),
        stepsFor1MM: properties.get('track.' + machine + '.stepsFor1MM'),
        startOfTrack: properties.get('track.' + machine + '.startOfTrack'),
        endOfTrack: properties.get('track.' + machine + '.endOfTrack'),
        orientation:properties.get('track.' + machine + '.orientation')
    };
    return params;
}

//Mockers
function mockStepperDelayOfExecution(steps, direction, res) {
    var mock_delay_of_execution = 1000;
    if (isNumber(steps)) {
        var delay = steps * mock_delay_of_execution;
        console.log('delay ----> ' + delay);
        for (var i = 0; i <= delay; i++) {
            //empty loop just to mock a delay.
        }
        console.log('Done ' + steps + ' steps');
        var data = {steps: parseInt(steps),
            last_direction: parseInt(direction)};
        res.json(data);
    } else {
        console.log("BAD PARAM");
    }
}
