import { defineStore } from "pinia";

export const useErrorsStore = defineStore("errors", {
  state: () => ({ 
    gimpError: ""
  }),
  getters: {
    
  },
  actions: {
    createGimpError(error) {
      this.gimpError = error;
    },
    clearGimpErrors() {
      this.gimpError = "";
    }
  }
});