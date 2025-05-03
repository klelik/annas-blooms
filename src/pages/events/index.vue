<template>
  <section class="content-section">
    <div class="container">
      <p v-for="cat in productCategories">{{ cat.name }}</p>
    </div>
    <div class="container m-4">
      <p v-for="prod in productsValue">{{ prod.name }}</p>
    </div>
  </section>
</template>

<script lang="ts" setup>
const { data: categories } = await useAsyncGql('getProductCategories', { first: 6 })
const { data: products } = await useAsyncGql('getProducts', { first: 8 })

const productCategories = categories.value?.productCategories?.nodes || []
const productsValue = products.value?.products?.nodes || []
</script>
