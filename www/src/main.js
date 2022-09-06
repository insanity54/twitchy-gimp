import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";


const app = createApp(App);

app.use(createPinia());
app.use(router);

window.Neutralino?.init();
app.config.globalProperties.Neutralino = window.Neutralino;

app.mount("#app");




function onTrayMenuItemClicked(event) {
    switch(event.detail.id) {
        case "VERSION":
            Neutralino.os.showMessageBox("Version information",
                `Neutralinojs server: v${window.NL_VERSION} | Neutralinojs client: v${window.NL_CVERSION}`);
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



function setTray() {
    if(window.NL_MODE != "window") {
        // console.log("INFO: Tray menu is only available in the window mode.");
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


function onWindowClose() {
    Neutralino.app.exit();
}

if(window.NL_OS != "Darwin") { // TODO: Fix https://github.com/neutralinojs/neutralinojs/issues/615
    setTray();
}

window.Neutralino.events.on("trayMenuItemClicked", onTrayMenuItemClicked);
window.Neutralino.events.on("windowClose", onWindowClose);
