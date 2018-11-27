const five = require('johnny-five');
const board = new five.Board();
const port = 8001;
const io = require('socket.io')();
const dateformat = require('dateformat');
const {composeEmail} = require('./emailService');
const axios = require('../axios-instance');
io.listen(port);


// http://johnny-five.io/examples/temperature-tmp36/

// for Breadboard for "Thermometer - TMP36"

const temperatureRange = {min: 2, max: 8};

let obj = {};

const getArduinoData = async () => {

    board.on("connect", function(event) {
        console.log("Arduino Connected!");
    });

    board.on("ready", async function() {
        const temperature = new five.Thermometer({
            controller: "TMP36",
            pin: "A0",
            freq: 2000
        });

        await temperature.on("data", async function () {
            await console.log(temperature.celsius + "°C", temperature.fahrenheit + "°F");
            const dateRecorded = dateformat(new Date(), "h:MM:ss TT");
            obj = {success: true, message: "temp data is here!", data: this.celsius, 'dateRecorded': dateRecorded};
            io.on('connection', (client) => {
                client.on('connectToArduinoData', () => {
                    console.log('Client has requested use cases data');
                    client.emit('arduinoData', (obj));
                });
            });
            await axios.post('/temp.json', obj)
                .then(response => {
                    console.log(`Sensor data successfully sent to Firebase at ${dateRecorded}`);
                })
                .catch(error => {
                    console.log('An error occurred');
                });
            if (this.celsius < temperatureRange.min || this.celsius > temperatureRange.max) {
                await composeEmail("Warning Email", `<p>Fridge has reached a critical level ${this.celsius}</p>`)
            }
        });
    });

    board.on("fail", async function(event) {
            await console.log("Fail message: %s", event.message);
            obj = {success: false, message: event.message, data: null};
            io.on('connection', (client) => {
                client.on('connectToArduinoData', () => {
                    console.log('Client has requested use cases data');
                    client.emit('arduinoData', (obj));
                });
        });
    });
};



module.exports = {
    getArduinoData
};
