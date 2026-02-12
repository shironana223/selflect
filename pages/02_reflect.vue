<template>
  <div class="reflect-container">
    <h1>Reflect（仮）</h1>

    <div v-if="choices.length > 1">
      <p>どちらにする？</p>
      <h2>{{ current }}</h2>

      <button @click="drop">こっちは違う</button>
      <button @click="pickRandom">もう一回</button>
    </div>

    <div v-else>
      <p>最後の1つになりました</p>
      <h2>{{ choices[0] }}</h2>

      <button @click="decide">決定へ</button>
    </div>
  </div>
</template>

<script setup>
const choices = useState("choices")
const current = useState("current", () => null)

const pickRandom = () => {
  if (choices.value.length <= 1) return
  const idx = Math.floor(Math.random() * choices.value.length)
  current.value = choices.value[idx]
}

const drop = () => {
  choices.value = choices.value.filter((c) => c !== current.value)

  pickRandom()
}

const decide = () => {
  console.log("決定へ押されたよ")
  console.log("遷移直前 choices:", choices.value)
  navigateTo("/03_result")
}

// Reflect に来た瞬間に current をセット
if (!current.value && choices.value.length > 1) {
  pickRandom()
}
</script>

<style scoped>
.reflect-container {
  padding: 20px;
}
</style>
