<template>
  <div class="selflect-bg">
    <div class="reflect-container">

      <!-- ▼ 浮遊テキスト（背景レイヤー） -->
      <client-only>
        <ReflectChoices :choices="choices" />
      </client-only>

      <!-- ▼ ここから下は今までの Reflect の UI（核） -->
      <div v-if="choices.length > 1">
        <p>どちらにする？</p>
        <h2>{{ current }}</h2>

        <div class="upper-buttons">
          <button @click="drop">手放す</button>
          <button @click="pickRandom">まだ迷う</button>
        </div>

        <div class="lower-button">
          <button @click="chooseThis">これがいい</button>
        </div>
      </div>

      <div v-else>
        <p>最後の1つになりました</p>
        <h2>{{ choices[0] }}</h2>

        <button @click="decide">決定へ</button>
      </div>

      <!-- ▼ 確認ダイアログ（そのまま） -->
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
  </div>
</template>


<script setup>
import { onMounted, ref } from "vue"
import { useState } from "#imports"

/* ▼ デバッグ用（そのまま残す） */
onMounted(() => {
  console.log("Reflect に来たときの choices:", choices.value)
})

/* ▼ 状態管理（元のまま） */
const choices = useState("choices", () => [])

const current = useState("current", () => null)

const showConfirm = ref(false)
const selectedChoice = ref(null)

const lastChoice = useState("lastChoice", () => null)

/* ▼ ランダムに1つ選ぶ（元のまま） */
const pickRandom = () => {
  if (choices.value.length === 0) return null
  if (choices.value.length === 1) {
    current.value = choices.value[0]
    return current.value
  }

  let candidate = null
  let tries = 0

  do {
    const index = Math.floor(Math.random() * choices.value.length)
    candidate = choices.value[index]
    tries++
  } while (candidate === lastChoice.value && tries < 5)

  lastChoice.value = candidate
  current.value = candidate
  return candidate
}

/* ▼ 手放す（元のまま） */
const drop = () => {
  choices.value = choices.value.filter((c) => c !== current.value)
  pickRandom()
}

/* ▼ ReflectChoices から選択されたとき（新規追加） */
const handleSelect = (choice) => {
  selectedChoice.value = choice
  showConfirm.value = true
}

/* ▼ ダイアログ → 決める（元のまま） */
const confirmChoice = () => {
  navigateTo({
    path: "/03_result",
    query: { choice: selectedChoice.value }
  })
}

/* ▼ ダイアログ → まだ迷う（元のまま） */
const cancelConfirm = () => {
  showConfirm.value = false
  selectedChoice.value = null
}

/* ▼ 最後の1つになったときの決定（元のまま） */
const decide = () => {
  navigateTo({
    path: "/03_result",
    query: { choice: choices.value[0] }
  })
}

/* ▼ Reflect に来た瞬間の初期化（元のまま） */
onMounted(() => {
  if (!current.value) {
    pickRandom()
  }
})
</script>

<style scoped>
.reflect-container {
  padding: 20px;
}

/* ▼ ダイアログ（元のまま） */
.confirm-dialog {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
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
