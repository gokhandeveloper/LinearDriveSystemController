var currentPosition = 0;
var stallDetected = false;
var last_direction;
var config;

var Config = function (data) {

    this.moveUrl = data.moveUrl;
    this.stepsFor1MM = data.stepsFor1MM;
    this.defaultSpeedInSteps = data.defaultSpeedInSteps;
    this.startOfTrack = data.startOfTrack;
    this.endOfTrack = data.endOfTrack;
    this.orientation = data.orientation;
    this.fullTrackMoveInSteps = this.stepsFor1MM * this.endOfTrack;
    
};

function updateCurrentPosition(steps, direction) {
    last_direction = direction;
    var move_in_mm = convertStepstoMM(steps);
    if (direction === 1) {
        currentPosition += move_in_mm;
    } else if (direction === 0) {
        currentPosition -= move_in_mm;
    }
    return steps;
}

function mockStall() {
    stallDetected = true;
}

function getConfigParams(machine, callback) {
    console.log("Loading params..");
    $.ajax("/getParams?machine=" + machine)
            .done(function (data) {
                callback(data);
                console.log("Done.");
            })
            .fail(function (data) {
                console.log(data);
                console.log("Cant load param file");
            });
}

var Stepper = function () {
    this.stepAsync = function (steps, direction, callback) {
        runStepsAsync(steps, direction, function (data) {
            callback(data);
        });
    };
    this.restart = function () {
        return runRestart();
    };
};

var stepper = new Stepper();

function moveloadAsync(travelLength, dir, callback) {
    if (isValidMove(travelLength, dir)) {
        var actualSteps = calculateActualSteps(travelLength, dir);
        var direction = convertDirectionFromLitterals(dir);
        var steps = convertMMtoSteps(actualSteps);
        stepper.stepAsync(steps, direction, function (data) {
            callback(data);
        });

    } else {
        var res = function () {
            this.steps = -1;
            this.lastDirection = -1;
        };
        var data = new res();
        callback(data);
    }
}

function engageBrakes() {
    brakesEngaged = true;
}
function disengageBrakes() {
    brakesEnaged = false;
}


function clearStallAsync(callback) {
    moveLoadHomeAsync(function (data) {
        callback(data);
    });
}

function moveLoadHomeAsync(callback) {
    moveloadAsync(config.fullTrackMoveInSteps, "backward", function (data) {
        callback(data);
    });
}

function runStepsAsync(steps, direction, callback) {
    $.ajax(config.moveUrl + "/move?steps=" + steps
            + "&speed=" + config.defaultSpeedInSteps
            + "&direction=" + direction)
            .done(function (data) {
                updateCurrentPosition(steps, direction);
                callback(data);
            })
            .fail(function (data) {
                console.log("SOMETHING WRONG HAPPEND!");
                callback(data);
            });
}

function moveLoadtoPositionAsync(position, callback) {
    if (isValidposition(position)) {
        var travelData = calculateTravelFomGivenPosition(position);
        moveloadAsync(travelData.travelLength, travelData.travelDirection, function (data) {
            callback(data);
        });
    } else {
        callback(-1);
    }
}

function runRestart() {
//mock restart.
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
function isValidMove(travelLength, direction) {

    console.log('isValidMove');
    return (direction !== undefined) &&
            (travelLength > 0) &&
            ((direction === 'forward' && (currentPosition < config.endOfTrack)) ||
                    (direction === 'backward' && (currentPosition > config.startOfTrack)));

}

function calculateTravelFomGivenPosition(position) {
    var direction = -1;
    var distance = -1;
    if (position >= config.endOfTrack) {
        position = config.endOfTrack;
    } else if (position <= config.startOfTrack) {
        position = config.startOfTrack;
    }
    if (position > currentPosition) {
        direction = 'forward';
    } else if (position < currentPosition) {
        direction = 'backward';
    }
    console.log('position =' + position);
    console.log('currentPosition =' + currentPosition);
    distance = Math.abs(position - currentPosition);
    console.log('distance =' + distance);
    console.log('//////////////////');
    return {travelLength: distance, travelDirection: direction};
}

function isValidposition(position) {

    return (position !== undefined) &&
            (isNumber(position));
}

function calculateActualSteps(distanceInMM, direction) {
    var val = distanceInMM;
    if (direction === 'backward') {
        if (distanceInMM > currentPosition) {
            val = distanceInMM - Math.abs(distanceInMM - currentPosition);
        }
    }
    if (direction === 'forward') {
        if (distanceInMM > config.endOfTrack) {
            val = distanceInMM - Math.abs(distanceInMM - config.endOfTrack);
        }
    }
    return val;
}

function convertDirectionFromLitterals(dir) {
    if (dir === 'forward') {
        return 1;
    } else if (dir === 'backward') {
        return 0;
    }
}
function convertMMtoSteps(travelLength) {
    var steps = travelLength * config.stepsFor1MM;
    return steps;
}
function convertStepstoMM(steps) {
    var travelLength = steps / config.stepsFor1MM;
    return travelLength;
}
