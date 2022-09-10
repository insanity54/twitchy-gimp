<script setup>
  const props = defineProps({
    store: Object,
  });
</script>

<template>
  <h3>GIMP Config</h3>
  <p>Please ensure that your Script-Fu Server has been started. twitchy-gimp will automatically connect.</p>
  <label for="port">Script-Fu Port</label>
  <input id="port" :value=props.store.gimpPort type="text" /><br />
  <img class="fiddy" src="@/assets/start-server-screenshot-cropped.png" />
  <img class="fiddy" src="@/assets/scriptfu-server.png" />
</template>


<style>
  .fiddy {
    height: 280px;
  }
</style>