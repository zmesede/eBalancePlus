<script setup lang="ts">
import {ref} from 'vue'
import {loginAdmin} from '../services/adminAuth'
import {useRouter} from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')

async function submit() {
  try {
    await loginAdmin(username.value, password.value)
    router.push('/admin/bug-reports')
  } catch {
    error.value = 'Invalid credentials'
  }
}
</script>

<template>
  <div class="login">
    <h2>Admin Login</h2>

    <input v-model="username" placeholder="Username"/>
    <input v-model="password" type="password" placeholder="Password"/>

    <button @click="submit">Login</button>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<style>
.login {
  margin-top: 5vw;
}
</style>
