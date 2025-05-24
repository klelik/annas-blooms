<template>
  <NuxtLayout name="default">
    <NuxtPage />
    <div id="modal"></div>
    <ShopingCart />
  </NuxtLayout>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const cart = useCartStore()

// Init cart
onMounted(async () => {
  await cart.initCart()
  console.log('Cart initialized:', cart.cart)
})
</script>
