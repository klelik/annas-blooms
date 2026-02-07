<template>
  <NuxtLayout name="default">
    <NuxtPage />
    <div id="modal"></div>
    <ShopingCart />
  </NuxtLayout>
</template>

<script setup lang="ts">
const cart = useCartStore()
const route = useRoute()

// Close cart sidebar on route change (matches WooNuxt app.vue)
watch(
  () => route.path,
  () => {
    cart.toggleCart(false)
  },
)
</script>
