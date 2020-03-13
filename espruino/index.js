var wifi = require('Wifi');

const ssid = 'your_ssid';
const password = 'your_wifi_password';

const LED1 = 5;

const ledModesMap = {
    on: 0,
    off: 1
};

function blink(onOffScript) {
    const startTimeStamp = new Date();
    const start = startTimeStamp.getTime();
    let execIndex = 0;
    const the1stObjKey = Object.keys(onOffScript[0])[0];
    let ledMode = ledModesMap[the1stObjKey];
    digitalWrite(LED1, ledMode);
    let nextStepMsec = start + onOffScript[0][the1stObjKey];

    const interval = setInterval(() => {
        const currIterationTimeStamp = new Date();
        const currIterationTimeMsec = currIterationTimeStamp.getTime();
        if (currIterationTimeMsec >= nextStepMsec) {
            if (execIndex >= onOffScript.length - 1) {
                digitalWrite(LED1, ledModesMap.off);
                return clearInterval(interval);
            }
            execIndex += 1;
            const currentKey = Object.keys(onOffScript[execIndex])[0];
            ledMode = ledModesMap[currentKey];
            digitalWrite(LED1, ledMode);
            nextStepMsec += onOffScript[execIndex][currentKey];
        }
    }, 1);
}

function indicateConnected() {
    digitalWrite(LED1, 0);
    setTimeout(() => {
        digitalWrite(LED1, 1);
    }, 1000);
    setTimeout(() => {
        digitalWrite(LED1, 0);
    }, 2000);
    setTimeout(() => {
        digitalWrite(LED1, 1);
    }, 3000);
    setTimeout(() => {
        digitalWrite(LED1, 0);
    }, 4000);
}

function serverHandler(req, res) {
    let data = '';
    if (req.method === 'POST') {
        req.on('data', (chunk) => {
            if (chunk) {
                data += chunk;
            }
            if (data.length >= Number(req.headers['Content-Length'])) {
                data = JSON.parse(data);
                blink(data.morseScript);
                res.writeHead(200);
                res.end(JSON.stringify('Sequence processed Ok'));
            } else if (data.length > Number(req.headers['Content-Length'])) {
                res.writeHead(418);
                res.end(JSON.stringify('Data was corrupted'));
            }
        });
    } else {
        const command = req.url.replace('/', '');
        if (command === 'on') {
            digitalWrite(LED1, 1);
        } else if (command === 'off') {
            digitalWrite(LED1, 0);
        }
        res.writeHead(200);
        res.end(JSON.stringify('Request processed Ok'));
    }
}


function onInit() {
    wifi.connect(ssid, { password: password }, () => {
        console.log(wifi.getIP());
        indicateConnected();
        const http = require('http');
        http.createServer(serverHandler).listen(80);
    });
}

onInit();
save();