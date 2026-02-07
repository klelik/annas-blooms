<template>
  <div class="similar-products-carousel">
    <swiper
      :slides-per-view="slidesPerView"
      :space-between="spaceBetween"
      :navigation="navigationOptions"
      :pagination="paginationOptions"
      :breakpoints="breakpoints"
      :modules="modules"
      class="products-swiper"
    >
      <swiper-slide v-for="prod in products" :key="prod?.id">
        <Card
          :title="prod?.title"
          :description="prod?.slug"
          :image="getImage(prod?.image)"
          :on-sale="prod.onSale"
          :regular-price="prod.regularPrice"
          :sale-price="prod.salePrice"
          :price="prod.price"
          :average-rating="prod.averageRating"
          :type="prod.type"
          :link="{
            name: 'product-slug',
            params: { slug: prod?.slug },
            target: '_self',
          }"
          class="card"
          :product="prod"
        />
      </swiper-slide>

      <!-- Navigation buttons -->
      <div class="swiper-button-prev similar-prev" />
      <div class="swiper-button-next similar-next" />
    </swiper>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { getImage } from '~/utils/helpers'

interface Props {
  products: any[]
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Similar Products',
})

const modules = [Navigation, Pagination, Autoplay]

// Responsive configuration
const slidesPerView = ref(1.2)
const spaceBetween = ref(16)

const breakpoints = {
  480: {
    slidesPerView: 2,
    spaceBetween: 20,
  },
  768: {
    slidesPerView: 3,
    spaceBetween: 24,
  },
  1024: {
    slidesPerView: 4,
    spaceBetween: 32,
  },
  1280: {
    slidesPerView: 5,
    spaceBetween: 32,
  },
}

const navigationOptions = {
  nextEl: '.similar-next',
  prevEl: '.similar-prev',
}

const paginationOptions = {
  clickable: true,
  dynamicBullets: true,
}
</script>

<style scoped lang="scss">
@import 'assets/scss/utilities/mixin';

.similar-products-carousel {
  position: relative;
  width: 100%;
  overflow: hidden;

  .products-swiper {
    overflow: visible;
    padding-bottom: var(--space-4);

    @include breakpoint(md, max) {
      overflow: hidden;
    }

    // Make swiper slides full height
    :deep(.swiper-wrapper) {
      align-items: stretch;
    }

    :deep(.swiper-slide) {
      height: auto;
      display: flex;
      flex-direction: column;
    }
  }

  // Navigation buttons
  :deep(.swiper-button-prev),
  :deep(.swiper-button-next) {
    color: var(--c-main-color);
    background: var(--bg-color);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));

    &::after {
      font-size: 18px;
      font-weight: 600;
    }

    &:hover {
      background: var(--c-main-color);
      color: white;
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }

    &.swiper-button-disabled {
      opacity: 0.3;
      cursor: not-allowed;

      &:hover {
        background: var(--bg-color);
        color: var(--c-main-color);
        transform: none;
      }
    }
  }

  :deep(.swiper-button-prev) {
    left: var(--space-1);

    @include breakpoint(md, max) {
      display: none;
    }
  }

  :deep(.swiper-button-next) {
    right: var(--space-1);

    @include breakpoint(md, max) {
      display: none;
    }
  }

  // Pagination dots
  :deep(.swiper-pagination) {
    bottom: 0;

    .swiper-pagination-bullet {
      background: var(--c-grey-light);
      opacity: 1;
      transition: all 0.3s ease;

      &.swiper-pagination-bullet-active {
        background: var(--c-main-color);
        transform: scale(1.2);
      }
    }

    @include breakpoint(md, min) {
      display: none;
    }
  }

  // Card spacing adjustments
  :deep(.card) {
    height: 100%;
    margin: 0;
    display: flex;
    flex-direction: column;
  }
}
</style>
