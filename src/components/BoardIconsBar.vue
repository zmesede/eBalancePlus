<script setup lang="ts">

import ResultsMenuIcon from './ResultsMenuIcon.vue'
import ScenarioInfoWindow from './ScenarioInfoWindow.vue'
import ScenarioInfoMenuIcon from './ScenarioInfoMenuIcon.vue'
import TipsMenuIcon from './TipsMenuIcon.vue'
import TipsInfoWindow from './TipsInfoWindow.vue'
import { useGameParametersStore } from '../stores/GameParametersStore'

const gameParametersStore = useGameParametersStore()
</script>

<template>
  <section id="game-board-snackbar">
    <!-- <MoneyMenuIcon />
     <MultiplayerMenuIcon />
     <MarketMenu />
     <MarketMenuIcon />
     <EnergyMenu />
     <EnergyMenuIcon />
     <SettingsMenuIcon />-->
    <TipsMenuIcon />
    <ScenarioInfoMenuIcon/>
    <ResultsMenuIcon/>
    <ScenarioInfoWindow v-if="gameParametersStore.showedScenarioInfoOverlay" />
    <TipsInfoWindow v-if="gameParametersStore.showedTipsOverlay" />
  </section>
</template>

<style lang="scss">
@use '../styles/components/gameBoardSnackBar.scss'as *;
</style>
