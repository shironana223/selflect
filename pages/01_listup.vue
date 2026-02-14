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
    <!-- 編集中の項目だけ input に -->
    <span v-if="editingIndex !== i">{{ c }}</span>
    <input
      v-else
      v-model="input"
      @keyup.enter="saveEdit"
    />

    <!-- 編集ボタン or 保存ボタン -->
    <button v-if="editingIndex !== i" @click="startEdit(i)">✏️</button>
    <button v-else @click="saveEdit">💾</button>

    <!-- 削除ボタン -->
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

const addChoice = () => {
  // 編集中なら保存に切り替え
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


const goFloat = () => navigateTo('/_float')

// 編集中の index（編集していないときは null）
const editingIndex = ref(null)

// 編集開始
const startEdit = (i) => {
  editingIndex.value = i
  input.value = choices.value[i]
}

// 編集保存
const saveEdit = () => {
  const trimmed = input.value.trim()
  if (!trimmed) return

  // 重複チェック（自分自身は除外）
  if (choices.value.includes(trimmed) && trimmed !== choices.value[editingIndex.value]) {
    alert("同じ選択肢がすでにあります")
    return
  }

  choices.value[editingIndex.value] = trimmed
  editingIndex.value = null
  input.value = ''
}

// 削除
const removeChoice = (i) => {
  choices.value.splice(i, 1)
}

</script>
