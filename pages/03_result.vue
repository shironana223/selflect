<template>
  <div class="result-container">
    <h1>Result（仮）</h1>

    <p>あなたが選んだもの：</p>
    <h2>{{ finalChoice }}</h2>

    <textarea
      v-model="memo"
      placeholder="ひとことメモ（任意）"
      class="memo-area"
    ></textarea>

    <button @click="saveAndHome">保存してホームへ戻る</button>
  </div>
</template>

<script setup>
const choices = useState('choices')
const memo = ref('')
const supabase = useSupabase()

const finalChoice = computed(() => choices.value[0])

console.log("Result画面に来たよ")
console.log("choices:", choices.value)
console.log("finalChoice:", finalChoice.value)


const saveAndHome = async () => {
  const { error } = await supabase
    .from('selflect_logs')
    .insert({
      choice: finalChoice.value,
      memo: memo.value,
      created_at: new Date()
    })

  if (error) {
    console.error('保存エラー:', error)
  }

  choices.value = []
  memo.value = ''

  navigateTo('/')
}
</script>

<style scoped>
.result-container {
  padding: 20px;
}

.memo-area {
  width: 100%;
  height: 120px;
  margin-top: 20px;
  padding: 10px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
}
</style>
