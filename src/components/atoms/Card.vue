<template>
  <NuxtLink v-if="link" :to="processedLink" class="card">
    <div class="card__head card-overlay">
      <div class="card__image">
        <NuxtImg
          v-if="image"
          :src="image.src"
          :alt="image.alt"
          :width="image.width"
          :height="image.height"
          class=""
        />
      </div>
    </div>
    <div class="card__body">
      <div class="flow flow-gap-1">
        <div class="flex" data-repel>
          <div class="flow flow-gap-05">
            <h3 v-if="title" class="card__title ts-heading-5 font-primary">{{ title }}</h3>
          </div>
          <div v-if="onSale" class="card__sale-badge">On Sale</div>
        </div>
        <div v-if="hasValidPrice" :class="[{ 'flex flex-gap-1': onSale }]">
          <div class="flex flex-gap-05">
            <span v-if="isPriceRange(onSale ? salePrice : price)" class="from-text">From </span>
            <span v-if="onSale" class="card__price--sale"> £{{ getMinimumPrice(salePrice) }} </span>
          </div>

          <span v-if="onSale" class="card__price--regular">
            £{{ getMinimumPrice(regularPrice) }}
          </span>

          <span v-if="!onSale" class="card__price--current"> £{{ getMinimumPrice(price) }} </span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
<style scoped lang="scss"></style>

<script setup lang="ts">
import type { Card } from '~/types'
import type { AddToCartInput } from '#gql'
import { useCartStore } from '~/stores/cart'

const props = defineProps<Card>()
const cartStore = useCartStore()

const isAddingToCart = ref(false)

const createAddToCartInput = (): AddToCartInput => {
  return {
    productId: props.product?.databaseId || 0,
    quantity: 1,
  }
}

// Handle add to cart with proper error handling
const handleAddToCart = async () => {
  if (!props.product?.databaseId) {
    console.error('No product ID available')
    return
  }

  try {
    isAddingToCart.value = true
    const input = createAddToCartInput()
    console.log('Add to Cart Input:', input)

    await cartStore.addToCart(input)
    console.log('Successfully added to cart')
  } catch (error) {
    console.error('Failed to add to cart:', error)
  } finally {
    isAddingToCart.value = false
  }
}

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
