<template>
  <div class="reflect-container">
    <h1>Reflect（仮）</h1>

    <div v-if="current">
      <p>今の選択肢：{{ current }}</p>

      <button @click="keep">まだ迷う</button>
      <button @click="drop">手放す</button>
      <button @click="decide">これがいい</button>
    </div>

    <div v-else>
      <p>最後の1つになりました</p>
      <button @click="decide">決定へ</button>
    </div>
  </div>
</template>

<script setup>
const choices = useState('choices')

// 今見ている選択肢
const current = ref(null)

// Reflect に入ったら最初の1つを選ぶ
onMounted(() => {
  pickRandom()
})

// ランダムに1つ選ぶ
const pickRandom = () => {
  if (choices.value.length === 1) {
    current.value = null
    return
  }

  const index = Math.floor(Math.random() * choices.value.length)
  current.value = choices.value[index]
}

// 「まだ迷う」→ 別のランダムへ
const keep = () => {
  pickRandom()
}

// 「手放す」→ choices から削除して次へ
const drop = () => {
  choices.value = choices.value.filter(c => c !== current.value)
  pickRandom()
}

// 「これがいい」→ result へ
const decide = () => {
  navigateTo('/03_result')
}
</script>

<style scoped>
.reflect-container {
  padding: 20px;
}
</style>
