<template>
  <div class="logs-container">
    <h1>ログ一覧</h1>

    <div v-if="logsParsed.length > 0">
      <div v-for="(log, index) in logsParsed" :key="index" class="log-item">
        <h3>{{ log.choice }}</h3>
        <p class="memo">{{ log.memo }}</p>
        <p class="date">{{ formatDate(log.date) }}</p>
      </div>
    </div>

    <div v-else>
      <p>まだログがありません。</p>
    </div>
  </div>
</template>

<script setup>
import { useLocalStorage } from "@vueuse/core"

// localStorage の logs を取得
const logs = useLocalStorage("logs", [])

// JSON じゃなく配列として扱うためにパース
const logsParsed = computed(() => {
  // logs.value が文字列の場合は JSON.parse
  if (typeof logs.value === "string") {
    try {
      return JSON.parse(logs.value)
    } catch {
      return []
    }
  }
  return logs.value
})

// 日付フォーマット
const formatDate = (iso) => {
  const d = new Date(iso)
  return d.toLocaleString("ja-JP")
}
</script>

<style scoped>
.logs-container {
  padding: 20px;
}

.log-item {
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 16px;
}

.memo {
  margin-top: 8px;
  opacity: 0.8;
}

.date {
  margin-top: 4px;
  font-size: 12px;
  opacity: 0.6;
}
</style>
