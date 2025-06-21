<template>
  <div>
    <Masthead
      video-src="//cdn2.editmysite.com/videos/landing-pages/global/home/masthead/masthead-720.mp4"
      video-poster="//cdn2.editmysite.com/images/landing-pages/global/home/masthead/poster.jpg"
      align="left"
      height=""
    >
      <div class="flow">
        <h1>Celebrating life's moments with flowers</h1>
        <p>Elevate everyday moments</p>
        <button class="cta" primary>Shop Now</button>
      </div>
    </Masthead>
    <section class="content-section">
      <div class="container">
        <p v-for="cat in productCategories">{{ cat?.name }}</p>

        <SectionHeader :alignment="'left'" class="mb-3">
          <template #tag>
            <div
              class="flex flex-gap-1"
              data-aos="fade-up"
              data-aos-delay="100"
              data-aos-once="true"
            >
              Popular
            </div>
          </template>
          <template #title>
            <h2 class="">
              Discover<br />
              Our Finest Collection
            </h2>
          </template>
          <!-- <template #description> For lifelasting memories. </template> -->
          <template #link>
            <!-- <NuxtLink
              :to="{ name: 'product-category', params: { slug: 'about' } }"
              class="link-cta"
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-once="true"
            >
              Test
            </NuxtLink> -->
            <button class="cta" secondary>See All Collection</button>
            <!-- <Arrow class="arrow-cta-highlighted slim" /> -->
          </template>
        </SectionHeader>
        <div class="container mt-4 featured-products-wrapper">
          <Card
            v-for="prod in productsValue"
            :key="prod?.id"
            :title="prod?.name"
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
            :product="prod"
          />
        </div>
      </div>
    </section>
    <section class="content-section">
      <div class="container">Cart: {{ cart.cart }}</div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { appName, socialLinks } from '@/utils/constants.js'
import { ProductsOrderByEnum } from '#woo'
import type { ProductCategory, Image } from '../../types/index'
import type { Product } from '~/types'
import { useCartStore } from '~/stores/cart'

const cart = useCartStore()
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

const getImage = (image: any): Image | null => {
  if (!image) return null

  return {
    src: image?.producCardSourceUrl || image?.sourceUrl || '',
    alt: image?.altText || image?.title || '',
    width: 500,
    height: 500,
  }
}
</script>
