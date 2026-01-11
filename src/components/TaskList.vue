<script setup lang="ts">
import {Icon} from '@iconify/vue'
import TaskListItem from './TaskListItem.vue'
</script>

<script lang="ts">
export default {
  components: {
    TaskListItem,
    Icon,
  },
  data() {
    return {
      taskStore: useTaskStore(),
      scenarioStore: useScenarioStore(),
      gameParametersStore: useGameParametersStore(),
      listSizeExtended: true as boolean,
    }
  },
  computed: {

    tasksByDay() {
      return this.taskStore.getTasksByDay
    },

    isScenarioSelected() {
      const scenarioStore = useScenarioStore()
      const clickedScenario = scenarioStore.clickedScenario

      return !!clickedScenario && clickedScenario.id !== '0'
    },
  },
}
</script>

<template>
  <section class="list-task">
    <div class="list-container">
      <div v-if="listSizeExtended" class="type-list-normal type">
        <div class="task-header">
          <Icon
              icon="mdi:clipboard-check-outline"
              class="task-header-icon"
          />
          <h1 class="task-header-title">
            {{$t('task.toDo') }}
          </h1>
        </div>

        <div class="task-container">
          <TaskListItem
              v-for="task in tasksByDay"
              :key="task.id"
              :task="task"
          />
        </div>
      </div>

      <div v-else class="type-list-reduce type">
        <Icon
            icon="mdi:clipboard-check-outline"
            class="icon-type"
            style="color: #4caf50"
            @click="listSizeExtended = true"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@import "../styles/components/list.scss";
</style>
