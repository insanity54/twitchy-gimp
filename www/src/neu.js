
import { useErrorsStore } from "@/stores/errors";
import { useConfigStore } from "@/stores/config";
import { useStatusStore } from "@/stores/status";


const neu = async (pinia) => {
	const errorsStore = useErrorsStore(pinia);
	const configStore = useConfigStore(pinia);
	const statusStore = useStatusStore(pinia);

	window.Neutralino?.init();
	console.log('Neu has initted')


	function randomIntFromInterval(min, max) { // min and max included 
	  return Math.floor(Math.random() * (max - min + 1) + min)
	}

	async function gimpTest() {
	    await Neutralino.extensions.dispatch('net.grimtech.twitchygimpbackend', 'gimpTest', { 
	        red: randomIntFromInterval(0, 255), 
	        green: randomIntFromInterval(0, 255),
	        blue: randomIntFromInterval(0, 255),
	    });
	}


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


	if (!window.Neutralino?.events) {
		console.error('Neutralino events is missing so lets abort')
		return;
	}

	window.Neutralino.events.on("trayMenuItemClicked", onTrayMenuItemClicked);
	window.Neutralino.events.on("windowClose", onWindowClose);


	window.Neutralino.events.on("stateUpdate", (evt) => {
		console.log(`INFO: stateUpdate event received with evt: ${JSON.stringify(evt.detail)}.`);
		const channel = evt?.detail?.channel;
		const password = evt?.detail?.password;
		configStore.setTwitchChannel(channel);
		configStore.setTwitchPassword(password);
	});


	window.Neutralino.events.on("gimpError", (evt) => {
		errorsStore.createGimpError(evt?.detail);
		statusStore.setGimpConnection(false);
	});
	window.Neutralino.events.on('gimpConnection', (evt) => {
		// successful Gimp connection, so we clear the errors
		errorsStore.clearGimpErrors();
		// also mark the status as connected
		statusStore.setGimpConnection(true);
	})

	return new Promise((resolve) => {
		window.Neutralino.events.on("ready", () => {
			console.log('Neutralino ready');
			resolve();
		});
	});



};

export default neu;