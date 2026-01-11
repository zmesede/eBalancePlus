<script setup lang="ts">
import BaseMenuIcon from './BaseMenuIcon.vue'
</script>

<script lang="ts">
export default {
  name: 'ResultsMenuIcon',
  components: {
    BaseMenuIcon,
  },
  data() {
    return {
      resultsStore: useResultsStore(),
      taskStore: useTaskStore(),
      scenarioStore: useScenarioStore(),
      showMissingTasksPopup: false,
    }
  },
  methods: {
    handleClick() {
      console.log('ALL COMPLETED ?', this.taskStore.areAllTasksCompleted)
      console.log('COUNT', this.taskStore.getCompletedTasksCount)
      if (this.taskStore.areAllTasksCompleted || this.scenarioStore.clickedScenario.id == "scenario_1") {
        console.log("show popup results")
        if (this.resultsStore.getIsConfirmationWindowOpen) {
          this.resultsStore.closeResultsConfirmationWindow()
        } else {
          this.resultsStore.openResultsConfirmationWindow()
        }
      } else {
        console.log("show popup missingtasks")
        this.showMissingTasksPopup = true
      }
    },
  },
}
</script>

<template>
  <BaseMenuIcon
    menu-icon-id="results-menu-icon"
    class-name="results"
    :icon-string="resultsStore.getConfirmationButtonIcon"
    :has-amount="false"
    :is-displayed="true"
    @click="handleClick"
  />

  <MissingTasksPopup
      :is-open="showMissingTasksPopup"
      @close="showMissingTasksPopup = false"
  />
</template>
