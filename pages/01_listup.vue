<template>
  <div class="listup-container">
    <h1>いまある選択肢</h1>

    <!-- 追加用 input -->
    <input
      v-model="input"
      @keyup.enter="addChoice"
      placeholder="選択肢を入力して Enter"
      class="add-input"
    />

    <button class="ready-btn" @click="goReflect" :disabled="choices.length < 2">
      準備できた
    </button>

    <ul class="choice-list">
      <li
        v-for="(c, i) in choices"
        :key="i"
        class="choice-row"
        :class="{ editing: editingIndex === i }"
      >
        <!-- 編集中かどうかで切り替え -->
        <template v-if="editingIndex === i">
          <input
            v-model="editValue"
            @keyup.enter="saveEdit"
            class="edit-input"
            ref="editInput"
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
          <button v-else class="icon-btn save-btn" @click="saveEdit">💾</button>

          <button class="icon-btn delete-btn" @click="removeChoice(i)">
            🗑
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
const input = ref("")
const editValue = ref("")

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

  choices.value.unshift(trimmed)
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

const goReflect = () => {
  originalChoices.value = [...choices.value]
  navigateTo("/02_reflect")
}


const editInput = ref(null)

watch(editingIndex, () => {
  nextTick(() => {
    if (editInput.value) editInput.value.focus()
  })
})
</script>

<style scoped>
/* 全体のレイアウト：縦ラインを細く、静かに */
.listup-container {
  max-width: 360px;
  margin: 0 auto;
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: center;
}

/* タイトル：声量を落とす */
.listup-container h1 {
  font-size: 18px;
  font-weight: 500;
  opacity: 0.75;
  margin-bottom: 8px;
}

/* 追加用 input */
.add-input {
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 14px;
  background: #fafafa;
  width: 100%;
  max-width: 260px;
  margin: 0 auto;
}

/* 準備できたボタン */
.ready-btn {
  width: 150px;
  margin: 0 auto;
  background: #fafafa;
  border: 1px solid #ddd;
  padding: 8px 0;
  font-size: 14px;
  border-radius: 6px;
  opacity: 0.8;
  transition: opacity 0.2s ease, transform 0.3s ease;
}

.ready-btn:hover {
  opacity: 0.6;
  transform: translateY(1px);
}

.ready-btn:disabled {
  opacity: 0.35;
  transform: none;
}

/* 選択肢リスト */
.choice-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* カード */
.choice-row {
  max-width: 240px;
  margin: 0 auto;
  width: 100%;
  background: #f9f9f9;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
}

/* 編集モード */
.choice-row.editing {
  background: #ffffff;
  border: 1px solid #ddd;
}

/* テキスト */
.choice-text {
  font-size: 14.5px;
  opacity: 0.85;
  flex: 1;
}

/* アイコン行 */
.icon-row {
  display: flex;
  gap: 4px;
}

/* アイコンボタン */
.icon-btn {
  width: 28px;
  height: 26px;
  font-size: 13px;
  border-radius: 6px;
  opacity: 0.75;
}

.icon-btn:hover {
  opacity: 0.7;
}

/* 編集ボタン */
.edit-btn {
  background: #fff7e6;
  color: #c47a00;
}

/* 保存ボタン */
.save-btn {
  background: #e6f4ff;
  color: #0066aa;
}

/* 削除ボタン */
.delete-btn {
  background: #fdecec;
  color: #b33a3a;
}
</style>
