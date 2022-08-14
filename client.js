import WebSocket from 'ws';
import chalk from 'chalk';
import readLine from "readline";
import util from "util";
import { stdout } from 'process';

const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});
const question = util.promisify(rl.question).bind(rl);



async function init() {
    // let ip = await question(`${chalk.yellow("Enter Server Ip")}`)
    let user = await question(`${chalk.red("Enter your name: ")}`);
    if (user) {
        //206.189.137.251
        let ws = new WebSocket('ws://206.189.137.251:3000');
        ws.on("open", () => {
            console.log(chalk.greenBright(`${user} ! Your are now connected to the server`));
            startChart(ws, user);
        });

        ws.on("message", (data) => {
            data = JSON.parse(data);
            console.log(`\n${chalk.red(data.user)}: ${chalk.yellow(data.msg)}`);
            stdout.write("Me: ");
        });

        ws.on("close", () => {
            console.log(`\n${chalk.red("Connection lost exiting....")}`);
            process.exit();
        })

        ws.on("error", (err) => {
            console.log(chalk.red("An error occured .........."));
            console.log(err);
        });
    }
}


init();

async function startChart(ws, user) {
    let msg = await question("Me: ");
    msg = msg.trim();
    if (msg !== "exit") {
        const data = JSON.stringify({ user, msg });
        if (msg.length > 1 && msg !== "\n") {
            ws.send(data);
        }
        startChart(ws, user);

    } else {
        rl.close();
        process.exit();
    }
}








