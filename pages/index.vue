<template>
  <div>
    ホーム画面（仮）
    <button @click="goListup">はじめる</button>
  </div>
<NuxtLink to="/04_logs">ログを見る</NuxtLink>


</template>

<script setup>
const goListup = () => navigateTo('/01_listup')
</script>
