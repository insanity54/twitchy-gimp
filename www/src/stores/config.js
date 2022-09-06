// import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useConfigStore = defineStore("config", {
  state: () => ({ 
    twitchChannel: "cj_clippy", 
    twitchPassword: "taco",
    gimpPort: 10008
  }),
  getters: {
    isTwitchConfigured: (state) => (state.twitchPassword !== '' && state.twitchPassword !== ''),
    isGimpConfigured: (state) => (typeof state.gimpPort === 'number')
  },
  actions: {
    setTwitchChannel(channel) {
      this.twitchChannel = channel;
    },
    setTwitchPassword(password) {
      this.twitchPassword = password;
    },
    setGimpPort(port) {
      this.gimpPort = port;
    }
  }
});

//   const twitchChannel = ref("");
//   const twitchPassword = ref("");
  
//   function setTwitchChannel (channel) {
//     twitchChannel.value = channel;
//   }
//   function setTwitchPassword (password) {
//     twitchPassword.value = password;
//   }
//   return { 
//     twitchChannel, 
//     twitchPassword 
//   };
// });



// export const useCounterStore = defineStore('counter', {
//   state: () => ({ count: 0, name: 'Eduardo' }),
//   getters: {
//     doubleCount: (state) => state.count * 2,
//   },
//   actions: {
//     increment() {
//       this.count++
//     },
//   },
// })
