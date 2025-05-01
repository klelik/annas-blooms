<template>
  <div class="marquee" :style="{ '--duration': duration, '--gap': gap }">
    <div
      v-for="index in repeat"
      :key="index"
      class="marquee-group animate-marquee"
      :style="{ animationDirection: reverse ? 'reverse' : 'normal' }"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    class?: string;
    reverse?: boolean;
    repeat?: number;
    duration?: string;
    gap?: string;
  }>(),
  {
    repeat: 4,
    duration: '40s',
    gap: '2rem'
  }
);
</script>
