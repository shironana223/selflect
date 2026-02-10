<template>
  <div>
    結果画面（仮）
    <button @click="goHome">ホームへ</button>
  </div>
</template>

<script setup>
const goHome = () => navigateTo('/')
</script>
