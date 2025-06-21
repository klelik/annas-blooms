<template>
  <div class="masthead" :class="[{ 'has-video': videoSrc }, heightClass, alignClass]">
    <!-- Video Background -->
    <video
      v-if="videoSrc"
      class="masthead__video"
      :src="videoSrc"
      :poster="videoPoster"
      autoplay
      muted
      loop
      playsinline
    />

    <div class="container">
      <div class="masthead__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  videoSrc?: string
  videoPoster?: string
  height?: 'small' | 'medium' | 'large'
  align?: 'left' | 'center' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  height: 'large',
  align: 'center',
})

const heightClass = computed(() => {
  return `masthead--${props.height}`
})

const alignClass = computed(() => {
  return `masthead--align-${props.align}`
})
</script>
