<script setup>
  import { useConfigStore } from "@/stores/config";
  const store = useConfigStore();
  
</script>

<template>
  <main>
    <h2>Status</h2>
    <div class="gimp-status">
      <p>GIMP: <span :class="{ 
          'good': store.isGimpConfigured, 
          'bad' : !store.isGimpConfigured
      }">{{(store.isGimpConfigured) ? "" : "un" }}configured.</span>(@todo connected/disconnected)</p> <!--{{(store.isGimpConnected) ? "" : "dis" }}connected. -->
    </div>
    <div class="gimp-errors">
      <li v-for="error in gimpErrors">
        {{ error.type }}: {{ error.message }}
      </li>
      <!-- dispatchToClient(wsClient, 'gimpError', {
          type: 'ERRNOIMAGE',
          message: 'twitchy-gimp is connected to Gimp, but Gimp does not have any open images.'
      }); -->
    </div>
    <p>Twitch: <span :class="{ 
        'good': store.isTwitchConfigured, 
        'bad' : !store.isTwitchConfigured
    }">{{(store.isTwitchConfigured) ? "" : "un" }}configured.</span>(@todo connected/disconnected)</p>

  </main>
</template>


<style>
  .good {
    color: green;
  }
  .bad {
    color: red;
  }
</style>