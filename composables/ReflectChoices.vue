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
  color: rgba(40, 50, 60, 0.75);
  cursor: pointer;
  transition: 
    color 0.2s ease,
    transform 0.2s ease,
    opacity 0.2s ease;
  line-height: 1.8;
  letter-spacing: 0.02em;

  /* ゆらぎ */
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
