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
          <template #link>
            <button class="cta" secondary>See All Collection</button>
          </template>
        </SectionHeader>
        <div class="mt-4 grid grid-gap-2">
          <!-- Skeleton cards while loading -->
          <template v-if="pending && productsValue.length === 0">
            <div v-for="n in 8" :key="n" class="card-skeleton">
              <div class="card-skeleton__image" />
              <div class="card-skeleton__body">
                <div class="card-skeleton__line card-skeleton__line--medium" />
                <div class="card-skeleton__line card-skeleton__line--short" />
              </div>
            </div>
          </template>

          <!-- Actual product cards -->
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
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'
import Card from '~/components/atoms/Card.vue'
import { getImage } from '~/utils/helpers'

const { data: products, error, pending } = await useAsyncGql('getProducts', {
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
