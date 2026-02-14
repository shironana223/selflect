<script setup>
import { onMounted } from "vue"
const supabase = useSupabase()

const logs = useState("logs", () => [])
const hasLogs = computed(() => logs.value.length > 0)

onMounted(async () => {
  const { data, error } = await supabase
    .from("logs")
    .select("*")
    .order("date", { ascending: false })

  if (!error) {
    logs.value = data
  }
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

    <button @click="goToLog">選んだ瞬間たちを見る</button>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
}

.logs-btn {
  opacity: 0.9;
}
</style>
