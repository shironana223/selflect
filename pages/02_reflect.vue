<template>
  <div class="reflect-container">

    <div class="content" v-if="choices.length > 1">

      <!-- ▼ 問い（存在感アップ） -->
      <div class="question">これを手放しますか？</div>

      <!-- ▼ current（高さ固定＋フェードのみ） -->
      <div class="current-wrapper">
        <Transition name="fade-only">
          <div v-if="current" class="current" :key="current">
            {{ current }}
          </div>
        </Transition>
      </div>

      <!-- ▼ 上の2つのボタン（控えめ） -->
      <div class="buttons">
        <button class="btn subtle" @click="drop">手放す</button>
        <button class="btn subtle" @click="pickRandom">まだ迷う</button>
      </div>

      <!-- ▼ 「これがいい」幅を狭くして控えめに -->
      <button class="btn main" @click="chooseThis">これがいい</button>
    </div>

    <!-- ▼ choices が1つになったとき（current を表示しない） -->
    <div class="content" v-else>
      <!-- 何も表示しない → すぐ白フェードへ -->
    </div>

    <!-- ▼ 白フェード -->
    <div v-if="isFading" class="white-fade"></div>

    <!-- ▼ 手放す時の一瞬の隠しレイヤー（ぼかし削除） -->
    <div v-if="isHiding" class="hide-layer"></div>

  </div>
</template>

<script setup>
import { onMounted, ref, watch, nextTick } from "vue"
import { useState } from "#imports"

const choices = useState("choices", () => [])
const current = useState("current", () => null)
const lastChoice = useState("lastChoice", () => null)

const isFading = ref(false)
const isHiding = ref(false)

/* ▼ Reflect に来た瞬間の初期化 */
onMounted(() => {
  if (!current.value) pickRandom()
})

/* ▼ ランダムに1つ選ぶ（同じの連続回避） */
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

/* ▼ 手放す：current を一旦消してから次をフェードで出す */
const drop = async () => {
  const removed = current.value

  // current を消す（フェードアウト）
  current.value = null
  await nextTick()

  // ▼ 一瞬だけ画面を隠す（残りの選択肢を見せない）
  isHiding.value = true

  setTimeout(() => {
    choices.value = choices.value.filter((c) => c !== removed)
    pickRandom()

    // ▼ 次の current がセットされたあとに表示
    setTimeout(() => {
      isHiding.value = false
    }, 60)
  }, 100)
}

/* ▼ choices が1つになったら current を非表示にしてフェード遷移 */
watch(choices, async (newVal) => {
  if (newVal.length === 1) {
    current.value = null  // ← 最後の1つを見せない
    await nextTick()

    setTimeout(() => {
      isFading.value = true

      setTimeout(() => {
        navigateTo({
          path: "/03_result",
          query: { choice: newVal[0] }
        })
      }, 300)
    }, 120)
  }
})

/* ▼ 「これがいい」もフェード */
const chooseThis = () => {
  isFading.value = true
  setTimeout(() => {
    navigateTo({
      path: "/03_result",
      query: { choice: current.value }
    })
  }, 300)
}
</script>

<style scoped>
/* ▼ 全体：静かで余白のある画面 */
.reflect-container {
  padding: 48px 24px;
  text-align: center;
  min-height: 100vh;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

/* ▼ 中央の縦ライン */
.content {
  max-width: 320px;
  margin: 0 auto;
  width: 100%;
}

/* ▼ 問い（存在感アップ） */
.question {
  font-size: 18px;
  font-weight: 500;
  opacity: 0.75;
  margin-bottom: 32px;
}

/* ▼ current の高さ固定（ガタつきゼロ） */
.current-wrapper {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ▼ current（選択肢） */
.current {
  font-size: 32px;
  font-weight: 600;
  color: #222;
}

/* ▼ ボタン群 */
.buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 40px 0 28px;
}

.btn {
width: 100px;
  margin: 0 auto;
  padding: 12px 18px;
  border-radius: 8px;
  font-size: 15px;
  border: 1px solid #ddd;
  background: #f5f5f5;
  opacity: 0.85;
  transition: opacity 0.2s ease;
}

.btn:hover {
  opacity: 0.65;
}

.btn.main {
  width: 160px; 
  margin: 0 auto;
  background: #f5f5f5;
  opacity: 0.75;
}

/* ▼ current のフェードのみ（左右・上下に動かない） */
.fade-only-enter-from,
.fade-only-leave-to {
  opacity: 0;
}

.fade-only-enter-active,
.fade-only-leave-active {
  transition: opacity 0.25s ease;
}

/* ▼ 白フェード（遷移用） */
.white-fade {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0);
  animation: fadeIn 1s forwards;
  z-index: 999;
}

@keyframes fadeIn {
  from { background: rgba(255, 255, 255, 0); }
  to   { background: rgba(255, 255, 255, 1); }
}

/* ▼ 手放す時の薄い隠しレイヤー（ぼかし削除） */
.hide-layer {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.4); /* ← ぼかしなしの薄膜 */
  z-index: 10;
}
</style>
