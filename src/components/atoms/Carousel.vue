<template>
  <div class="product-gallery">
    <div class="gallery-wrapper">
      <!-- Thumbnail -->
      <swiper
        ref="galleryThumbs"
        :space-between="8"
        :slides-per-view="thumbsSlidesPerView"
        :direction="thumbsDirection"
        :watchlides-progress="true"
        :free-mode="true"
        :modules="modules"
        class="gallery-thumbs"
        @swiper="setThumbsSwiper"
        @click="onThumbClick"
      >
        <swiper-slide v-for="(image, index) in images" :key="`thumb-${index}`">
          <div class="thumb-content">
            <NuxtImg
              :src="image"
              :alt="`${alt || 'Product'} - Thumbnail ${index + 1}`"
              class="thumb-image"
              loading="lazy"
              :placeholder="20"
            />
          </div>
        </swiper-slide>
      </swiper>

      <!-- Main -->
      <swiper
        ref="galleryTop"
        :space-between="0"
        :loop="images.length > 1"
        :navigation="navigationOptions"
        :thumbs="{ swiper: thumbsSwiper }"
        :modules="modules"
        :auto-height="false"
        class="gallery-main"
        @slide-change="onMainSlideChange"
      >
        <swiper-slide v-for="(image, index) in images" :key="`main-${index}`">
          <div class="slide-content">
            <div class="image-container">
              <NuxtImg
                :src="image"
                :alt="`${alt || 'Product'} - Image ${index + 1}`"
                class="slide-image"
                loading="lazy"
                :placeholder="20"
                @error="onImageError($event, index, 'main')"
              />
            </div>
          </div>
        </swiper-slide>

        <div v-if="images.length > 1" class="swiper-button-prev"></div>
        <div v-if="images.length > 1" class="swiper-button-next"></div>
      </swiper>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Thumbs, FreeMode } from 'swiper'
import type { Swiper as SwiperType } from 'swiper'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'
import { useDebounceFn } from '@vueuse/core'

//=============================
// PROPS & EMITS
//=============================
interface Props {
  images: string[]
  alt?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const MOBILE_BREAKPOINT = 768
const THUMB_BREAKPOINT = 576

const modules = [Navigation, Thumbs, FreeMode]

//=============================
// REFS
//=============================
const galleryTop = ref<{ $el: HTMLElement; swiper: SwiperType } | null>(null)
const galleryThumbs = ref<{ $el: HTMLElement; swiper: SwiperType } | null>(null)
const thumbsSwiper = ref<SwiperType | null>(null)
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

//=============================
// COMPUTED
//=============================
const thumbsDirection = computed(() => {
  return windowWidth.value >= THUMB_BREAKPOINT ? 'vertical' : 'horizontal'
})

const thumbsSlidesPerView = computed(() => {
  if (windowWidth.value < THUMB_BREAKPOINT) return 4
  if (windowWidth.value < MOBILE_BREAKPOINT) return 5
  return 6
})

const navigationOptions = computed(() => {
  return images.value.length > 1
    ? {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
    : false
})

const images = computed(() => props.images.filter(Boolean))

//=============================
// HANDLERS
//=============================
const setThumbsSwiper = (swiper: SwiperType) => {
  thumbsSwiper.value = swiper
}

const onMainSlideChange = () => {
  if (galleryTop.value?.swiper && thumbsSwiper.value) {
    const activeIndex = galleryTop.value.swiper.activeIndex
    thumbsSwiper.value.slideTo(activeIndex)
  }
}

const onThumbClick = (swiper: SwiperType) => {
  if (galleryTop.value?.swiper && typeof swiper.clickedIndex === 'number') {
    galleryTop.value.swiper.slideTo(swiper.clickedIndex)
  }
}

const updateThumbsDirection = () => {
  const newDirection = window.innerWidth >= THUMB_BREAKPOINT ? 'vertical' : 'horizontal'
  if (thumbsSwiper.value && thumbsSwiper.value.params.direction !== newDirection) {
    thumbsSwiper.value.changeDirection(newDirection)
  }
}

//=============================
// LIFECYCLE HOOKS
//=============================
onMounted(() => {
  if (typeof window !== 'undefined') {
    //Debounce to prevent continuously firing event
    window.addEventListener('resize', useDebounceFn(updateThumbsDirection, 250))
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateThumbsDirection)
  }
})
</script>

<style scoped lang="scss">
@import 'assets/scss/utilities/mixin';

.product-gallery {
  width: 100%;
  position: relative;
  overflow: hidden;
}

.gallery-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  width: 100%;

  @include breakpoint(sm) {
    flex-direction: row;
    height: 500px;
  }

  @include breakpoint(lg) {
    height: 600px;
  }
}

.gallery-thumbs {
  order: 2;
  width: 100%;

  @include breakpoint(sm) {
    order: 1;
    width: var(--space-9);
    height: 100%;
  }

  @include breakpoint(lg) {
    width: 120px;
  }

  :deep(.swiper-wrapper) {
    @include breakpoint(sm) {
      flex-direction: column !important;
    }
  }

  :deep(.swiper-slide) {
    height: var(--space-6);
    opacity: 0.6;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;
    border-radius: var(--radius-small);
    overflow: hidden;

    @include breakpoint(sm) {
      height: var(--space-8);
    }

    @include breakpoint(md) {
      height: var(--space-9);
    }

    &:hover {
      opacity: 0.9;
    }

    &.swiper-slide-thumb-active {
      opacity: 1;
      border-color: var(--c-main-color, #333);
    }
  }

  .thumb-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(160deg, #f1ebe6 0%, #ebe4df 40%, #f3f1ec 100%);
    padding: 0.25rem;

    @include breakpoint(sm) {
      padding: var(--space-1);
    }
  }

  .thumb-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

// Main gallery
.gallery-main {
  order: 1;
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: var(--radius-small);

  @include breakpoint(sm) {
    order: 2;
    flex: 1;
    height: 100%;
  }

  .slide-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(160deg, #f1ebe6 0%, #ebe4df 40%, #f3f1ec 100%);
    padding: 1.5rem;

    @include breakpoint(md) {
      padding: 2rem;
    }

    @include breakpoint(lg) {
      padding: 2.5rem;
    }
  }

  .image-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .slide-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    max-width: 100%;
    max-height: 100%;
  }
}

// Navigation buttons
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: var(--c-main-color);
  background: rgba(255, 255, 255, 0.95);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &::after {
    font-size: 18px;
    font-weight: bold;
  }

  &:hover {
    background: white;
    transform: scale(1.1);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  @include breakpoint(md, max) {
    width: 36px;
    height: 36px;

    &::after {
      font-size: 16px;
    }
  }
}

@include breakpoint(sm, max) {
  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    display: none;
  }
}
</style>
