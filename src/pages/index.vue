<template>
  <div>
    <Masthead>
      <template #title> Annas Blooms </template>
    </Masthead>
    <section class="content-section">
      <div class="container">
        <p v-for="cat in productCategories">{{ cat?.name }}</p>
      </div>
      <div class="container m-4 grid grid-gap-2">
        <div v-for="prod in productsValue" :key="prod?.id">
          <Card :title="prod?.name" :description="prod?.slug" :image="prod?.image" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { appName, socialLinks } from '@/utils/constants.js'
import { ProductsOrderByEnum } from '#woo'
import type { ProductCategory, Product } from '../../types/index'
import { ref, onMounted } from 'vue'

const cachedProducts = ref<Product[] | null>(null)

const { data: categories } = await useAsyncGql('getProductCategories', {
  first: 6,
})
const productCategories = (categories.value?.productCategories?.nodes || []) as ProductCategory[]

const {
  execute: fetchProducts,
  data: products,
  loading,
  error,
} = useAsyncGql('getProducts', { first: 8 }, { lazy: true })

const productsValue = ref<Product[]>([])

onMounted(async () => {
  if (cachedProducts.value) {
    console.log('Using cached products')
    productsValue.value = cachedProducts.value
  } else {
    console.log('Fetching products from API')
    await fetchProducts()
    if (products.value) {
      productsValue.value = products.value?.products?.nodes || []
      // Cache the fetched data
      cachedProducts.value = productsValue.value
    }
  }
  console.log('Products Value:', productsValue.value)
})
</script>
