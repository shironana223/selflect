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
  const trimmed = input.value.trim()
  if (!trimmed) return

  if (choices.value.includes(trimmed)) {
    alert("同じ選択肢がすでにあります")
    return
  }

  choices.value.push(trimmed)
  input.value = ''
}

const goFloat = () => navigateTo('/_float')
</script>
