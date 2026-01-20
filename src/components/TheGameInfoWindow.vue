<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useGameParametersStore } from '../stores/GameParametersStore'

const gameParameterStore = useGameParametersStore()
</script>

<script lang="ts">

</script>

<template>
  <div class="popup-window ">
    <div class="card">
      <div class="color-banner" style="background-color: #00737D;" />
      <div class="text">
        <h1 class="title">
          {{ $t("rule.title") }}
        </h1>
        <p class="gameObject text">
          {{ $t("rule.gameObject") }}
        </p>
        <h1 class="play title">
          {{ $t("rule.howToPlay") }}
        </h1>
        <p class="add text">
          {{ $t("rule.AddConsumption") }}
        </p>
        <p class="notification text">
          {{ $t("rule.notification") }}
        </p>
        <h1 class="win title">
          {{ $t("rule.howToWin") }}
        </h1>
        <p class="win text">
          {{ $t("rule.winRule") }}
        </p>
      </div>
      <div class="btn-container">
        <button class="btn-close " @click="gameParameterStore.showInfoOverlay()">
          <Icon icon="mdi:close" class="btn-icon" />
          <p>{{ $t("button.close") }}</p>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
    @use '../styles/components/theGameInfoWindow.scss'as *;
</style>
