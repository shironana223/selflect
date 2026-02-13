<template>
  <div class="result-container">
    <h1>結果</h1>

    <div v-if="finalChoice">
      <p>あなたが残したのはこれです</p>
      <h2>{{ finalChoice }}</h2>

      <p class="message">また迷ったら、いつでもどうぞ。</p>

      <div class="memo-area">
        <textarea
          v-model="memo"
          placeholder="ひとことメモ（任意）"
        ></textarea>
        <button @click="saveLog">保存する</button>
      </div>

      <div class="buttons">
        <button @click="retry">もう一度やってみる</button>
        <button @click="reset">最初から入力する</button>
      </div>
    </div>

    <div v-else>
      <p>選択肢が見つかりませんでした。</p>
      <button @click="reset">最初から入力する</button>
    </div>
  </div>
</template>

<script setup>
import { useLocalStorage } from '@vueuse/core'
const supabase = useSupabaseClient()

const route = useRoute()
const finalChoice = route.query.choice || null

const choices = useState("choices")
const current = useState("current")

const memo = ref("")

// localStorage 永続化
const logs = useLocalStorage("logs", [])

// 保存処理
const saveLog = async () => {
  const newLog = {
    choice: finalChoice,
    memo: memo.value,
    date: new Date().toISOString()
  }

  // ▼ 1. localStorage に保存（安全）
  logs.value = [...logs.value, newLog]

  // ▼ 2. Supabase に保存（外部サービス）
  const { error } = await supabase
    .from("logs")
    .insert(newLog)

  if (error) {
    console.error("Supabase 保存エラー:", error)
    alert("保存しました（※ネットワークの都合でクラウド保存は後で再試行されます）")
  } else {
    alert("保存しました")
  }

  memo.value = ""
}

// もう一度やる
const retry = () => {
  current.value = null
  navigateTo("/02_reflect")
}

// 最初から
const reset = () => {
  choices.value = []
  current.value = null
  navigateTo("/")
}
</script>

<style scoped>
.result-container {
  padding: 20px;
  text-align: center;
}

.message {
  margin-top: 16px;
  font-size: 14px;
  opacity: 0.8;
}

.memo-area {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

textarea {
  width: 100%;
  min-height: 80px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.buttons {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
