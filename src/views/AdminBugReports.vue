<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {
  fetchBugReports,
  fetchScreenshot,
  deleteBugReport,
  type AdminBugReport
} from '../services/AdminBugReport'

const reports = ref<AdminBugReport[]>([])
const loading = ref(true)
const openScreenshot = ref<string | null>(null)

onMounted(async () => {
  try {
    reports.value = await fetchBugReports()
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})

function sanitizeTiles(tiles: any[]) {
  return tiles.map(({iconBase64, ...rest}) => rest)
}

async function showScreenshot(id: string) {
  try {
    openScreenshot.value = await fetchScreenshot(id)
  } catch (err) {
    console.error(err)
    alert('Failed to load screenshot')
  }
}

function closeScreenshot() {
  if (openScreenshot.value) {
    URL.revokeObjectURL(openScreenshot.value)
  }
  openScreenshot.value = null
}

async function confirmDelete(id: string) {
  const ok = confirm('Delete this bug report permanently?')
  if (!ok) return

  try {
    await deleteBugReport(id)
    reports.value = reports.value.filter(r => r.id !== id)
  } catch (err) {
    console.error(err)
    alert('Failed to delete bug report')
  }
}

</script>

<template>
  <div class="admin-container">
    <h1>🐞 Bug Reports</h1>

    <p v-if="loading">Loading…</p>

    <table v-else>
      <thead>
      <tr>
        <th>Date</th>
        <th>ID</th>
        <th>Scenario</th>
        <th>Production Curve</th>
        <th>Description</th>
        <th>Tasks</th>
        <th>Navigator</th>
        <th>Tiles</th>
        <th>Screenshot</th>
        <th>Actions</th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="r in reports" :key="r.id">
        <td>{{ r.created_at }}</td>
        <td class="mono">{{ r.id }}</td>
        <td>{{ r.scenario_id }}</td>
        <td>{{ r.production_curve_id }}</td>
        <td class="description">
          {{ r.description }}
        </td>

        <td>
          <ul>
            <li v-for="t in r.tasks" :key="t">{{ t }}</li>
          </ul>
        </td>
        <td>
          <div>{{ r.navigator }}</div>
        </td>
        <td>
          <ul>
            <li class="tile" v-for="t in sanitizeTiles(r.tiles)" :key="t">{{ t }}</li>
          </ul>
        </td>
        <td>
          <button @click="showScreenshot(r.id)">View</button>
        </td>
        <td>
          <div v-if="openScreenshot" class="modal" @click.self="closeScreenshot">
            <img :src="openScreenshot" />
          </div>
        </td>
        <td>
          <button
              class="delete"
              @click="confirmDelete(r.id)"
          >
            Delete
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.admin-container {
  margin-top: 2vh;
  padding: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

th,
td {
  border-bottom: 1px solid #ddd;
  padding: 0.5rem;
  vertical-align: top;
}

.description {
  max-width: 10vw;
}

.tile {
  max-width: 10vw;
}

.mono {
  font-family: monospace;
  font-size: 0.75rem;
}

.json {
  max-height: 120px;
  overflow: auto;
  background: #111;
  color: #0f0;
  padding: 0.3rem;
  font-size: 0.7rem;
}

.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal img {
  max-width: 90%;
  max-height: 90%;
  background: white;
}


</style>
