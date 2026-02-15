<template>
  <div class="listup-container">
    <h1>選択肢を入力（仮）</h1>

    <!-- 追加用 input -->
    <input
      v-model="input"
      @keyup.enter="addChoice"
      placeholder="選択肢を入力して Enter"
      class="add-input"
    />

    <ul class="choice-list">
      <li v-for="(c, i) in choices" :key="i" class="choice-row">

        <!-- 編集中かどうかで切り替え -->
        <template v-if="editingIndex === i">
          <input
            v-model="editValue"
            @keyup.enter="saveEdit"
            class="edit-input"
          />
        </template>
        <template v-else>
          <span class="choice-text">{{ c }}</span>
        </template>

        <div class="icon-row">
          <button
            v-if="editingIndex !== i"
            class="icon-btn edit-btn"
            @click="startEdit(i)"
          >
            ✏️
          </button>
          <button
            v-else
            class="icon-btn save-btn"
            @click="saveEdit"
          >
            💾
          </button>

          <button class="icon-btn delete-btn" @click="removeChoice(i)">
            🗑
          </button>
        </div>
      </li>
    </ul>

    <button class="ready-btn" @click="goFloat">準備できた</button>
  </div>
</template>

<script setup>
const input = ref("")
const editValue = ref("") // 編集用
const choices = useState("choices", () => [])
const originalChoices = useState("originalChoices", () => [])

const editingIndex = ref(null)

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

const startEdit = (i) => {
  editingIndex.value = i
  editValue.value = choices.value[i]
}

const saveEdit = () => {
  const trimmed = editValue.value.trim()
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
  editValue.value = ""
}

const removeChoice = (i) => {
  choices.value.splice(i, 1)
}

const goFloat = () => {
  originalChoices.value = [...choices.value]
  navigateTo("/_float")
}
</script>

<style scoped>
/* 全体のレイアウト */
.listup-container {
  max-width: 420px;
  margin: 0 auto;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 追加用 input */
.add-input {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 16px;
}

/* 選択肢リスト */
.choice-list {
  display: flex;
  flex-direction: column;
  gap: 12px; /* ← カード同士の呼吸 */
}

/* カード */
.choice-row {
  background: #f7f7f7;
  padding: 14px 16px;
  border-radius: 10px;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 編集用 input（カード内） */
.edit-input {
  border: none;
  background: transparent;
  font-size: 16px;
  padding: 0;
  outline: none;
}

/* テキスト */
.choice-text {
  font-size: 16px;
}

/* アイコン行 */
.icon-row {
  display: flex;
  gap: 6px;
}

/* アイコンボタン */
.icon-btn {
  width: 36px;
  height: 32px;
  border-radius: 10px;
  border: none;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  line-height: 1;
  padding: 0;
}

.edit-btn {
  background: #fff7e6;
  color: #c47a00;
}

.save-btn {
  background: #e6f4ff;
  color: #0066aa;
}

.delete-btn {
  background: #fdecec;
  color: #b33a3a;
}

.icon-btn:hover {
  opacity: 0.85;
}

/* 準備できたボタン */
.ready-btn {
  background: none;
  border: 1px solid #ddd;
  padding: 10px 0;
  font-size: 16px;
  border-radius: 8px;
  opacity: 0.7;
  transition: opacity 0.2s ease, transform 0.3s ease;
}

.ready-btn:hover {
  opacity: 0.6;
  transform: translateY(1px);
}
</style>
