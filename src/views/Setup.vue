<script lang="ts">
import SetupProductionList from '../components/SetupProductionList.vue'
import SetupProductionRecap from '../components/SetupProductionResume.vue'
import SetupScenarioList from '../components/SetupScenarioList.vue'
import SetupScenarioResume from '../components/SetupScenarioResume.vue'

export default {
  components: {
    SetupProductionList,
    SetupProductionRecap,
    SetupScenarioList,
    SetupScenarioResume,
  },
}
</script>

<template>
  <div id="setup-page" class="view">
    <SetupProductionList />
    <div class="center-container">
      <SetupValidationSection />
      <div class="details-container">
        <SetupProductionRecap />
        <SetupScenarioResume />
      </div>

    </div>
    <SetupScenarioList />
  </div>
</template>

<style lang="scss">
    @use "../styles/views/setup.scss" as *;
</style>
