<template>
  <div class="choices">
    <div
      v-for="(choice, index) in choices"
      :key="index"
      class="floating-text"
    >
      {{ choice }}
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const props = defineProps({
  choices: Array
})

// ▼ ランダム位置 & ゆらぎのための乱数を仕込む
onMounted(() => {
  document.querySelectorAll('.floating-text').forEach(el => {
    el.style.setProperty('--x', Math.random())      // 横位置
    el.style.setProperty('--y', Math.random())      // 縦位置
    el.style.setProperty('--rand', Math.random())   // ゆらぎ
  })
})
</script>

<style>
/* ▼ 背景レイヤー全体 */
.choices {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}


/* ▼ 漂う選択肢（背景） */
.floating-text {
  position: absolute;
  left: calc(100% * var(--x));
  top: calc(100% * var(--y));

  font-size: 22px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.18); /* 霧の奥の色 */
  filter: blur(0.5px);
  white-space: nowrap;

  animation: drift 6s ease-in-out infinite;
  z-index: 1;
}

/* ▼ ゆらぎアニメーション */
@keyframes drift {
  0% {
    transform: translateY(calc(-10px * var(--rand)));
    opacity: 0.7;
  }
  50% {
    transform: translateY(calc(10px * var(--rand)));
    opacity: 1;
  }
  100% {
    transform: translateY(calc(-10px * var(--rand)));
    opacity: 0.7;
  }
}
</style>
