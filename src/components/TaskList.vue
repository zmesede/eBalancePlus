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
      const clickedScenario = this.scenarioStore.clickedScenario
      return !!clickedScenario && clickedScenario.id !== '0'
    },
  },
}
</script>

<template>
  <section class="list-task" :class="{ reduced: !listSizeExtended }">
    <div class="list-container">
      <div class="icon-container icon-container-extended">
        <Icon
            v-if="listSizeExtended"
            icon="mdi:chevron-right"
            class="icon-menu"
            @click="listSizeExtended = false"
        />
        <Icon
            v-else
            icon="mdi:chevron-left"
            class="icon-menu"
            @click="listSizeExtended = true"
        />
      </div>
      <div v-if="listSizeExtended" class="type-list-normal type">
        <div class="task-header">
          <Icon icon="mdi:clipboard-check-outline" class="task-header-icon"/>
          <h1 class="task-header-title">{{ $t('task.toDo') }}</h1>
        </div>
        <div class="task-container">
          <TaskListItem
              v-for="task in tasksByDay"
              :key="task.id"
              :task="task"
          />
        </div>
      </div>
      <div v-else class="task-compact-list">
        <div
            v-for="task in tasksByDay"
            :key="task.id"
            class="task-icon-toggle"
            :class="{ completed: taskStore.isTaskCompleted(task.id, task.equipmentTypeId) }"
            @click="taskStore.toggleTaskCompletion(task.id)"
        >
          <Icon
              :icon="task.icon"
              class="task-icon"
              :style="{ color: task.color }"
          />
          <Icon
              v-if="taskStore.isTaskCompleted(task.id, task.equipmentTypeId)"
              icon="mdi:check-circle"
              class="task-checkmark"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '../styles/components/taskList.scss' as *;
</style>
