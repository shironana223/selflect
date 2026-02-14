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
          placeholder="そっとひとこと"
          :disabled="alreadySaved"
        ></textarea>

        <button @click="saveLog" :disabled="alreadySaved">
          {{ alreadySaved ? "保存済み" : "保存する" }}
        </button>
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
import { useLocalStorage } from "@vueuse/core"

const supabase = useSupabaseClient()
const route = useRoute()

const finalChoice = route.query.choice || null
const memo = ref("")
const logs = useLocalStorage("logs", [])

const alreadySaved = ref(false)

// ▼ この瞬間のユニークID（毎回 Reflect → Result で変わる）
const logId = Date.now()

// ▼ 保存済みチェック（localStorage）
onMounted(async () => {
  if (logs.value.some((log) => log.id === logId)) {
    alreadySaved.value = true
    return
  }

  // ▼ Supabase 側の保存済みチェック（ID ではなく choice で判定していた部分は削除）
  // 今後は ID で判定するので Supabase 側のチェックは不要
})

// ▼ 保存処理（1回だけ）
const saveLog = async () => {
  if (alreadySaved.value) return

  const newLog = {
    id: logId,
    choice: finalChoice,
    memo: memo.value,
    date: new Date().toISOString()
  }

  // localStorage
  logs.value = [...logs.value, newLog]

  // Supabase
  const { error } = await supabase.from("logs").insert(newLog)

  if (error) {
    console.error("Supabase 保存エラー:", error)
    alert("この瞬間を残しました（クラウド保存は後で再試行されます）")
  } else {
    alert("この瞬間を残しました")
  }

  alreadySaved.value = true
}

// ▼ もう一度やる
const choices = useState("choices")
const current = useState("current")

const originalChoices = useState("originalChoices")

const retry = () => {
  choices.value = [...originalChoices.value]  // ← 元に戻す
  current.value = null
  navigateTo("/02_reflect")
}


// ▼ 最初から
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

textarea:disabled {
  opacity: 0.6;
  background: #f5f5f5;
}

.buttons {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
