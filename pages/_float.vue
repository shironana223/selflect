<template>
<div class="selflect-bg">
  <ReflectChoices :choices="choices" />
  <div class="foreground">
  <div class="float-container">
    <div
      v-for="(c, i) in choices"
      :key="i"
      class="float-item"
      :style="randomStyle(i)"
    >
      {{ c }}
    </div>

    <button class="next-btn" @click="goReflect">はじめる</button>
  </div>
  </div>
</div>

</template>

<script setup>
const choices = useState("choices")

const goReflect = () => navigateTo("/02_reflect")

// ランダム位置を生成
const randomStyle = (i) => {
  const top = Math.random() * 60 + 10 // 10〜70%
  const left = Math.random() * 60 + 10 // 10〜70%
  const delay = Math.random() * 2 // 0〜2秒

  return {
    top: `${top}%`,
    left: `${left}%`,
    animationDelay: `${delay}s`
  }
}
</script>

<style scoped>
.selflect-bg {
  position: relative;
}

ReflectChoices {
  position: absolute;
  inset: 0;
  z-index: 1; /* 背景 */
}

.foreground {
  position: relative;
  z-index: 2; /* 前景 */
}

.float-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.float-item {
  position: absolute;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  animation: float 3s ease-in-out infinite alternate;
  opacity: 0.8;
}

@keyframes float {
  0% {
    transform: translateY(0px);
    opacity: 0.8;
  }
  100% {
    transform: translateY(-20px);
    opacity: 1;
  }
}

.next-btn {
  position: absolute;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
