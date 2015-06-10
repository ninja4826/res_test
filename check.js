var Cylon = require('cylon');
var colors = require('colors/safe');
var inputVals;
require('fs').readFile(process.argv[2], function(err, data) {
    if (err) throw err;
    inputVals = data.toString('utf8').split(',').map(function(val) {
        return parseFloat(val);
    });
    console.log(inputVals);
});
for (var i = 0; i < process.argv.slice(2).length; i++) {
    inputVals.push(parseFloat(process.argv[i + 2]));
}

var run_test = function(arduino) {
    var results = [];
    for (var i = 0; i <= 7; i++) {
        
        arduino['r'+i].digitalWrite(1);
        var raw = arduino.analog.analogRead();
        var Vout = (5.0 / 1023.0) * raw;
        var buffer = (5 / Vout) - 1;
        var R2 = 10.0 / buffer;
        console.log('#' + i + ': ' + R2);
        var pass = (((inputVals[i] / 10) + inputVals[i]) >= R2 && (inputVals[i] - (inputVals[i] / 10)) <= R2);
        if (pass) {
            console.log('PASS'.green);
            results.push(true);
        } else {
            console.log('FAIL'.red);
            results.push(false);
        }
        arduino['r'+i].digitalWrite(0);
    }
    
    for (var r in results) {
        var result = results[r];
        if (!(result)) {
            console.log('TEST FAILED'.red);
            break;
        }
    }
};

Cylon.robot({
    name: 'resistor_tester',
    connections: {
        arduino: { adaptor: 'firmata', port: '/dev/ttyACM0' },
        keyboard: { adaptor: 'keyboard' }
    },
    
    devices: {
        keyboard: { driver: 'keyboard', connection: 'keyboard' },
        
        analog: { driver: 'analogSensor', pin: 0, lowerLimit: 0, upperLimit: 1023, connection: 'arduino' },
        r1: { driver: 'direct-pin', pin: 2, connection: 'arduino' },
        r2: { driver: 'direct-pin', pin: 3, connection: 'arduino' },
        r3: { driver: 'direct-pin', pin: 4, connection: 'arduino' },
        r4: { driver: 'direct-pin', pin: 5, connection: 'arduino' },
        r5: { driver: 'direct-pin', pin: 6, connection: 'arduino' },
        r6: { driver: 'direct-pin', pin: 7, connection: 'arduino' },
        r7: { driver: 'direct-pin', pin: 8, connection: 'arduino' },
        r8: { driver: 'direct-pin', pin: 9, connection: 'arduino' },
    },
    work: function(my) {
        var arduino = my.arduino;
        console.log('Running...');
        console.log('Inputed Values:');
        console.log(inputVals);
        console.log('Press [SPACE] to start...');
        my.keyboard.on('space', function(key) {
            run_test(arduino);
        })
    }
}).start();