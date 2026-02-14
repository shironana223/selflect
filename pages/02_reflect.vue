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
      <p>最後の1つになりました</p>
      <h2>{{ choices[0] }}</h2>
      <button @click="decide">決定へ</button>
    </div>

  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { useState } from "#imports"

const choices = useState("choices", () => [])
const current = useState("current", () => null)
const lastChoice = useState("lastChoice", () => null)

const showConfirm = ref(false)
const selectedChoice = ref(null)

onMounted(() => {
  if (!current.value) pickRandom()
})

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

const drop = () => {
  choices.value = choices.value.filter((c) => c !== current.value)
  pickRandom()
}

const chooseThis = () => {
  navigateTo({
    path: "/03_result",
    query: { choice: current.value }
  })
}

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
</style>
