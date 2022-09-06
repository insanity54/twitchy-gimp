<script setup>
import { RouterView } from "vue-router";
import { useConfigStore } from "@/stores/config";
const store = useConfigStore();


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

Neutralino.events.on("stateUpdate", (evt) => {
    console.log(`INFO: stateUpdate event received with evt: ${JSON.stringify(evt.detail)}.`);
    const channel = evt?.detail?.channel;
    const password = evt?.detail?.password;
    store.setTwitchChannel(channel);
    store.setTwitchPassword(password);
});

</script>

<template>
  <main>
    <h2>Configuration</h2>
    <RouterView :store=store :Neutralino=Neutralino />
  </main>
</template>
