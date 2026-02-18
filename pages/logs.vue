<template>
  <div class="logs-page">
    <h1>選んだ瞬間たち</h1>

<!-- 読み込み前は何も出さない（空白） -->
<div v-if="!loaded"></div>

<!-- 読み込み後に空なら表示 -->
<div v-else-if="logs.length === 0" class="empty-message">
  まだ記録された瞬間はありません
</div>

<!-- 読み込み後にログがあれば表示 -->
<transition-group v-else name="list" tag="ul">

      <li v-for="log in logs" :key="log.id" class="log-row">
        <div class="log-main">
          <strong>{{ log.choice }}</strong>

          <div v-if="editingId !== log.id" class="memo">{{ log.memo }}</div>
          <input v-else v-model="editMemo" class="memo-edit-input" />

          <div class="date">{{ formatDate(log.date) }}</div>
        </div>

        <!-- アイコン行は li の中に入れる -->
        <div class="icon-row">
          <button
            v-if="editingId !== log.id"
            class="icon-btn edit-btn"
            @click="startEdit(log)"
          >
            ✏️
          </button>

          <button v-else class="icon-btn save-btn" @click="saveEdit(log.id)">
            💾
          </button>

          <button class="icon-btn delete-btn" @click="deleteLog(log.id)">
            🗑
          </button>
        </div>
      </li>
    </transition-group>

    <button class="home-btn" @click="goHome">ホームに戻る</button>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const logs = ref([])
const loaded = ref(false)

onMounted(() => {
  logs.value = JSON.parse(localStorage.getItem("selflect_logs") || "[]")
  loaded.value = true
})

/* 編集 */
const editingId = ref(null)
const editMemo = ref("")

const startEdit = (log) => {
  editingId.value = log.id
  editMemo.value = log.memo ?? ""
}

const saveEdit = (id) => {
  const updated = logs.value.map((log) =>
    log.id === id ? { ...log, memo: editMemo.value } : log
  )

  logs.value = updated
  localStorage.setItem("selflect_logs", JSON.stringify(updated))

  editingId.value = null
  editMemo.value = ""
}

/* 削除 */
const deleteLog = (id) => {
  const ok = confirm("この選択を手放しますか？")
  if (!ok) return

  logs.value = logs.value.filter((log) => log.id !== id)
  localStorage.setItem("selflect_logs", JSON.stringify(logs.value))
}

/* 日付 */
const formatDate = (date) => {
  return new Date(date).toLocaleString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

const goHome = () => {
  router.push("/")
}
</script>



<style scoped>
.list-move {
  transition: transform 0.4s ease;
}

/* ▼ 全体の縦ラインを細くして中央へ */
.logs-page {
  padding: 28px 20px;
  max-width: 360px;   /* ← 画面中央に細い縦ライン */
  margin: 0 auto;
}

/* ▼ タイトルの声量を落とす */
.logs-page h1 {
  font-size: 18px;
  font-weight: 500;
  opacity: 0.75;
  margin-bottom: 20px;
}

ul {
  width: 100%; /* ← これが決定打！ */
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 0;
  align-items: flex-start;
}


.log-row {
  max-width: 260px;
  width: 100%;
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px 14px;

  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 12px;
}


/* ▼ 左側のテキスト部分 */
.log-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
}

/* ▼ 選んだもの */
.log-main strong {
  font-size: 15px;
  opacity: 0.9;
}

/* ▼ メモ */
.memo {
  font-size: 13px;
  opacity: 0.75;
}

/* ▼ メモ編集 */
.memo-edit-input {
  font-size: 13px;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #fff;
}

/* ▼ 日付 */
.date {
  font-size: 12px;
  opacity: 0.55;
}

/* ▼ アイコン行（右側の圧を弱める） */
.icon-row {
  display: flex;
  flex-direction: column; /* ← 縦並びにして右重心を消す */
  gap: 6px;
  align-items: center;
}

/* ▼ アイコンボタン（小さく・控えめに） */
.icon-btn {
  width: 28px;     /* ← 小さく */
  height: 26px;
  border-radius: 6px;
  font-size: 13px;
  opacity: 0.75;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.icon-btn:hover {
  opacity: 0.6;
}

/* ▼ 色はそのまま */
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

/* ▼ ホームボタンも控えめに */
.home-btn {
  margin-top: 32px;
  padding: 8px 14px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #fafafa;
  opacity: 0.8;
}

.home-btn:hover {
  opacity: 0.6;
}

/* ▼ 削除フェード */
.fade-out {
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}
</style>
