<script setup lang="ts">
import {ref} from 'vue'
import {createBugReport} from '../service/BugReport'
import html2canvas from 'html2canvas'


const isOpen = ref(false)
const description = ref('')
const screenshot = ref<string | null>(null)
const isCapturing = ref(false)

function open() {
  description.value = ''
  isOpen.value = true
}

async function takeScreenshot() {
  if (isCapturing.value) return
  isCapturing.value = true
  isOpen.value = false
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 100))
  const canvas = await html2canvas(document.body, {
    useCORS: true,
    backgroundColor: null,
  })
  screenshot.value = canvas.toDataURL('image/png')
  isOpen.value = true
  isCapturing.value = false
}

function close() {
  isOpen.value = false
  console.log('close')
}

function submit() {
  if (!description.value.trim()) return
  createBugReport(description.value.trim(), screenshot.value ?? undefined)
  screenshot.value = null
  close()
}
</script>

<template>
  <button class="bug-report-button" @click="open">
     {{$t('report.signal')}}
  </button>
  <div v-if="isOpen" class="bug-popup-backdrop" @click.self="close">
    <div class="bug-popup">
      <h2> {{$t('report.signal')}}</h2>
      <textarea
          v-model="description"
      />{{$t('report.description')}}
      <div class="actions">
        <button @click="takeScreenshot" :disabled="isCapturing">
          {{ isCapturing ? 'Capture…' : $t('report.screenshot') }}
        </button>
        <button @click="close">{{$t('report.cancel')}}</button>
        <button @click="submit">{{ $t('report.confirm') }}</button>
      </div>
      <img
          v-if="screenshot"
          :src="screenshot"
          class="screenshot-preview"
      />
    </div>
  </div>
</template>

<style scoped>
.bug-report-button {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  opacity: 0.8;
}

.bug-report-button:hover {
  opacity: 1;
}

.bug-popup-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.bug-popup {
  background: var(--theme-color-background, #fff);
  color: var(--theme-color-text, #000);
  padding: 1rem;
  width: 420px;
  max-width: 90%;
  border-radius: 8px;
}

textarea {
  width: 100%;
  min-height: 100px;
  margin-top: 0.5rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}
</style>
