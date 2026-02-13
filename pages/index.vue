<script setup>
const supabase = useSupabase()

// ログがあるかどうか
const hasLogs = ref(false)
const loading = ref(true)

onMounted(async () => {
  // 1件だけ取得して存在チェック（高速 & 安全）
  const { data, error } = await supabase
    .from("logs")
    .select("id")
    .limit(1)

  if (!error) {
    hasLogs.value = data.length > 0
  }

  loading.value = false
})

// ログ画面へ
const goToLogs = () => {
  navigateTo("/logs")
}
</script>

<template>
  <div class="home">

    <h1 class="title">Selflect</h1>

    <button @click="navigateTo('/01_listup')">
      はじめる
    </button>

    <!-- ログがあるときだけ表示 -->
    <button
      v-if="hasLogs && !loading"
      @click="goToLogs"
      class="logs-btn"
    >
      選んだ瞬間たちを見る
    </button>

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
