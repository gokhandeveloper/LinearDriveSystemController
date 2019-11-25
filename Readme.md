This is a linear drive system web controller.
It connects to any hardware which supports firmata protocol via johnny-five library.
![Image of Linear actuator controller](https://user-images.githubusercontent.com/10161605/69553378-13a42380-0fdb-11ea-8225-599cee14f61b.png)
-------
The slider represents the load(carriage) in real time.

It also has asynchronous tests which run on the hardware in real time.

It is mainly built to control the linear actuators like the one from Open Builds:

https://openbuildspartstore.com/v-slot-nema-23-linear-actuator-belt-driven/

## How to start
- Connect your hardware via USB or Ethernet(depending where Firmata protocol is listening)
- `npm install` 
- In the app directory run `node app.js` in the terminal
- Run async tests by going to `localhost:8083/testsAsync.html` on your web browser

## Hardware:

- Arduino Uno via USB (upload firmata sketch via Arduino IDE) or Arduino YUN via Ethernet or Wifi(use FirmataEth for this).
- Linear actuator(Stepper motor 4 wired model is recommended).
- Stepper motor controller with stall detection(This is recommended to stop the stepper motor if an unwanted object blocks the free movement of the mechanism for example human finger).
- Separate power supply for stepper motor controller.
- Home sensor switch for safety.
- Emergency switch to turn stepper motors off.


