let PropertiesReader = require('properties-reader');
let properties = PropertiesReader('./params.ini');
let five = require("johnny-five");
let board = new five.Board();

let stepper;
board.on("ready", function () {
    stepper = new five.Stepper({
        type:  eval(properties.get('board.stepper.type')),
        stepsPerRev: eval(properties.get('board.stepper.stepsPerRev')),
        pins: getPinsFromProps(properties.get('board.stepper.pins'))
    });


   var driveEnabler = new five.Switch(8);
//   driveEnabler.on("open", function() {
//    move(0,0,0,function(){
//      console.log("Motor drive is enabled and faults are cleared");
//   });
// });

  var homeSwitch = new five.Switch(13);

  homeSwitch.on("open", function() {
    move(0,0,0,function(){
      console.log("Load is now home");
   });
  });

  homeSwitch.on("close", function() {
    //not home
  });

});

function move(steps, speed, direction, callback) {
 console.log('->Executing move...');
    stepper.speed(speed).direction(direction).step(steps, function () {
        var data = {steps: parseInt(steps),
            lastDirection: parseInt(direction)};
        callback(data);
        return ;
    });
}



module.exports = function () {
    this.moveStepper = function (steps, speed, direction, callback) {
        move(steps, speed, direction, function (data) {
            callback(data);
        });
    };

};

function getPinsFromProps(propsPins){

    return eval("new Array("+propsPins+")");

}
