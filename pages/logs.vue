<template>
  <div class="logs-container">
    <h1>これまでの記録</h1>

    <div v-if="loading">読み込み中…</div>

    <div v-else>
      <div v-if="logs.length === 0">
        <p>まだ記録がありません。</p>
      </div>

      <ul v-else>
        <li v-for="(log, index) in logs" :key="index">
          <strong>{{ log.choice }}</strong>
          <div class="memo">{{ log.memo }}</div>
          <div class="date">{{ formatDate(log.date) }}</div>
        </li>
      </ul>
    </div>

    <button @click="goHome">ホームに戻る</button>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()

const logs = ref([])
const loading = ref(true)

// 日付の整形
const formatDate = (iso) => {
  if (!iso) return ""
  return new Date(iso).toLocaleString()
}

// Supabase からログを取得
onMounted(async () => {
  const { data, error } = await supabase
    .from("logs")
    .select("*")
    .order("date", { ascending: false })

  if (error) {
    console.error("ログ取得エラー:", error)
  } else {
    logs.value = data
  }

  loading.value = false
})

const goHome = () => {
  navigateTo("/")
}
</script>

<style scoped>
.logs-container {
  padding: 20px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.memo {
  margin-top: 4px;
  opacity: 0.8;
}

.date {
  margin-top: 4px;
  font-size: 12px;
  opacity: 0.6;
}
</style>
