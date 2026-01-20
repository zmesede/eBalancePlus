<script setup lang="ts">
import { useGameParametersStore } from './stores/GameParametersStore'
import TheNavBar from './layout/TheNavBar.vue'
</script>

<template>
  <main class="application" :class="useGameParametersStore().theme">
    <TheNavBar />
    <RouterView />
  </main>
</template>

<style lang="scss">
  @use './styles/global.scss' as *;
</style>
