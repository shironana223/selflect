<template>
  <div>
    <h1>選択肢を入力（仮）</h1>

    <input
      v-model="input"
      @keyup.enter="addChoice"
      placeholder="選択肢を入力して Enter"
    />

    <ul>
      <li v-for="(c, i) in choices" :key="i">{{ c }}</li>
    </ul>

    <button @click="goFloat" :disabled="choices.length < 2">
      準備できた
    </button>
  </div>
</template>

<script setup>
const input = ref('')
const choices = useState('choices', () => [])

const addChoice = () => {
  if (!input.value) return
  choices.value.push(input.value)
  input.value = ''
}

const goFloat = () => navigateTo('/_float')
</script>
