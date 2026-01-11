<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { convertI18nObjectToLocale } from '../helpers/translation'
import type { I18nObject } from '../types/I18nObject'
</script>

<script lang="ts">
export default {
  name: 'ScenarioInfoWindow',
  components: {
    Icon,
  },
  data() {
    return {
      scenarioStore: useScenarioStore(),
      gameParametersStore: useGameParametersStore(),
    }
  },
  computed: {
    language() {
      return this.gameParametersStore.language
    },

    scenario() {
      return this.scenarioStore.clickedScenario
    },

    productionCurve() {
      return this.gameParametersStore.getProductionCurve
    },

    titleGameInfo() {
      return this.language === 'fr'
          ? 'Infos de la partie'
          : 'Game info'
    },

    titleScenario() {
      return this.language === 'fr'
          ? 'Scénario'
          : 'Scenario'
    },

    titleProductionCurve() {
      return this.language === 'fr'
          ? 'Courbe de production'
          : 'Production curve'
    },

    closeLabel() {
      return this.language === 'fr'
          ? 'Fermer'
          : 'Close'
    },

    scenarioName() {
      if (!this.scenario || this.scenario.id === '0')
        return this.language === 'fr'
            ? 'Aucun scénario sélectionné'
            : 'No scenario selected'

      return this.convertI18nObject(this.scenario.names)
    },

    scenarioDescription() {
      if (!this.scenario || this.scenario.id === '0')
        return ''

      return this.convertI18nObject(this.scenario.descriptions)
    },

    productionCurveName() {
      if (!this.productionCurve)
        return this.language === 'fr'
            ? 'Non définie'
            : 'Not defined'

      return this.convertI18nObject(this.productionCurve.names)
    },
  },
  methods: {
    convertI18nObject(objList: I18nObject[]) {
      return convertI18nObjectToLocale(
          objList,
          this.gameParametersStore.language
      )
    },

    close() {
      this.gameParametersStore.showScenarioInfoOverlay()
    },
  },
}
</script>

<template>
  <Teleport to="body">
    <div class="scenario-modal-backdrop" @click="close"></div>
    <div class="scenario-modal popup-window">
      <div class="card" @click.stop>
        <div class="color-banner" style="background-color: #00737D;"/>
        <div class="text">
          <h1 class="title">{{ titleGameInfo }}</h1>
          <h1 class="title">{{ titleScenario }}</h1>
          <h3 class="text">
            <strong>{{ scenarioName }}</strong>
            <span v-if="scenarioDescription">
              : {{ scenarioDescription }}
            </span>
          </h3>
          <h1 class="title">{{ titleProductionCurve }}</h1>
          <h3 class="text">{{ productionCurveName }}</h3>
        </div>
        <div class="btn-container">
          <button class="btn-close" type="button" @click="close">
            <Icon icon="mdi:close" class="btn-icon" />
            <p>{{ closeLabel }}</p>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
@import '../styles/components/ScenarioInfoWindow.scss';
</style>
