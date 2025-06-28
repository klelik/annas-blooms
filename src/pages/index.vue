<template>
  <div>
    <Masthead
      video-src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      video-poster="//cdn2.editmysite.com/images/landing-pages/global/home/masthead/poster.jpg"
      align="left"
      height="large"
    >
      <div class="flow">
        <h1>Celebrating life's moments with flowers</h1>
        <p>Elevate everyday moments</p>
        <button class="cta" primary>Shop Now</button>
      </div>
    </Masthead>
    <section class="content-section">
      <div class="container">
        <!-- <p v-for="cat in productCategories">{{ cat?.name }}</p> -->

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
        <div class="mt-4 grid grid-gap-2">
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
            class="card"
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
import type { ProductCategory } from '../../types/index'
import type { Product } from '~/types'
import { useCartStore } from '~/stores/cart'
import Card from '~/components/atoms/Card.vue'
import { getImage } from '~/utils/helpers'

const cart = useCartStore()

const { data: categories } = await useAsyncGql('getProductCategories', {
  first: 6,
})
const productCategories = (categories.value?.productCategories?.nodes || []) as ProductCategory[]

const {
  data: products,
  error,
  loading,
} = await useAsyncGql('getProducts', {
  first: 8,
})

const productsValue = computed<Product[]>(() => {
  if (error.value) {
    console.error('Failed to fetch products:', error.value)
    return []
  }
  return products.value?.products?.nodes || []
})
</script>
