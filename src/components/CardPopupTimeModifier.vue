<script lang="ts">
import { addTimeAmountToHour, compareTwoHours, removeTimeAmountFromHour } from '../helpers/time'

export default {
  name: 'CardPopupTimeModifier',
  props: {
    startHour: { type: String, required: true },
    endHour: { type: String, required: true },
    minDuration: { type: String, required: true },
    maxDuration: { type: String, required: true },
    stepDuration: { type: String, required: true },
    originalDuration: { type: String, required: true },
    isDurationLengthEditable: { type: Boolean, required: true },
    inputError: { type: Boolean, required: true },
  },
  emits: ['start-hour', 'end-hour'],
  data() {
    const [startH, startM] = this.startHour.split(':')
    const [endH, endM] = this.endHour.split(':')

    return {
      inputErrorStart: false,
      inputErrorEnd: false,
      startHourPlus: false,
      startHourMinus: false,
      endHourPlus: false,
      endHourMinus: false,
      hours: Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')),
      minutes: ['00', '15', '30', '45'],
      startHourLocal: startH,
      startMinuteLocal: startM,
      endHourLocal: endH,
      endMinuteLocal: endM,
    }
  },
  watch: {
    startHour: {
      handler() {
        this.setTimeModificationParams()
        const [h, m] = this.startHour.split(':')
        this.startHourLocal = h
        this.startMinuteLocal = m
      },
      immediate: true,
    },
    endHour: {
      handler() {
        this.setTimeModificationParams()
        const [h, m] = this.endHour.split(':')
        this.endHourLocal = h
        this.endMinuteLocal = m
      },
      immediate: true,
    },
  },
  methods: {
    getCombinedTime(hour: string, minute: string) {
      return `${hour}:${minute}`
    },
    emitStartTimeChange() {
      const combined = this.getCombinedTime(this.startHourLocal, this.startMinuteLocal)
      this.inputErrorStart = false
      this.$emit('start-hour', combined)
      this.updateEndHourIfStartHourChangedAndDurationLengthIsNotEditable(combined)
    },
    emitEndTimeChange() {
      const combined = this.getCombinedTime(this.endHourLocal, this.endMinuteLocal)
      this.inputErrorEnd = false
      this.$emit('end-hour', combined)
    },

    addStepAmountToStartHour() {
      const newStart = addTimeAmountToHour(this.startHour, this.stepDuration)
      this.$emit('start-hour', newStart)
      this.updateEndHourIfStartHourChangedAndDurationLengthIsNotEditable(newStart)
    },
    addStepAmountToEndHour() {
      const newEnd = addTimeAmountToHour(this.endHour, this.stepDuration)
      this.$emit('end-hour', newEnd)
    },
    removeStepAmountFromStartHour() {
      const newStart = removeTimeAmountFromHour(this.startHour, this.stepDuration)
      this.$emit('start-hour', newStart)
      this.updateEndHourIfStartHourChangedAndDurationLengthIsNotEditable(newStart)
    },
    removeStepAmountFromEndHour() {
      const newEnd = removeTimeAmountFromHour(this.endHour, this.stepDuration)
      this.$emit('end-hour', newEnd)
    },

    updateEndHourIfStartHourChangedAndDurationLengthIsNotEditable(newStart: string) {
      if (!this.isDurationLengthEditable) {
        const newEnd = addTimeAmountToHour(newStart, this.originalDuration)
        this.$emit('end-hour', newEnd)
      }
    },

    getStartAndEndHourNumbers() {
      const [sh, sm] = this.startHour.split(':').map(Number)
      const [eh, em] = this.endHour.split(':').map(Number)
      return { sh, sm, eh, em }
    },

    isStartHourBeforeEndHour(start: string, end: string) {
      return compareTwoHours(addTimeAmountToHour(start, this.stepDuration), end) === -1
    },

    isDurationOverMaxDuration() {
      const { sh, sm, eh, em } = this.getStartAndEndHourNumbers()
      const [mh, mm] = this.maxDuration.split(':').map(Number)
      if (eh - sh > mh) return true
      if (eh - sh === mh && em - sm > mm) return true
      return false
    },

    isDurationUnderMinDuration() {
      const { sh, sm, eh, em } = this.getStartAndEndHourNumbers()
      const [mh, mm] = this.minDuration.split(':').map(Number)
      if (eh - sh < mh) return true
      if (eh - sh === mh && em - sm < mm) return true
      return false
    },

    setTimeModificationParams() {
      if (this.isStartHourBeforeEndHour(this.startHour, this.endHour)) {
        this.inputErrorStart = false
        this.inputErrorEnd = false
        this.setTimeModificationParamsFromMinMaxDuration()
      } else {
        this.startHourPlus = true
        this.endHourMinus = true
      }
    },

    setTimeModificationParamsFromMinMaxDuration() {
      if (this.isDurationOverMaxDuration()) {
        this.startHourPlus = true
        this.endHourMinus = true
      } else {
        this.startHourPlus = false
        this.endHourMinus = false
      }
      if (this.isDurationUnderMinDuration()) {
        this.startHourMinus = true
        this.endHourPlus = true
      } else {
        this.startHourMinus = false
        this.endHourPlus = false
      }
    },
  },
}
</script>

<template>
  <div class="card-time-modifier">
    <div class="hour-container start-hour-container">
      <p>{{ $t("input.start") }}</p>
      <div class="hour-modifier-container" :class="{ 'input-error': inputError || inputErrorStart }">
        <button class="btn remove" :class="{ disabled: startHourMinus }" @click="removeStepAmountFromStartHour">-</button>

        <div class="time-select">
          <select v-model="startHourLocal" @change="emitStartTimeChange">
            <option v-for="h in hours" :key="h" :value="h">{{ h }}</option>
          </select>
          :
          <select v-model="startMinuteLocal" @change="emitStartTimeChange">
            <option v-for="m in minutes" :key="m" :value="m">{{ m }}</option>
          </select>
        </div>

        <button class="btn add" :class="{ disabled: startHourPlus }" @click="addStepAmountToStartHour">+</button>
      </div>
    </div>
    <div v-if="isDurationLengthEditable" class="hour-container end-hour-container">
      <p>{{ $t("input.end") }}</p>
      <div class="hour-modifier-container" :class="{ 'input-error': inputError || inputErrorEnd }">
        <button class="btn remove" :class="{ disabled: endHourMinus }" @click="removeStepAmountFromEndHour">-</button>

        <div class="time-select">
          <select v-model="endHourLocal" @change="emitEndTimeChange">
            <option v-for="h in hours" :key="h" :value="h">{{ h }}</option>
          </select>
          :
          <select v-model="endMinuteLocal" @change="emitEndTimeChange">
            <option v-for="m in minutes" :key="m" :value="m">{{ m }}</option>
          </select>
        </div>
        <button class="btn add" :class="{ disabled: endHourPlus }" @click="addStepAmountToEndHour">+</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '../styles/components/cardPopupTimeModifier.scss';
</style>
