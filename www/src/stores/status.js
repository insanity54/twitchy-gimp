import { defineStore } from "pinia";

export const useStatusStore = defineStore("status", {
  state: () => ({ 
    isGimpConnected: false,
    isTwitchConnected: false
  }),
  actions: {
    setGimpConnection(bool) {
      this.isGimpConnected = bool;
    },
    setTwitchConnection(bool) {
      this.isTwitchConnected = bool;
    }
  }
});