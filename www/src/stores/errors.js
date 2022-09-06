import { defineStore } from "pinia";

export const useErrorsStore = defineStore("errors", {
  state: () => ({ 
    gimpErrors: [{ type: 'FAKE', message: "ugh, im an error (fake)" }]
  }),
  getters: {
    
  },
  actions: {
    createGimpError(error) {
      this.gimpErrors.push(error);
    },
    clearGimpErrors() {
      this.gimpErrors = [];
    }
  }
});