<template>
  <div class="reflect-container">
    <h1>Reflect（仮）</h1>

    <!-- choices が 2つ以上あるとき -->
    <div v-if="choices.length > 1">
      <p>どちらにする？</p>
      <h2>{{ current }}</h2>

      <!-- 上段：手放す / まだ迷う -->
      <div class="upper-buttons">
        <button @click="drop">手放す</button>
        <button @click="pickRandom">まだ迷う</button>
      </div>

      <!-- 下段：これがいい -->
      <div class="lower-button">
        <button @click="chooseThis">これがいい</button>
      </div>
    </div>

    <!-- choices が 1つだけになったとき -->
    <div v-else>
      <p>最後の1つになりました</p>
      <h2>{{ choices[0] }}</h2>

      <button @click="decide">決定へ</button>
    </div>

    <!-- ▼ 確認ダイアログ -->
    <div v-if="showConfirm" class="confirm-dialog">
      <div class="dialog-content">
        <p>これにする？</p>
        <h3>{{ selectedChoice }}</h3>

        <div class="dialog-buttons">
          <button @click="confirmChoice">決める</button>
          <button @click="cancelConfirm">まだ迷う</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const choices = useState("choices")
const current = useState("current", () => null)

// ▼ 確認ダイアログ用
const showConfirm = ref(false)
const selectedChoice = ref(null)

// ▼ ランダムに1つ選ぶ
const pickRandom = () => {
  if (choices.value.length <= 1) return
  const idx = Math.floor(Math.random() * choices.value.length)
  current.value = choices.value[idx]
}

// ▼ 手放す
const drop = () => {
  choices.value = choices.value.filter((c) => c !== current.value)
  pickRandom()
}

// ▼ 「これがいい」押したとき
const chooseThis = () => {
  selectedChoice.value = current.value
  showConfirm.value = true
}

// ▼ ダイアログ → 決める
const confirmChoice = () => {
  navigateTo({
    path: "/03_result",
    query: { choice: selectedChoice.value }
  })
}

// ▼ ダイアログ → まだ迷う
const cancelConfirm = () => {
  showConfirm.value = false
  selectedChoice.value = null
}

// ▼ 最後の1つになったときの決定
const decide = () => {
  navigateTo({
    path: "/03_result",
    query: { choice: choices.value[0] }
  })
}

// ▼ Reflect に来た瞬間に current をセット
if (!current.value && choices.value.length > 1) {
  pickRandom()
}
</script>

<style scoped>
.reflect-container {
  padding: 20px;
}

/* ボタン配置（仮） */
.upper-buttons {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.lower-button {
  margin-top: 24px;
}

/* ダイアログ（仮） */
.confirm-dialog {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
}

.dialog-buttons {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}
</style>
