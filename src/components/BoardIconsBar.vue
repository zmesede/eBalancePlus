<script setup lang="ts">

import ResultsMenuIcon from './ResultsMenuIcon.vue'
import ScenarioInfoWindow from './ScenarioInfoWindow.vue'
import ScenarioInfoMenuIcon from './ScenarioInfoMenuIcon.vue'
import BugReportPopup from './BugReportPopup.vue'
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
    <ScenarioInfoMenuIcon/>
    <ResultsMenuIcon/>
    <ScenarioInfoWindow v-if="gameParametersStore.showedScenarioInfoOverlay" />
  </section>
</template>

<style lang="scss">
@import '../styles/components/gameBoardSnackBar.scss';
</style>
