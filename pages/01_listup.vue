<template>
  <div class="listup-container">
    <h1>選択肢を入力（仮）</h1>

    <input
      v-model="input"
      @keyup.enter="addChoice"
      placeholder="選択肢を入力して Enter"
    />

    <ul>
      <li v-for="(c, i) in choices" :key="i" class="choice-row">
        <span v-if="editingIndex !== i">{{ c }}</span>
        <input v-else v-model="input" @keyup.enter="saveEdit" />

        <div class="icon-row">
          <button
            v-if="editingIndex !== i"
            class="icon-btn edit-btn"
            @click="startEdit(i)"
          >
            ✏️
          </button>
          <button v-else class="icon-btn save-btn" @click="saveEdit">💾</button>
          <button class="icon-btn delete-btn" @click="removeChoice(i)">
            🗑
          </button>
        </div>
      </li>
    </ul>

    <button @click="goFloat('/_float')">準備できた</button>
  </div>
</template>

<script setup>
const input = ref("")
const choices = useState("choices", () => [])
const originalChoices = useState("originalChoices", () => []) // ← 追加！

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
  input.value = ""
}

const goFloat = () => {
  originalChoices.value = [...choices.value] // ← ここが大事！
  navigateTo("/_float")
}

const editingIndex = ref(null)

const startEdit = (i) => {
  editingIndex.value = i
  input.value = choices.value[i]
}

const saveEdit = () => {
  const trimmed = input.value.trim()
  if (!trimmed) return

  if (
    choices.value.includes(trimmed) &&
    trimmed !== choices.value[editingIndex.value]
  ) {
    alert("同じ選択肢がすでにあります")
    return
  }

  choices.value[editingIndex.value] = trimmed
  editingIndex.value = null
  input.value = ""
}

const removeChoice = (i) => {
  choices.value.splice(i, 1)
}
</script>

<style scoped>
div {
  padding: 10px 24px;
}
input {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 16px;
}

.icon-row {
  display: flex;
  gap: 6px; /* ← ボタン同士の余白 */
  align-items: center;
}
/* li を左右2カラムにする */
.choice-row,
.log-row {
  display: flex;
  align-items: center;
  gap: 12px; /* ← テキストとボタンの距離をここで調整 */
}

/* 左側のテキスト部分 */
.log-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* ボタンを横並びにする */
.icon-row {
  display: flex;
  gap: 6px;
}

.icon-btn {
  width: 36px;
  height: 32px;
  border-radius: 10px; /* 角丸四角 */
  border: none;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  line-height: 1;
  padding: 0;
}

/* 編集ボタン（✏️） */
.edit-btn {
  background: #fff7e6;
  color: #c47a00;
}

/* 保存ボタン（💾） */
.save-btn {
  background: #e6f4ff;
  color: #0066aa;
}

/* 削除ボタン（🗑） */
.delete-btn {
  background: #fdecec;
  color: #b33a3a;
}

/* hover（世界観壊さない程度に） */
.icon-btn:hover {
  opacity: 0.85;
}

button {
  border-radius: 8px;
  opacity: 0.7;
  transition: opacity 0.2s ease, transform 0.3s ease;
}
button:hover {
  opacity: 0.6;
  transform: translateY(1px);
}

.listup-container {
  max-width: 420px; /* ← タイトル画面と統一 */
  margin: 0 auto;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px; /* 全体の呼吸 */
}

.choice-row { /* 選択肢 */
  background: #f7f7f7; padding: 12px 14px; border-radius: 10px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;
}
</style>
