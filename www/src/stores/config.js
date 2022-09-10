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
