<script setup>
  const props = defineProps({
    store: Object,
  });

  function openGettc () {
    window.Neutralino.os.open("https://gettc.xyz/password");
  }
</script>

<template>
  <h3>Twitch</h3>
  <p>channel:{{props.store.twitchChannel}} password:{{props.store.twitchPassword}}</p>
  <form>
    <label for="channel">Twitch Channel Name</label><br />
    <input id="channel" type="text" :value=props.store.twitchChannel /><br />
    <label for="password">Twitch OAuth Password</label> <span>(Get it from <a @click="openGettc" href="#">gettc.xyz/password</a>)</span><br />
    <input id="password" type="password" :value=props.store.twitchPassword /><br /><br />
    <button onclick="">Connect to Twitch chat</button>
  </form>
</template>
