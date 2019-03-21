const WebSocket = require('ws');

// Ws URL
const WS_URL = 'wss://stream.binance.com:9443/ws/bnbbtc@depth';

function init() {
    // Init websocket
    var ws = new WebSocket(WS_URL);

    ws.on('open', () => {
        console.log('open');
    });

    ws.on('message', (data) => {
        let text = data;

        let msg = JSON.parse(text);

        if (msg.ping) {
            ws.send(JSON.stringify({
                pong: msg.ping
            }));
        } else {
            console.log(text);
        }
    });

    ws.on('close', () => {
        console.log('close');
        init();
    });

    ws.on('error', err => {
        console.log('error', err);
        init();
    });
}

// Start websocket connection
init();