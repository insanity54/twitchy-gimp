import { createApp } from "vue";
import { createPinia } from "pinia";
import neu from "./neu.js";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";


const pinia = createPinia();

(async () => {
    await neu(pinia);
    const app = createApp(App);
    app.use(pinia);
    app.use(router);
    app.mount("#app");
})();
