<template>
  <div>
    ホーム画面（仮）
    <button @click="goListup">はじめる</button>
  </div>
</template>

<script setup>
const goListup = () => navigateTo('/01_listup')
</script>
