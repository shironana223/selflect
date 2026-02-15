<template>
  <div class="result-wrapper">
    <div class="result-inner" v-if="finalChoice">
      <p class="fade-step step1">あなたが残したのは</p>

      <h2 class="fade-step step2">{{ finalChoice }}</h2>

      <p class="message fade-step step3">また迷ったら、いつでもどうぞ。</p>

      <div class="fade-step step4">
        <div class="memo-area">
          <textarea
            v-model="memo"
            placeholder="そっとひとこと"
            :disabled="alreadySaved"
          ></textarea>

          <button class="btn save-btn" @click="saveLog" :disabled="alreadySaved">
            {{ alreadySaved ? "保存済み" : "保存する" }}
          </button>
        </div>

        <div class="buttons">
          <button class="btn" @click="retry">もう一度やってみる</button>
          <button class="btn" @click="reset">最初から入力する</button>
        </div>
      </div>
    </div>

    <div v-else>
      <p>選択肢が見つかりませんでした。</p>
      <button class="btn" @click="reset">最初から入力する</button>
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
    alert("この瞬間を記録しました（クラウド保存は後で再試行されます）")
  } else {
    alert("この瞬間を記録しました")
  }

  alreadySaved.value = true
}

// ▼ もう一度やる
const choices = useState("choices")
const current = useState("current")

const originalChoices = useState("originalChoices")

const retry = () => {
  choices.value = [...originalChoices.value] // ← 元に戻す
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
.result-wrapper {
  padding: 24px 24px; /* ← 上部余白を少し詰めた */
  text-align: center;
  min-height: 100vh;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

/* ▼ 細い縦ライン */
.result-inner {
  max-width: 320px;
  margin: 0 auto;
  width: 100%;
}

/* ▼ 「あなたが残したのは」 */
.step1 {
  font-size: 18px;
  font-weight: 500;
  opacity: 0.75;
  margin-bottom: 20px; /* ← 少し詰めた */
}

/* ▼ 結果（主役） */
.step2 {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 48px; /* ← 主役として余白を広めに */
  color: #222;
}

/* ▼ メッセージ（添える） */
.step3 {
  font-size: 13.5px;
  opacity: 0.6;
  margin-bottom: 42px; /* ← 下げた */
}

.step4 {
  opacity: 0.85;
}

/* ▼ メモ欄（小さめ） */
.memo-area {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

textarea {
  width: 100%;
  max-width: 240px; /* ← 280 → 240 に */
  margin: 0 auto;
  min-height: 48px; /* ← 60 → 48 に */
  padding: 8px; /* ← 10 → 8 に */
  border-radius: 6px; /* ← 8 → 6 に */
  font-size: 13px; /* ← 14 → 13 に */
  background: #fafafa;
  border: 1px solid #ddd;
}

textarea:disabled {
  opacity: 0.6;
}

/* ▼ ボタン（優しいデザイン） */
.btn {
  min-width: 180px; /* ← 最小幅を決める */
  max-width: 180px; /* ← 最大幅も同じにする（固定幅） */
  margin: 0 auto; /* ← 完全中央揃え */
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 14px;
  border: 1px solid #ddd;
  background: #fafafa;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.btn:hover {
  opacity: 0.65;
}

.save-btn { min-width: 120px; /* ← 150 → 120 に */ max-width: 120px; padding: 6px 12px; /* ← さらに控えめ */ font-size: 13px; /* ← 14 → 13 */ opacity: 0.75; /* ← 少し弱めに */ }

/* ▼ ボタン群 */
.buttons {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ▼ 呼吸感のあるフェード（速度ゆっくり・delay短め） */
.fade-step {
  opacity: 0;
  animation: fadeInResult 1.6s ease forwards; /* ← 呼吸の速度 */
}

.step1 {
  animation-delay: 0.4s;
}
.step2 {
  animation-delay: 1s;
  animation-duration: 3s;
}
.step3 {
  animation-delay: 2.8s;
}
.step4 {
  animation-delay: 3.6s;
}

@keyframes fadeInResult {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
