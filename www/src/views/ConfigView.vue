<script setup>
import { RouterView } from "vue-router";
import { useConfigStore } from "@/stores/config";
const store = useConfigStore();


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


</script>

<template>
  <main>
    <h2>Configuration</h2>
    <RouterView :store=store />
  </main>
</template>
