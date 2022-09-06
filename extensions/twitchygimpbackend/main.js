import minimist from 'minimist' 
import websocket from 'websocket'
import { v4 } from 'uuid';
import chalk from 'chalk';
import tmi from 'tmi.js';
import path from 'path';
import globalCacheDir from 'global-cache-dir';
import Database from 'better-sqlite3';
import Gimp from '/home/chris/Documents/node-gimp/Gimp.js';
import Color from 'color';

const WS = websocket.w3cwebsocket;
const argv = minimist(process.argv.slice(2));
const uuidv4 = v4;

// Obtain required params to start a WS connection from CLI args.
const NL_PORT = argv['nl-port'];
const NL_TOKEN = argv['nl-token'];
const NL_EXTID = argv['nl-extension-id'];

console.log(`  [>] NL_PORT:${NL_PORT}, NL_TOKEN:${NL_TOKEN}, NL_EXTID:${NL_EXTID}`);


let db;


// greets https://stackoverflow.com/a/10134261/1004931
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function dispatchToClient(client, eventName, data) {
    client.send(JSON.stringify({
        id: uuidv4(),
        method: 'app.broadcast',
        accessToken: NL_TOKEN,
        data: {
            event: eventName,
            data: data
        }
    }));
}


function createWebSocketConnection () {
    let client = new WS(`ws://localhost:${NL_PORT}?extensionId=${NL_EXTID}`);
    return client;
}




async function createGimpText (gimp, t) {
    const text = (t.length > 50) ? t.substring(0, 50) : t;
    console.log(`  [>] createGimpText ${text}`);
    const iRes = await gimp.gimpImageList();
    console.log(iRes);
    const image = iRes.jse[2][iRes.jse[2].length-1];
    const hRes = await gimp.gimpImageHeight(image);
    const height = hRes.jse[0];
    const wRes = await gimp.gimpImageWidth(image);
    const width = wRes.jse[0];
    const tRes = await gimp.gimpTextFontname(image, -1, getRandomInt(0, width), getRandomInt(0, height), text, 0, 0, 35, 0, 'Nimbus Sans');;
    const layer = wRes.jse[0];
}


function createLogger (wsClient) {
    return function log(message, type = 'INFO') {
        let logLine = `[${NL_EXTID}]: `;
        switch(type) {
            case 'INFO':
                logLine += chalk.green(type);
                logLine += ' ' + message;
                console.log(`  [>] ${logLine}`);
                dispatchToClient(wsClient, 'logInfo', message);
                break;
            case 'ERROR':
                logLine += chalk.red(type);
                logLine += ' ' + message;
                console.error(`  [>] ${logLine}`);
                dispatchToClient(wsClient, 'logError', message);
                break;
        }
    }
}


function connectToTwitch (username, password, channel) {    
    const twitchClient = new tmi.Client({
        options: { debug: true },
        identity: {
            username,
            password
        },
        channels: [ channel ]
    });
    twitchClient.connect().catch(console.error);
    return twitchClient;
}


function saveState (db, state) {
    Object.assign({}, { channel: '', password: '' }, state);

    //-- make sure it exists
    const insert = db.prepare(`INSERT OR IGNORE INTO state (channel, password) VALUES (:channel, :password)`);

    // -- make sure it has the right data
    const update = db.prepare(`UPDATE state SET channel = :channel, password = :password`);

    insert.run(state);
    update.run(state);
}

function loadState (db) {
    const state = db.prepare('SELECT * FROM state').get();
    return state;
}

async function gimpTest(gimp, data) {
    const { red, green, blue } = data;
    const gimpCommand = `(gimp-context-set-foreground '(${red} ${green} ${blue}))`;
    await gimp.sendCommand(gimpCommand);
}

async function main () {
    // set up cache directory
    const cacheDir = await globalCacheDir('twitchy-gimp');
    console.log(`  [>] Cache directory is as follows: ${cacheDir}`);

    // init db
    db = Database(path.join(cacheDir, 'twitchy-gimp.sql'));
    db.prepare(`CREATE TABLE IF NOT EXISTS state (id INTEGER PRIMARY KEY AUTOINCREMENT, channel TEXT, password TEXT)`).run();
    
    // connect to the frontend via websocket
    const wsClient = createWebSocketConnection();

    // create logger which depends on ws
    const log = createLogger(wsClient);


    const gimpConnectionHandler = (async () => {
        try {
            // connect to GIMP
            const gimp = new Gimp();
            await gimp.connect();
    
            const res = await gimp.gimpImageList();
            const { jse } = res;
            // const image = jse[1][jse[1].length-1];
            const imageCount = jse[0];

            if (imageCount < 1) {
                throw new Error('ERRNOIMAGE');
            }

        } catch (e) {
            if (/ECONNREFUSED/.test(e)) {
                dispatchToClient(wsClient, 'gimpError', {
                    type: 'ECONNREFUSED',
                    message: 'twitchy-gimp was not able to connect to Gimp. Is Gimp Script-Fu Server running?'
                });
            } else if (/ERRNOIMAGE/.test(e)) {
                dispatchToClient(wsClient, 'gimpError', {
                    type: 'ERRNOIMAGE',
                    message: 'twitchy-gimp is connected to Gimp, but Gimp does not have any open images.'
                });
            }

            console.error(`  [>] there was an unhandled error while attempting to connect to Gimp. ${e}`);
        }
        
    })();

    


    wsClient.onerror = function() {
        log('  [>] Connection error!', 'ERROR');
    };

    wsClient.onopen = function() {
        log('  [>] Connected. setting up socket connection');
    };

    wsClient.onclose = function() {
        log('  [>] Connection closed');
        // Make sure to exit the extension process when WS extension is closed (when Neutralino app exits)
        process.exit();
    };

    wsClient.onmessage = function(e) {
        if(typeof e.data === 'string') {
            let message = JSON.parse(e.data);

            // Use extensions.dispatch or extensions.broadcast from the app,
            // to send an event here
            switch(message.event) {
                case 'uiChange':
                    const st = message?.data?.state;
                    log(`  [>] uiChange evenet with st:${JSON.stringify(st)}`);
                    saveState(db, st);
                    break;
                case 'clientConnect':
                    log(`  [>] client connect! sending some shit...`)
                    const state = loadState(db);
                    if (!state) break;
                    console.log(`  [>] clientConnect has occured.`)
                    dispatchToClient(wsClient, 'stateUpdate', {
                        channel: state?.channel,
                        password: state?.password
                    });

                    


                    break;
                case 'eventToExtension':
                    log(`  [>] eventToExtension ${JSON.stringify(message.data)}`);
                    // Use Neutralinojs server's messaging protocol to trigger native API functions
                    // Use app.broadcast method to send an event to all app instances
                    client.send(JSON.stringify({
                        id: uuidv4(),
                        method: 'app.broadcast',
                        accessToken: NL_TOKEN,
                        data: {
                            event: 'eventFromExtension',
                            data: 'Hello app!'
                        }
                    }));
                    break;
                case 'twitchConnect':
                    log(`  [>] 'twitchConnect' event received.`);
                    const channel = message?.data?.channel;
                    const password = message?.data?.password;
                    const twitchClient = connectToTwitch(channel, password, 'filian'); // @todo switch back to my channel
                    twitchClient.on('message', (channel, tags, message, self) => {

                        /**
                         * tags: 
                         * {
                          'badge-info': null,
                          badges: { moderator: '1', partner: '1' },
                          color: '#7C7CE1',
                          'display-name': 'Nightbot',
                          emotes: null,
                          'first-msg': false,
                          flags: null,
                          id: '2639e444-6512-4dad-b503-fe5454cf5bf6',
                          mod: true,
                          'returning-chatter': false,
                          'room-id': '45098797',
                          subscriber: false,
                          'tmi-sent-ts': '1662249691532',
                          turbo: false,
                          'user-id': '19264788',
                          'user-type': 'mod',
                          'emotes-raw': null,
                          'badge-info-raw': null,
                          'badges-raw': 'moderator/1,partner/1',
                          username: 'nightbot',
                          'message-type': 'chat'
                        }
                        */

                        const c = Color(tags?.color);
                        const red = c.red();
                        const green = c.green();
                        const blue = c.blue();

                        if(self) return;
                        // if(message.toLowerCase() === 'hello') {
                        //     twitchClient.say(channel, `LUL`);
                        // }
                        createGimpText(gimp, `${tags['display-name']}: ${message}`, red, green, blue);
                    });
                    break;
                case 'gimpTest':

                    gimpTest(message?.data);
                    break;
                case 'gimpText':
                    createGimpText(gimp, message?.data?.text);
                    break;
                case 'test':
                    log(`  [>] TEST`);

                    try {
                        
                    } catch (e) {
                        console.error('  [>] Ayeoo there was an error!')
                        console.error(e)
                    }

                    break;
            }
        }
    };
}

main();
