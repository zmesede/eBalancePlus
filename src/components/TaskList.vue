<script setup lang="ts">
import {Icon} from '@iconify/vue'
import {convertI18nObjectToLocale} from '../helpers/translation'
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
  },
}
</script>

<template>
  <section class="list-task">
    <div class="list-container">
      <!--<div class="icon-container" :class="listSizeExtended ? 'icon-container-extended' : 'icon-container-reduced'">
        <Icon v-if="listSizeExtended" icon="mdi:arrow-left" class="icon-menu" @click="listSizeExtended = false"/>
        <Icon v-else icon="mdi:arrow-right" class="icon-menu" @click="listSizeExtended = true"/>
      </div>-->

      <div v-if="listSizeExtended" class="type-list-normal type">
        <div class="task-header">
          <Icon
              icon="mdi:clipboard-check-outline"
              class="task-header-icon"
          />
          <h1 class="task-header-title">
            {{
              gameParametersStore.language === 'fr'
                  ? 'Tâches à réaliser'
                  : 'Tasks to do'
            }}
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

.task-container {
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
  @include scrollbar();
}

.task-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.task-header-icon {
  font-size: 1.5rem;
  color: var(--theme-color-text);
}

.task-header-title {
  margin: 0;
  font-weight: bold;
  color: var(--theme-color-text);
}
</style>
