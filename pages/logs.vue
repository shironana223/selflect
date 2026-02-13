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
          <button @click="deleteLog(log.id)">削除</button>

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
  const d = new Date(iso)

  const weekdays = ["日", "月", "火", "水", "木", "金", "土"]

  const yyyy = d.getFullYear()
  const mm = d.getMonth() + 1
  const dd = d.getDate()
  const w = weekdays[d.getDay()]
  const hh = String(d.getHours()).padStart(2, "0")
  const min = String(d.getMinutes()).padStart(2, "0")

  return `${yyyy}年${mm}月${dd}日(${w}) ${hh}:${min}`
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
const deleteLog = async (id) => {
  const ok = confirm("この記録を削除しますか？")
  if (!ok) return

  const { error } = await supabase
    .from("logs")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("削除エラー:", error)
    alert("削除に失敗しました")
    return
  }

  // 画面からも即座に消す
  logs.value = logs.value.filter((log) => log.id !== id)
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
