<script lang="ts">
export default {
  name: 'MissingTasksPopup',
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['close'],
}
</script>

<template>
  <section v-if="isOpen" class="results-menu-confirmation">
    <div class="content">
      <div class="title">
        <h2>{{ $t('results.missingTasks') }}</h2>
      </div>
      <div class="buttons">
        <button class="btn" @click="$emit('close')">
          {{ $t('button.ok') }}
        </button>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
@import '../styles/components/resultsMenuConfirmation.scss';
</style>
