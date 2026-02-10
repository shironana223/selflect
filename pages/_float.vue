<template>
  <div>
    漂い画面（仮）
    <button @click="goReflect">次へ</button>
  </div>
</template>

<script setup>
const goReflect = () => navigateTo('/02_reflect')
</script>
