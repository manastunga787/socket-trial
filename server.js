import chalk from "chalk";
import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3000 });

function emitToAll(ws, data) {

    wss.clients.forEach((client) => {

        if (client !== ws) {
            client.send(JSON.stringify(data));
        }

    });
}

function heartbeat() {
    this.isAlive = true;
}


wss.on("connection", (ws) => {
    console.log("client connected from IP %s", ws._socket.remoteAddress);
    ws.isAlive = true;
    ws.on('pong', heartbeat);
    ws.on("message", (msg) => {
        const data = JSON.parse(msg);

        console.log(`${chalk.green(data.user)}: ${chalk.white(data.msg)}`);
        emitToAll(ws, data);

    });
});


const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate();

        ws.isAlive = false;
        ws.ping();
    });
}, 30000);

wss.on('close', function close() {
    clearInterval(interval);
});

wss.on("error", () => {
    wss.clients.forEach((ws) => {
        ws.close();
    });
});





