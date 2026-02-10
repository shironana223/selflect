<template>
  <div class="result-container">
    <h1>Result（仮）</h1>

    <p>あなたが選んだもの：</p>
    <h2>{{ finalChoice }}</h2>

    <button @click="goHome">ホームへ戻る</button>
  </div>
</template>

<script setup>
const choices = useState('choices')

// Reflect で「これがいい」を押した時点で
// choices の中には「選ばれた1つ」だけが残っている想定
const finalChoice = computed(() => choices.value[0])

const goHome = () => {
  // choices をリセットしておくと次の迷いに備えられる
  choices.value = []
  navigateTo('/')
}
</script>

<style scoped>
.result-container {
  padding: 20px;
}
</style>
