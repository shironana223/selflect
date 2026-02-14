<template>
  <div>
    <h1>選択肢を入力（仮）</h1>

    <input
      v-model="input"
      @keyup.enter="addChoice"
      placeholder="選択肢を入力して Enter"
    />

    <ul>
      <li v-for="(c, i) in choices" :key="i">
        <span v-if="editingIndex !== i">{{ c }}</span>
        <input
          v-else
          v-model="input"
          @keyup.enter="saveEdit"
        />

        <button v-if="editingIndex !== i" @click="startEdit(i)">✏️</button>
        <button v-else @click="saveEdit">💾</button>

        <button @click="removeChoice(i)">🗑</button>
      </li>
    </ul>

    <button @click="goFloat" :disabled="choices.length < 2">
      準備できた
    </button>
  </div>
</template>

<script setup>
const input = ref('')
const choices = useState('choices', () => [])
const originalChoices = useState("originalChoices", () => [])  // ← 追加！

const addChoice = () => {
  if (editingIndex.value !== null) {
    saveEdit()
    return
  }

  const trimmed = input.value.trim()
  if (!trimmed) return

  if (choices.value.includes(trimmed)) {
    alert("同じ選択肢がすでにあります")
    return
  }

  choices.value.push(trimmed)
  input.value = ''
}

const goFloat = () => {
  originalChoices.value = [...choices.value]   // ← ここが大事！
  navigateTo('/_float')
}

const editingIndex = ref(null)

const startEdit = (i) => {
  editingIndex.value = i
  input.value = choices.value[i]
}

const saveEdit = () => {
  const trimmed = input.value.trim()
  if (!trimmed) return

  if (choices.value.includes(trimmed) && trimmed !== choices.value[editingIndex.value]) {
    alert("同じ選択肢がすでにあります")
    return
  }

  choices.value[editingIndex.value] = trimmed
  editingIndex.value = null
  input.value = ''
}

const removeChoice = (i) => {
  choices.value.splice(i, 1)
}
</script>
