<template>
  <div class="masthead" :class="[heightClass, alignClass]">
    <!-- Video Background Component -->
    <VideoBackground
      v-if="videoSrc"
      :src="videoSrc"
      :poster="videoPoster"
      :show-controls="showVideoControls"
      @loaded="onVideoLoaded"
      @error="onVideoError"
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
  showVideoControls?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: 'large',
  align: 'center',
  showVideoControls: true,
})

const emit = defineEmits(['video-loaded', 'video-error'])

const heightClass = computed(() => {
  return `masthead--${props.height}`
})

const alignClass = computed(() => {
  return `masthead--align-${props.align}`
})

const onVideoLoaded = () => {
  emit('video-loaded')
}

const onVideoError = (error: Event) => {
  emit('video-error', error)
}
</script>
