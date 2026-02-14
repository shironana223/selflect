<template>
  <div class="logs-page">
    <h1>選んだ瞬間たち</h1>

<!-- 読み込み前は何も出さない（空白） -->
<div v-if="!loaded"></div>

<!-- 読み込み後に空なら表示 -->
<div v-else-if="logs.length === 0" class="empty-message">
  まだ、ページは白いままです
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
import { useSupabase } from "~/composables/useSupabase"

const supabase = useSupabase()

const router = useRouter()
const logs = ref([])
const loaded = ref(false)

onMounted(async () => {
  const { data, error } = await supabase
    .from("logs")
    .select("*")
    .order("date", { ascending: false })

  if (!error) {
    logs.value = data.map((log) => ({ ...log, deleted: false }))
  }

  loaded.value = true

  console.log("raw data:", data)
})

const deleteLog = async (id) => {
  const ok = confirm("この選択を手放しますか？")
  if (!ok) return

  const el = document.getElementById(`log-${id}`)
  if (el) el.classList.add("fade-out")

  setTimeout(async () => {
    const { error } = await supabase.from("logs").delete().eq("id", id)

    if (error) {
      console.error("削除エラー:", error)
      alert("削除に失敗しました")
      return
    }

    const target = logs.value.find((log) => log.id === id)
    if (target) target.deleted = true
  }, 400)
}

const editingId = ref(null)
const editMemo = ref("")

const startEdit = (log) => {
  editingId.value = log.id
  editMemo.value = log.memo ?? ""
}

const saveEdit = async (id) => {
  const { error } = await supabase
    .from("logs")
    .update({ memo: editMemo.value })
    .eq("id", id)

  if (error) {
    alert("保存に失敗しました")
    return
  }

  // ローカルの logs も更新
  const target = logs.value.find((l) => l.id === id)
  if (target) target.memo = editMemo.value

  editingId.value = null
  editMemo.value = ""

  alert("この瞬間を少し整えました")
}

const goHome = () => {
  router.push("/")
}

const formatDate = (date) => {
  return new Date(date).toLocaleString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}


</script>

<style scoped>
.list-move {
  transition: transform 0.4s ease;
}

.logs-page {
  padding: 20px;
}

ul {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

li {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  transition: all 0.4s ease;
}

.memo {
  margin-top: 6px;
  color: #555;
}

.date {
  margin-top: 4px;
  font-size: 12px;
  color: #888;
}

.home-btn {
  margin-top: 24px;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  background: #eee;
  cursor: pointer;
}

.fade-out {
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.4s ease, transform 0.4s ease;
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

.icon-row {
  display: flex;
  gap: 6px; /* ← ボタン同士の余白 */
  align-items: center;
}
</style>
