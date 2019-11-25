var expect = chai.expect;
var should = chai.should();
//this is used to up the timeout of mocha for teh asynchronous calls
mocha.timeout(120000);

describe("Moving the load consecutively in 15 moves and expecting position", function () {
    //restset currentPosition to conforme with the test suite settings.
    currentPosition = 0;
    it("1st move going 50mm-forward", function (done) {

        moveloadAsync(50, "forward", function (data) {
            console.log(data);
            expect(data.steps).to.equal(2650);
            expect(data.lastDirection).to.equal(1);
            expect(currentPosition).to.equal(50);
            done();
        });
    });
    it("2nd move going 50mm-forward", function (done) {
        moveloadAsync(50, "forward", function (data) {
            expect(data.steps).to.equal(2650);
            expect(data.lastDirection).to.equal(1);
            expect(currentPosition).to.equal(100);
            done();
        });

    });
    it("3rd move going 100mm-forward", function (done) {
        moveloadAsync(100, "forward", function (data) {
            expect(data.steps).to.equal(5300);
            expect(data.lastDirection).to.equal(1);
            expect(currentPosition).to.equal(200);
            done();
        });

    });
    it("4th move going 150m-backward", function (done) {

        moveloadAsync(150, "backward", function (data) {
            expect(data.steps).to.equal(7950);
            expect(data.lastDirection).to.equal(0);
            expect(currentPosition).to.equal(50);
            done();
        });

    });
    it("5th move going 100mm-backward", function (done) {
        moveloadAsync(100, "backward", function (data) {
            expect(data.steps).to.equal(2650);
            expect(data.lastDirection).to.equal(0);
            expect(currentPosition).to.equal(0);
            done();
        });

    });
    it("6th move going 1000mm-backward (Shouldn't move becuz the load is home )", function (done) {
        moveloadAsync(1000, "backward", function (data) {
            expect(data.steps).to.equal(-1);
            expect(data.lastDirection).to.equal(-1);
            expect(currentPosition).to.equal(0);
            done();
        });
    });
    it("7th move going 1000mm-forward ", function (done) {
        moveloadAsync(1000, "forward", function (data) {
            expect(data.steps).to.equal(53000);
            expect(data.lastDirection).to.equal(1);
            expect(currentPosition).to.equal(1000);
            done();
        });
    });
    it("8th move going 1200mm-backward (Should go home)", function (done) {
        moveloadAsync(1260, "backward", function (data) {
            expect(data.steps).to.equal(53000);
            expect(data.lastDirection).to.equal(0);
            expect(currentPosition).to.equal(0);
            done();
        });
    });
    it("9th move going 1200mm-forward (Should be at the end)", function (done) {
        moveloadAsync(1260, "forward", function (data) {
            expect(data.steps).to.equal(66780);
            expect(data.lastDirection).to.equal(1);
            expect(currentPosition).to.equal(1260);
            done();
        });
    });
    it("10th move going 2000mm-backward (Should go home)", function (done) {
        moveloadAsync(2000, "backward", function (data) {
            expect(data.steps).to.equal(66780);
            expect(data.lastDirection).to.equal(0);
            expect(currentPosition).to.equal(0);
            done();
        });
    });
    it("11th move going 200mm-forward (Should be at the end)", function (done) {
        moveloadAsync(2000, "forward", function (data) {
            expect(data.steps).to.equal(66780);
            expect(data.lastDirection).to.equal(1);
            expect(currentPosition).to.equal(1260);
            done();
        });
    });
    it("12th move going 600mm-backward (Should be at the middle)", function (done) {
        moveloadAsync(600, "backward", function (data) {
            expect(data.steps).to.equal(31800);
            expect(data.lastDirection).to.equal(0);
            expect(currentPosition).to.equal(660);
            done();
        });
    });
    it("13th move going 1260mm-backward (Should go home)", function (done) {
        moveloadAsync(1260, "backward", function (data) {
            expect(data.steps).to.equal(34980);
            expect(data.lastDirection).to.equal(0);
            expect(currentPosition).to.equal(0);
            done();
        });
    });
    it("14th move going 1200mm-backward (Shouldn't move)", function (done) {
        moveloadAsync(1260, "backward", function (data) {
            expect(data.steps).to.equal(-1);
            expect(data.lastDirection).to.equal(-1);
            expect(currentPosition).to.equal(0);
            done();
        });
    });
    it("15th move going 500000mm-forward (Should be at the end)", function (done) {
        moveloadAsync(500000, "forward", function (data) {
            expect(data.steps).to.equal(66780);
            expect(data.lastDirection).to.equal(1);
            expect(currentPosition).to.equal(1260);
            done();
        });
    });
});

describe("Stall detection scenario", function () {
    it("currentPosition = 150 a stall is detected", function (done) {
        currentPosition = 150;
        moveloadAsync(100, "forward", function (data) {
            expect(data.steps).to.equal(5300);
            expect(data.lastDirection).to.equal(1);
            expect(currentPosition).to.equal(250);
            stallDetected = true;
            clearStallAsync(function (data) {
                expect(data.steps).to.equal(13250);
                expect(data.lastDirection).to.equal(0);
                expect(currentPosition).to.equal(0);
            });
            done();
        });

    });

    it("Moving load 100mm-forward (Because it should be home)", function (done) {
        moveloadAsync(100, "forward", function (data) {
            expect(data.steps).to.equal(-1);
            expect(data.lastDirection).to.equal(-1);
            expect(currentPosition).to.equal(1260);
            done();
        });
    });
});

describe("Moving the load consecutively to a series of positions", function () {
    it("Move load to position 600 ", function (done) {
        currentPosition = 0;
        moveLoadtoPositionAsync(600, function (data) {
            expect(data.steps).to.equal(31800);
            expect(data.lastDirection).to.equal(1);
            expect(currentPosition).to.equal(600);
            done();
        });
    });
    it("Move load to position 800 ", function (done) {
        moveLoadtoPositionAsync(800, function (data) {
            expect(data.steps).to.equal(10600);
            expect(data.lastDirection).to.equal(1);
            expect(currentPosition).to.equal(800);
            done();
        });

    });
    it("Move load to position 200 ", function (done) {
        moveLoadtoPositionAsync(200, function (data) {
            expect(data.steps).to.equal(31800);
            expect(data.lastDirection).to.equal(0);
            expect(currentPosition).to.equal(200);
            done();
        });
    });
    it("Move load to position 0 ", function (done) {
        moveLoadtoPositionAsync(0, function (data) {
            expect(data.steps).to.equal(10600);
            expect(data.lastDirection).to.equal(0);
            expect(currentPosition).to.equal(0);
            done();
        });
    });
    it("Move load to position 1200 ", function (done) {
        moveLoadtoPositionAsync(1200, function (data) {
            expect(data.steps).to.equal(63600);
            expect(data.lastDirection).to.equal(1);
            expect(currentPosition).to.equal(1200);
            done();
        });
    });
    it("Move load to position 0(HOME) ", function (done) {
        moveLoadtoPositionAsync(0, function (data) {
            expect(data.steps).to.equal(63600);
            expect(data.lastDirection).to.equal(0);
            expect(currentPosition).to.equal(0);
            done();
        });
    });
    it("Move load to position 1100 ", function (done) {
          moveLoadtoPositionAsync(1100, function (data) {
            expect(data.steps).to.equal(58300);
            expect(data.lastDirection).to.equal(1);
            expect(currentPosition).to.equal(1100);
            done();
        });
    });
    it("Move load to position 500000 ", function (done) {
         moveLoadtoPositionAsync(500000, function (data) {
            expect(data.steps).to.equal(5300);
            expect(data.lastDirection).to.equal(1);
            expect(currentPosition).to.equal(1200);
            done();
        });
    });
   
    it("Move load to position 1100 ", function (done) {
         moveLoadtoPositionAsync(1100, function (data) {
            expect(data.steps).to.equal(5300);
            expect(data.lastDirection).to.equal(0);
            expect(currentPosition).to.equal(1100);
            done();
        });
    });
   
    it("Move load to position 2000 ", function (done) {
         moveLoadtoPositionAsync(2000, function (data) {
            expect(data.steps).to.equal(5300);
            expect(data.lastDirection).to.equal(1);
            expect(currentPosition).to.equal(1200);
            done();
        });
    });
    
});
