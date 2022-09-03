// This is just a sample app. You can structure your Neutralinojs app code as you wish.
// This example app is written with vanilla JavaScript and HTML.
// Feel free to use any frontend framework you like :)
// See more details: https://neutralino.js.org/docs/how-to/use-a-frontend-library


function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function showInfo() {
    document.getElementById('info').innerHTML = `
        ${NL_APPID} is running on port ${NL_PORT}  inside ${NL_OS}
        <br/><br/>
        <span>server: v${NL_VERSION} . client: v${NL_CVERSION}</span>
        `;
}

function openGettc() {
    Neutralino.os.open("https://gettc.xyz/password");
}

function openDocs() {
    Neutralino.os.open("https://neutralino.js.org/docs");
}

function openTutorial() {
    Neutralino.os.open("https://www.youtube.com/watch?v=txDlNNsgSh8&list=PLvTbqpiPhQRb2xNQlwMs0uVV0IN8N-pKj");
}


async function uiChange (event) {
    // @todo debounce this???
    const channel = document.getElementById('channel').value;
    const password = document.getElementById('password').value;
    const state = { channel, password };
    console.log(channel)
    await Neutralino.extensions.dispatch('js.neutralino.backend', 'uiChange', { state });
}


async function twitchConnect() {
    const channel = document.getElementById('channel').value;
    const password = document.getElementById('password').value;
    const state = { channel, password };

    try {
        await Neutralino.extensions.dispatch('js.neutralino.backend', 'twitchConnect', { channel: channel, password: password });
    } catch (e) {
        console.log(`  [*] excuse me, sir, there was an error, as follows.`)
        console.error(e)
    }
}

async function gimpText() {
    await Neutralino.extensions.dispatch('js.neutralino.backend', 'gimpText', {
        text: 'this is some test text that was generated on the client side.'
    })
}

async function gimpTest() {

    await Neutralino.extensions.dispatch('js.neutralino.backend', 'gimpTest', { 
        red: randomIntFromInterval(0, 255), 
        green: randomIntFromInterval(0, 255),
        blue: randomIntFromInterval(0, 255),
    });
    
}

function setTray() {
    if(NL_MODE != "window") {
        console.log("INFO: Tray menu is only available in the window mode.");
        return;
    }
    let tray = {
        icon: "/resources/icons/twitchyGimpTrayIcon.png",
        menuItems: [
            {id: "SHOW", text: "Display User Interface"},
            {id: "TESTGIMP", text: "Test GIMP Connection (set random fg color)"},
            {id: "VERSION", text: "Display version"},
            {id: "SEP", text: "-"},
            {id: "QUIT", text: "Quit"}
        ]
    };
    Neutralino.os.setTray(tray);
}

function onTrayMenuItemClicked(event) {
    switch(event.detail.id) {
        case "VERSION":
            Neutralino.os.showMessageBox("Version information",
                `Neutralinojs server: v${NL_VERSION} | Neutralinojs client: v${NL_CVERSION}`);
            break;
        case "SHOW":
            Neutralino.window.show();
            Neutralino.window.focus();
            break;
        case "TESTGIMP":
            gimpTest();
            break;
        case "QUIT":
            Neutralino.app.exit();
            break;
    }
}


function onWindowClose() {
    Neutralino.app.exit();
}

function stateUpdate(state) {
    console.log(`  stateUpdate:${JSON.stringify(state)}`)
    console.log(state);
    const channel = document.getElementById('channel').value;
    const password = document.getElementById('password').value;
    channel.value = state.channel;
    password.value = state.password;
}

Neutralino.init();

Neutralino.events.on("trayMenuItemClicked", onTrayMenuItemClicked);
Neutralino.events.on("windowClose", onWindowClose);
Neutralino.events.on("stateUpdate", (evt) => {
    console.log(`INFO: stateUpdate event received with evt: ${JSON.stringify(evt.detail)}.`);
    const channel = evt.detail?.channel;
    const password = evt.detail?.password;
    document.getElementById('channel').value = evt.detail?.channel;
    document.getElementById('password').value = evt.detail?.password;
});

Neutralino.events.on("eventFromExtension", (evt) => {
    console.log(`INFO: Test extension said: ${evt.detail}`);
});

if(NL_OS != "Darwin") { // TODO: Fix https://github.com/neutralinojs/neutralinojs/issues/615
    setTray();
}

// showInfo();
