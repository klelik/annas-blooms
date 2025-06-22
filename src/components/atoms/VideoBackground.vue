<template>
  <div class="video-background">
    <!-- Video -->
    <video
      ref="videoElement"
      class="video-background__video"
      :src="src"
      :poster="poster"
      autoplay
      muted
      loop
      playsinline
      @loadeddata="onVideoLoaded"
      @error="onVideoError"
    />

    <!-- Controls -->
    <div class="video-background__controls">
      <button
        class="video-control-btn"
        :class="{ active: !isPaused }"
        @click="togglePlay"
        :aria-label="isPaused ? 'Play video' : 'Pause video'"
      >
        <svg v-if="isPaused" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M6 4H10V20H6V4ZM14 4H18V20H14V4Z" fill="currentColor" />
        </svg>
      </button>

      <button
        class="video-control-btn"
        :class="{ active: !isMuted }"
        @click="toggleMute"
        :aria-label="isMuted ? 'Unmute video' : 'Mute video'"
      >
        <svg v-if="isMuted" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M3.63 3.63C3.24 4.02 3.24 4.65 3.63 5.04L7.29 8.7L7 9H4C3.45 9 3 9.45 3 10V14C3 14.55 3.45 15 4 15H7L10.29 18.29C10.92 18.92 12 18.47 12 17.58V13.41L16.18 17.59C15.69 17.96 15.16 18.27 14.58 18.5C14.22 18.65 14 19.03 14 19.42C14 20.14 14.73 20.6 15.39 20.33C16.19 20 16.94 19.56 17.61 19.02L18.95 20.36C19.34 20.75 19.97 20.75 20.36 20.36C20.75 19.97 20.75 19.34 20.36 18.95L5.05 3.63C4.66 3.24 4.03 3.24 3.63 3.63ZM19 12C19 12.82 18.85 13.61 18.59 14.34L20.12 15.87C20.68 14.7 21 13.39 21 12C21 8.17 18.6 4.89 15.22 3.6C14.63 3.37 14 3.83 14 4.46V4.65C14 5.03 14.25 5.36 14.61 5.5C17.18 6.54 19 9.06 19 12ZM10.29 5.71L10.12 5.88L12 7.76V6.42C12 5.53 10.92 5.08 10.29 5.71ZM16.5 12C16.5 10.23 15.48 8.71 14 7.97V9.76L16.48 12.24C16.49 12.16 16.5 12.08 16.5 12Z"
            fill="currentColor"
          />
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 9V15H7L12 20V4L7 9H3ZM16.5 12C16.5 10.23 15.48 8.71 14 7.97V16.02C15.48 15.29 16.5 13.77 16.5 12ZM14 3.23V5.29C16.89 6.15 19 8.83 19 12C19 15.17 16.89 17.85 14 18.71V20.77C18.01 19.86 21 16.28 21 12C21 7.72 18.01 4.14 14 3.23Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  src: string
  poster?: string
  showControls?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  poster: '',
  showControls: true,
})

const emit = defineEmits(['loaded', 'error'])

const videoElement = ref<HTMLVideoElement | null>(null)
const isPaused = ref(false)
const isMuted = ref(true)
const isLoaded = ref(false)

const togglePlay = () => {
  if (videoElement.value) {
    if (isPaused.value) {
      videoElement.value.play()
      isPaused.value = false
    } else {
      videoElement.value.pause()
      isPaused.value = true
    }
  }
}

const toggleMute = () => {
  if (videoElement.value) {
    videoElement.value.muted = !videoElement.value.muted
    isMuted.value = videoElement.value.muted
  }
}

const onVideoLoaded = () => {
  isLoaded.value = true
  emit('loaded')
}

const onVideoError = (error: Event) => {
  console.warn('Video failed to load:', error)
  emit('error', error)
}

//for performance
onMounted(() => {
  if (videoElement.value) {
    // event listeners
    videoElement.value.addEventListener('play', () => {
      isPaused.value = false
    })

    videoElement.value.addEventListener('pause', () => {
      isPaused.value = true
    })

    videoElement.value.addEventListener('volumechange', () => {
      isMuted.value = videoElement.value?.muted || false
    })

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!isPaused.value) {
            videoElement.value?.play()
          }
        } else {
          videoElement.value?.pause()
        }
      })
    })

    observer.observe(videoElement.value)

    onUnmounted(() => {
      observer.disconnect()
      if (videoElement.value) {
        videoElement.value.removeEventListener('play', () => {})
        videoElement.value.removeEventListener('pause', () => {})
        videoElement.value.removeEventListener('volumechange', () => {})
      }
    })
  }
})
</script>

<style scoped>
.video-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.video-background__video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.video-background__controls {
  position: absolute;
  top: 5rem;
  right: 1rem;
  z-index: 3;
  display: flex;
  gap: 0.5rem;
}

.video-control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(0, 0, 0, 0.7);
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.05);
  }

  &.active {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
  }

  svg {
    flex-shrink: 0;
  }
}

@media (max-width: 768px) {
  .video-background__controls {
    bottom: 5rem;
    right: 1rem;
    top: auto;
  }

  .video-control-btn {
    width: 36px;
    height: 36px;
  }
}
</style>
