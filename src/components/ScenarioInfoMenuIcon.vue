<script setup lang="ts">
import BaseMenuIcon from './BaseMenuIcon.vue'
import { useGameParametersStore } from '../stores/GameParametersStore'
</script>

<script lang="ts">
export default {
  name: 'ScenarioInfoMenuIcon',
  components: { BaseMenuIcon },
  data() {
    return {
      gameParametersStore: useGameParametersStore(),
    }
  },
  methods: {
    handleClick() {
      this.gameParametersStore.showScenarioInfoOverlay()
    },
  },
}
</script>

<template>
  <BaseMenuIcon
      menu-icon-id="scenario-info-menu-icon"
      class-name="scenario-info"
      icon-string="mdi:information-outline"
      :has-amount="false"
      :is-displayed="true"
      @click="handleClick"
  />
</template>
