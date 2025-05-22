<template>
  <NuxtLink v-if="link" :to="processedLink" class="flow card-wrapper">
    <div class="card flower-card">
      <NuxtImg
        v-if="image"
        :src="image.src"
        :alt="image.alt"
        :width="image.width"
        :height="image.height"
        class="card__image"
      />
      <button class="cta">Add to Cart</button>
    </div>

    <div class="flow flow-gap-1">
      <div class="flex" data-center>
        <div class="flow flow-gap-05">
          <div v-if="onSale" class="card__sale-badge">On Sale</div>

          <h5 v-if="title" class="card__title">{{ title }}</h5>
        </div>
      </div>
      <div v-if="hasValidPrice" class="card__price">
        <div>
          <span v-if="isPriceRange(onSale ? salePrice : price)" class="from-text">From </span>
          <span v-if="onSale" class="card__price--sale"> £{{ getMinimumPrice(salePrice) }} </span>
        </div>

        <span v-if="!onSale" class="card__price--current"> £{{ getMinimumPrice(price) }} </span>

        <span v-if="onSale" class="card__price--regular">
          £{{ getMinimumPrice(regularPrice) }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Card } from '~/types'

const props = defineProps<Card>()
console.log('Card Props:', props)

const processedLink = computed(() => {
  if (!props.link) return '#'

  if (typeof props.link === 'object') {
    if (props.link.name === 'product-slug') {
      return {
        name: props.link.name,
        params: { slug: props.link.url || props.description },
      }
    }
    return props.link
  }

  return props.link
})

// Utility function to extract minimum price from price string
const getMinimumPrice = (priceString: string | null | undefined): string | null => {
  if (!priceString) return null

  const cleanPrice = priceString.replace(/[£$€¥₹]/g, '').trim()

  if (cleanPrice.includes(' - ')) {
    const [minPrice] = cleanPrice.split(' - ')
    const parsed = parseFloat(minPrice.replace(/,/g, ''))
    return parsed && parsed > 0 ? parsed.toFixed(2) : null
  }

  const parsed = parseFloat(cleanPrice.replace(/,/g, ''))
  return parsed && parsed > 0 ? parsed.toFixed(2) : null
}

const isPriceRange = (priceString: string | null | undefined): boolean => {
  return priceString?.includes(' - ') || false
}

const hasValidPrice = computed(() => {
  if (props.onSale) {
    return getMinimumPrice(props.salePrice) !== null
  }
  return getMinimumPrice(props.price) !== null
})
</script>
