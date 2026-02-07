<template>
  <UiSheet :open="cartStore.isShowingCart" @update:open="cartStore.toggleCart($event)">
    <UiSheetContent side="right" class="flex flex-col p-0 sm:max-w-md">
      <!-- Header -->
      <UiSheetHeader class="border-b border-border px-6 py-4">
        <UiSheetTitle class="text-lg font-semibold">Cart</UiSheetTitle>
      </UiSheetHeader>

      <!-- Content -->
      <div
        class="flex-1 overflow-y-auto overscroll-contain"
        :class="{ 'pointer-events-none opacity-60 transition-opacity duration-200': cartStore.isUpdatingCart }"
      >
        <!-- Empty Cart -->
        <div
          v-if="!cartStore.isUpdatingCart && cartStore.cartItemsCount === 0"
          class="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center text-muted-foreground"
        >
          <svg
            class="size-16 text-muted-foreground/50"
            width="22"
            height="23"
            viewBox="0 0 22 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.9437 6.6875H4.05622C3.88705 6.68829 3.72396 6.75067 3.59744 6.86296C3.47091 6.97525 3.3896 7.12978 3.36872 7.29766L2.14841 18.2977C2.13756 18.3935 2.14699 18.4906 2.1761 18.5825C2.20521 18.6745 2.25335 18.7593 2.31738 18.8314C2.38141 18.9035 2.4599 18.9614 2.54776 19.0012C2.63561 19.041 2.73086 19.0619 2.82732 19.0625H19.1726C19.2691 19.0619 19.3643 19.041 19.4522 19.0012C19.54 18.9614 19.6185 18.9035 19.6826 18.8314C19.7466 18.7593 19.7947 18.6745 19.8238 18.5825C19.853 18.4906 19.8624 18.3935 19.8515 18.2977L18.6312 7.29766C18.6103 7.12978 18.529 6.97525 18.4025 6.86296C18.276 6.75067 18.1129 6.68829 17.9437 6.6875Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6.875 6C6.875 4.90598 7.3096 3.85677 8.08318 3.08318C8.85677 2.3096 9.90598 1.875 11 1.875C12.094 1.875 13.1432 2.3096 13.9168 3.08318C14.6904 3.85677 15.125 4.90598 15.125 6"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <h3 class="text-lg font-semibold text-foreground">Your cart is empty</h3>
          <p class="text-sm leading-relaxed">Add some beautiful flowers to get started</p>
          <UiButton class="mt-4" @click="cartStore.toggleCart(false)">
            Continue Shopping
          </UiButton>
        </div>

        <!-- Items -->
        <div v-else class="divide-y divide-border">
          <CartItem
            v-for="item in cartItems"
            :key="item.key"
            :item="item"
            :is-small="true"
            @update="updateQuantity"
          />
        </div>
      </div>

      <!-- Footer -->
      <UiSheetFooter v-if="cartStore.cartItemsCount > 0" class="mt-auto border-t border-border px-6 py-4 sm:flex-col">
        <div class="w-full space-y-3">
          <!-- Summary -->
          <div class="space-y-1.5 text-sm">
            <div v-if="!showOnlyTotal" class="flex items-center justify-between text-muted-foreground">
              <span>Subtotal ({{ cartStore.cartItemsCount }} items)</span>
              <span class="font-medium">{{ cartStore.cart?.subtotal }}</span>
            </div>

            <div
              v-if="getRawPrice(cartStore.cart?.shippingTotal) > 0"
              class="flex items-center justify-between text-muted-foreground"
            >
              <span>Shipping</span>
              <span class="font-medium">{{ cartStore.cart?.shippingTotal || '£0.00' }}</span>
            </div>

            <div
              v-if="getRawPrice(cartStore.cart?.totalTax) > 0"
              class="flex items-center justify-between text-muted-foreground"
            >
              <span>Tax</span>
              <span class="font-medium">{{ cartStore.cart?.totalTax }}</span>
            </div>

            <div
              v-if="getRawPrice(cartStore.cart?.discountTotal) > 0"
              class="flex items-center justify-between text-muted-foreground"
            >
              <span>Discount</span>
              <span class="font-medium">-{{ cartStore.cart?.discountTotal }}</span>
            </div>

            <UiSeparator class="my-2" />

            <div class="flex items-center justify-between text-base font-semibold text-foreground">
              <span>Total</span>
              <span>{{ cartStore.cart?.total || '£0.00' }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <UiButton variant="outline" class="flex-1" @click="cartStore.toggleCart(false)">
              Continue Shopping
            </UiButton>
            <UiButton class="flex-1" @click="checkout">
              Checkout
            </UiButton>
          </div>
        </div>
      </UiSheetFooter>
    </UiSheetContent>
  </UiSheet>
</template>

<script setup lang="ts">
import { getRawPrice } from '~/utils/helpers'

const cartStore = useCartStore()

const cartItems = computed(() => {
  return cartStore.cart?.contents?.nodes || []
})

const showOnlyTotal = computed(() => {
  return (
    getRawPrice(cartStore?.cart?.shippingTotal) +
      getRawPrice(cartStore?.cart?.totalTax) +
      getRawPrice(cartStore?.cart?.discountTotal) ===
    0
  )
})

const updateQuantity = async (key: string, quantity: number) => {
  if (quantity <= 0) {
    await cartStore.removeItem(key)
  } else {
    await cartStore.updateItemQuantity(key, quantity)
  }
}

const checkout = () => {
  cartStore.toggleCart(false)
  navigateTo('/checkout')
}
</script>
