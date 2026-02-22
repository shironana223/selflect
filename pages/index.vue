<script setup>
import { onMounted, computed } from "vue"

const logs = useState("logs", () => [])
const hasLogs = computed(() => logs.value.length > 0)

onMounted(() => {
  const stored = JSON.parse(localStorage.getItem("selflect_logs") || "[]")
  logs.value = stored
})

const goToLog = () => {
  if (hasLogs.value) {
    navigateTo("/logs")
  }
}
</script>


<template>
  <div class="home">
    <h1 class="title">Selflect</h1>

    <button @click="navigateTo('/01_listup')">はじめる</button>

    <button @click="goToLog">記録をひらく</button>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 48px 24px;
  max-width: 420px;
  margin: 0 auto;
  text-align: center;
}

button {
  background: none;
  border: none;
  font-size: 18px;
  padding: 8px 0;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s ease, transform 0.3s ease;
}
button:hover {
  transform: translateY(1px);
  opacity: 0.6;
}

.title {
  font-size: 32px;
  font-weight: 500;
  margin-bottom: 24px;
}

.logs-btn {
  opacity: 0.9;
}
</style>
