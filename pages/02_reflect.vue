<template>
  <div class="reflect-container">

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
  <div class="dummy-last"></div>
</div>


<!-- ▼ 白フェード -->
<div v-if="isFading" class="white-fade"></div>


  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue"
import { useState } from "#imports"

const choices = useState("choices", () => [])
const current = useState("current", () => null)
const lastChoice = useState("lastChoice", () => null)

const showConfirm = ref(false)
const selectedChoice = ref(null)

/* ▼ 追加：フェード状態 */
const isFading = ref(false)

/* ▼ Reflect に来た瞬間の初期化 */
onMounted(() => {
  if (!current.value) pickRandom()
})

/* ▼ ランダムに1つ選ぶ */
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

/* ▼ 手放す */
const drop = () => {
  choices.value = choices.value.filter((c) => c !== current.value)
  pickRandom()
}

import { nextTick } from "vue"

watch(choices, async (newVal) => {
  if (newVal.length === 1) {
    // DOM 更新が完了するのを待つ
    await nextTick()

    // さらに少しだけ余白を作る（自然な間）
    setTimeout(() => {
      isFading.value = true

      setTimeout(() => {
        navigateTo({
          path: "/03_result",
          query: { choice: newVal[0] }
        })
      }, 1000)
    }, 60)
  }
})



/* ▼ 追加：「これがいい」もフェードで遷移 */
const chooseThis = () => {
  isFading.value = true
  setTimeout(() => {
    navigateTo({
      path: "/03_result",
      query: { choice: current.value }
    })
  }, 1000)
}

/* ▼ decide はもう使わない（残してもいいけど呼ばれない） */
const decide = () => {
  navigateTo({
    path: "/03_result",
    query: { choice: choices.value[0] }
  })
}
</script>


<style scoped>
.reflect-container {
  padding: 20px;
  text-align: center;
}
.upper-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
}
.lower-button {
  margin-top: 16px;
}

.white-fade {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0); /* ← 初期は完全透明 */
  animation: fadeIn 1s forwards;
  z-index: 999;
}

@keyframes fadeIn {
  from {
    background: rgba(255, 255, 255, 0); /* 完全透明 */
  }
  to {
    background: rgba(255, 255, 255, 1); /* 真っ白 */
  }
}



.dummy-last {
  height: 1px;
  opacity: 0;
}


@keyframes fadeIn {
  to { opacity: 1; }
}

</style>
