<script setup lang="ts">
import {computed} from 'vue'
import {useI18n} from 'vue-i18n'
import {useScenarioStore} from '../stores/ScenarioStore'
import {useGameParametersStore} from '../stores/GameParametersStore'

const {locale} = useI18n()
const scenarioStore = useScenarioStore()
const gameParametersStore = useGameParametersStore()

function getLocalizedText(entries: any[], fallback = '—') {
  if (!Array.isArray(entries)) return fallback
  const lang = locale.value.slice(0, 2)
  return (
      entries.find(e => e.lang === lang)?.text ||
      entries.find(e => e.lang === 'fr')?.text ||
      entries[0]?.text ||
      fallback
  )
}

const scenarioName = computed(() => {
  const s: any = scenarioStore.clickedScenario
  if (!s || s.id === '0') return locale.value.startsWith('fr') ? 'Aucun scénario sélectionné' : 'No scenario selected'
  return getLocalizedText(s.names)
})

const scenarioDescription = computed(() => {
  const s: any = scenarioStore.clickedScenario
  if (!s || s.id === '0') return locale.value.startsWith('fr') ? 'Aucun scénario sélectionné' : 'No scenario selected'
  return getLocalizedText(s.descriptions)
})

const productionCurveName = computed(() => {
  const c: any = gameParametersStore.getProductionCurve
  if (!c) return locale.value.startsWith('fr') ? 'Non définie' : 'Not defined'
  return getLocalizedText(c.names)
})

function close() {
  gameParametersStore.showScenarioInfoOverlay()
}
</script>

<template>
  <Teleport to="body">
    <div class="scenario-modal-backdrop" @click="close"></div>
    <div class="scenario-modal popup-window">
      <div class="card" @click.stop>
        <div class="color-banner" style="background-color: #00737D;"/>
        <div class="text">
          <h1 class="title">{{ locale.startsWith('fr') ? 'Infos de la partie' : 'Game info' }}</h1>
          <h1 class="title">{{ locale.startsWith('fr') ? 'Scénario' : 'Scenario' }}</h1>
          <h3 class="text">{{ scenarioName }} : {{ scenarioDescription }}</h3>
          <h1 class="title">{{ locale.startsWith('fr') ? 'Courbe de production' : 'Production curve' }}</h1>
          <h3 class="text">{{ productionCurveName }}</h3>
        </div>
        <div class="btn-container">
          <button class="btn-close" type="button" @click="close">
            {{ locale.startsWith('fr') ? 'Fermer' : 'Close' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
@import '../styles/components/ScenarioInfoWindow.scss';
</style>
