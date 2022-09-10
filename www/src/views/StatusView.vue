<script setup>
  import { useErrorsStore } from "@/stores/errors";
  import { useConfigStore } from "@/stores/config";
  import { useStatusStore } from '@/stores/status';
  import { format, parseISO } from 'date-fns';
  const errorsStore = useErrorsStore();
  const configStore = useConfigStore();
  const statusStore = useStatusStore();


</script>

<template>
  <main>
    <h2>Status</h2>
    <div class="gimp-status">
      <p>GIMP: <span :class="{ 
          'good': configStore.isGimpConfigured, 
          'bad' : !configStore.isGimpConfigured
      }">{{(configStore.isGimpConfigured) ? "" : "un" }}configured</span>, 
      <span :class="{
        'good': statusStore.isGimpConnected,
        'bad': !statusStore.isGimpConnected
      }">{{(statusStore.isGimpConnected) ? "" : "dis" }}connected</span>.
      </p>
    </div>
    <div class="gimp-errors">
      
      <p v-if="errorsStore.gimpError !== ''">[{{ format(parseISO(errorsStore.gimpError.date), 'kk:mm:ss') }}] {{ errorsStore.gimpError.type }}: {{ errorsStore.gimpError.message }}</p>
      <!-- dispatchToClient(wsClient, 'gimpError', {
          type: 'ERRNOIMAGE',
          message: 'twitchy-gimp is connected to Gimp, but Gimp does not have any open images.'
      }); -->
    </div>
    <br />
    <p>Twitch: <span :class="{ 
        'good': configStore.isTwitchConfigured, 
        'bad' : !configStore.isTwitchConfigured
    }">{{(configStore.isTwitchConfigured) ? "" : "un" }}configured.</span>(@todo connected/disconnected)</p>

  </main>
</template>


<style>
  .gimp-errors {
    height: 100px;
  }
  .good {
    color: green;
  }
  .bad {
    color: red;
  }
</style>