<script setup lang="ts">
import {Icon} from '@iconify/vue'
import {convertI18nObjectToLocale} from '../helpers/translation'

interface Props {
  task: any
}

defineProps<Props>()
</script>

<script lang="ts">
export default {
  data() {
    return {
      taskStore: useTaskStore(),
      gameParametersStore: useGameParametersStore(),
    }
  },
  computed: {
    isCompleted() {
      return this.taskStore.isTaskCompleted(this.task.id, this.task.equipmentTypeId)
    },
  },
  methods: {
    handleClick() {
      // Permet de forcer manuellement la complétion/incomplétion
      this.taskStore.toggleTaskCompletion(this.task.id)
    },
  },
}
</script>

<template>
  <div
      class="task-item"
      :class="{ completed: isCompleted }"
      @click="handleClick"
  >
    <div class="task-checkbox">
      <Icon
          :icon="isCompleted ? 'mdi:checkbox-marked' : 'mdi:checkbox-blank-outline'"
          class="checkbox-icon"
      />
    </div>

    <Icon
        :icon="task.icon"
        :style="{ color: task.color }"
        class="task-icon"
    />

    <h1 class="name">
      {{ convertI18nObjectToLocale(task.names, gameParametersStore.language) }}
    </h1>
  </div>
</template>


<style scoped lang="scss">
@import "../styles/components/task.scss";
</style>
