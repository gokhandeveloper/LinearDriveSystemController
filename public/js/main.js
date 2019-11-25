var newPosition = 0;
$(document).ready(function () {
    console.log("ready!");
    initSlider('machine1', '#machine1Yaxis');
    
});

function initSlider(machine, slider) {
    getConfigParams(machine, function (data) {
        config = new Config(data);
        $(slider).slider({
            max: config.endOfTrack,
            min: config.startOfTrack,
            step: 1,
            value: 0,
            animate: true,
            orientation: config.orientation,
            slide: function (event, ui) {
                $(slider + "NewPosition").text("New Position : " + ui.value);
                newPosition = ui.value;
            }
        });
        
        $(slider + 'START').on("click", function () {
            $(slider + 'START').prop('disabled', true);
            moveLoadtoPositionAsync(newPosition, function (data) {
                var directionLiterals = data.lastDirection === 1 ? "UP" : "DOWN";
                $(slider + "LastDirection").text("Last Direction : " + directionLiterals);
                $(slider + "StepsMade").text("Steps Made: " + data.steps);
                $(slider + "ActualPosition").text("Position : " + currentPosition);
                $(slider + 'START').prop('disabled', false);

            });
            console.log("START COMMAND");
        });
        $(slider + 'STOP').on("click", function () {
            //needs  proper implemntation (TSS)
            //stopMove( function (data){
            //});
            $(slider + 'START').prop('disabled', false);
            console.log("STOP COMMAND");
        });
        
         $(slider + 'GOHOME').on("click", function () {
            console.log("Load is now going home");
            $(slider + 'START').prop('disabled', true);
            $(slider + 'GOHOME').prop('disabled', true);
            moveLoadHomeAsync(function (data) { 
             $(slider + 'START').prop('disabled', false);
            $(slider + 'GOHOME').prop('disabled', false);  
             console.log("Load is now home");
              var directionLiterals = data.lastDirection === 1 ? "UP" : "DOWN";
                $(slider + "LastDirection").text("Last Direction : " + directionLiterals);
                $(slider + "StepsMade").text("Steps Made: " + data.steps);
                $(slider + "ActualPosition").text("Position : " + currentPosition);
                $(slider + "NewPosition").text("New Position : " + 0);
             $(slider + 'GOHOME').slider('value',0);
            });     
        });
    });
}
