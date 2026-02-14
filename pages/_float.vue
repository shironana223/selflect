<template>
  <div class="float-screen"></div>
</template>

<script setup>
import { onMounted } from "vue"
import { navigateTo } from "#app"

onMounted(() => {
  setTimeout(() => {
    navigateTo("/02_reflect")
  }, 1600) // フェード + 静止の合計
})
</script>

<style scoped>
.float-screen {
  width: 100vw;
  height: 100vh;
  background: #ffffff;
  animation: fadeIn 0.8s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
