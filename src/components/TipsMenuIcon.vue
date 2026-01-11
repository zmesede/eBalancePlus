<script setup lang="ts">
import BaseMenuIcon from './BaseMenuIcon.vue'
</script>

<script lang="ts">
export default {
  name: 'TipsMenuIcon',
  components: { BaseMenuIcon },
  data() {
    return {
      gameParametersStore: useGameParametersStore(),
    }
  },
  methods: {
    handleClick() {
      this.gameParametersStore.showTipsOverlay()
    },
  },
}
</script>

<template>
  <BaseMenuIcon
      menu-icon-id="tips-menu-icon"
      class-name="tips"
      icon-string="mdi:help-circle-outline"
      :has-amount="false"
      :is-displayed="true"
      @click="handleClick"
  />
</template>
