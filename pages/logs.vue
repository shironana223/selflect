<template>
  <div class="logs-page">
    <h1>選んだ瞬間たち</h1>

    <div v-if="loading">読み込み中…</div>

    <transition-group name="list" tag="ul">
  <li
    v-for="log in logs"
    :key="log.id"
    :id="`log-${log.id}`"
    v-show="!log.deleted"
  >
<strong>{{ log.choice }}</strong>

<!-- メモ表示 or 編集 -->
<div v-if="editingId !== log.id" class="memo">
  {{ log.memo }}
</div>
<input
  v-else
  v-model="editMemo"
  class="memo-edit-input"
/>

<div class="date">{{ formatDate(log.date) }}</div>

<!-- 編集ボタン or 保存ボタン -->
<button v-if="editingId !== log.id" @click="startEdit(log)">
  ✏️
</button>
<button v-else @click="saveEdit(log.id)">
  💾
</button>

<button class="delete-btn" @click="deleteLog(log.id)">
  手放す
</button>

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
const loading = ref(true)

onMounted(async () => {
  const { data, error } = await supabase
    .from("logs")
    .select("*")
    .order("date", { ascending: false })

  if (!error) {
    logs.value = data.map((log) => ({ ...log, deleted: false }))
  }

  loading.value = false

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
.list-move { transition: transform 0.4s ease; }

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

.delete-btn {
  margin-top: 10px;
  background: #f5e6e6;
  color: #a33;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.delete-btn:hover {
  background: #f2dada;
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
</style>
