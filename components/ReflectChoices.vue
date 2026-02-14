<template>
  <div class="choices">
    <div
      v-for="(choice, index) in choices"
      :key="index"
      class="floating-text"
      @click="select(choice)"
    >
      {{ choice }}
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const props = defineProps({
  choices: Array,
  select: Function
})

// ▼ 浮遊テキストの“ゆらぎ”を仕込む
onMounted(() => {
  document.querySelectorAll('.floating-text').forEach(el => {
    el.style.setProperty('--rand', Math.random());
  });
});
</script>

<style scoped>
.choices {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 40px 0;
  align-items: center;
}

/* 浮遊テキスト */
.floating-text {
  font-size: 20px;
  font-weight: 300;
  color: rgba(40, 50, 60, 0.35); /* ← 75% → 35% に変更 */
  pointer-events: none; /* ← クリック無効化（背景化） */
  transition: opacity 0.2s ease;
  position: relative;
  top: calc(-4px + (8px * var(--rand, 0)));
}


.floating-text:hover {
  color: rgba(40, 50, 60, 0.95);
  transform: translateY(-2px);
  opacity: 1;
}

.floating-text:active {
  transform: scale(1.03);
  color: rgba(40, 50, 60, 1);
}
</style>
