<template>
  <div class="cart-sidebar" :class="{ 'cart-sidebar--open': cartStore.isShowingCart }">
    <div class="cart-sidebar__panel">
      <div class="cart-sidebar__header">
        <h2 class="cart-sidebar__title">Cart</h2>
        <button
          class="cart-sidebar__close"
          @click="cartStore.toggleCart(false)"
          aria-label="Close cart"
          size="none"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <div class="cart-sidebar__content">
        <!-- Loading State -->
        <div v-if="cartStore.isUpdatingCart" class="cart-sidebar__loading">
          <div class="cart-sidebar__spinner"></div>
          <p>Updating cart...</p>
        </div>

        <!-- Empty Cart -->
        <div v-else-if="cartStore.cartItemsCount === 0" class="cart-sidebar__empty">
          <div class="cart-sidebar__empty-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M9 19.5C9.8 19.5 10.5 20.2 10.5 21S9.8 22.5 9 22.5 7.5 21.8 7.5 21 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21S20.8 22.5 20 22.5 18.5 21.8 18.5 21 19.2 19.5 20 19.5Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <h3>Your cart is empty</h3>
          <p>Add some beautiful flowers to get started</p>
          <button class="cart-sidebar__continue-btn" @click="cartStore.toggleCart(false)">
            Continue Shopping
          </button>
        </div>

        <!-- Items -->
        <div v-else class="cart-sidebar__items flow">
          <div v-for="item in cartItems" :key="item.key" class="cart-item">
            <div class="cart-item__image">
              <img
                v-if="item.product?.node.image?.sourceUrl"
                :src="item.product?.node.image?.sourceUrl"
                :alt="item.product?.node.image?.altText"
              />
              <div v-else class="cart-item__image-placeholder"></div>
            </div>

            <div class="cart-item__details">
              <div class="flow flow-gap-05">
                <p class="cart-item__name">{{ item.product?.node.name }}</p>
                <p class="cart-item__description">
                  {{
                    item.product?.node.shortDescription != ''
                      ? item.product?.node.shortDescription
                      : 'Short descripion'
                  }}
                </p>
              </div>
              <div class="cart-item__price">
                <template v-if="item.product?.node?.salePrice">
                  <span class="cart-item__sale-price">
                    {{ item.product?.node?.salePrice }}
                  </span>
                  <span class="cart-item__regular-price">
                    {{ item.product?.node?.regularPrice }}
                  </span>
                </template>

                <!-- Not on Sale: Show regular price -->
                <span v-else class="cart-item__current-price">
                  {{ item.product?.node?.price }}
                </span>
              </div>
            </div>

            <div class="cart-item__quantity">
              <button
                v-if="item.quantity == 1"
                class="cart-item__remove"
                @click="removeItem(item.key)"
                aria-label="Remove item"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3 6H5H21M8 6V4C8 3.4 8.4 3 9 3H15C15.6 3 16 3.4 16 4V6M19 6V20C19 20.6 18.6 21 18 21H6C5.4 21 5 20.6 5 20V6H19Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
              <button
                v-else
                class="cart-item__quantity-btn"
                @click="updateQuantity(item.key, item.quantity - 1)"
                :disabled="item.quantity <= 1"
              >
                -
              </button>
              <span class="cart-item__quantity-value">{{ item.quantity }}</span>
              <button
                class="cart-item__quantity-btn"
                @click="updateQuantity(item.key, item.quantity + 1)"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="cartStore.cartItemsCount > 0" class="cart-sidebar__footer">
        <div class="cart-sidebar__summary">
          <div v-if="!showOnlyTotal" class="cart-sidebar__summary-row">
            <span>Subtotal ({{ cartStore.cartItemsCount }} items)</span>
            <span class="cart-sidebar__summary-price">{{ cartStore.cart?.subtotal }}</span>
          </div>

          <div
            v-if="getRawPrice(cartStore.cart?.shippingTotal) > 0"
            class="cart-sidebar__summary-row"
          >
            <span>Shipping</span>
            <span class="cart-sidebar__summary-price">{{
              cartStore.cart?.shippingTotal || '£0.00'
            }}</span>
          </div>

          <div v-if="getRawPrice(cartStore.cart?.totalTax) > 0" class="cart-sidebar__summary-row">
            <span>Tax</span>
            <span class="cart-sidebar__summary-price">{{ cartStore.cart?.totalTax }}</span>
          </div>

          <div
            v-if="getRawPrice(cartStore.cart?.discountTotal) > 0"
            class="cart-sidebar__summary-row"
          >
            <span>Discount</span>
            <span class="cart-sidebar__summary-price"> -{{ cartStore.cart?.discountTotal }} </span>
          </div>

          <div class="cart-sidebar__summary-row cart-sidebar__summary-row--total">
            <span>Total</span>
            <span class="cart-sidebar__summary-price--total">
              {{ cartStore.cart?.total || '£0.00' }}
            </span>
          </div>
        </div>

        <div class="cart-sidebar__actions">
          <button class="" secondary @click="viewCart">View Cart</button>
          <button class="" primary @click="checkout">Checkout</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getRawPrice } from '~/utils/helpers'
const cartStore = useCartStore()

const cartItems = computed(() => {
  return cartStore.cart?.contents?.nodes || []
})
console.log('Cart Items:', cartItems.value)

const showOnlyTotal = computed(() => {
  return (
    getRawPrice(cartStore?.cart?.shippingTotal) +
      getRawPrice(cartStore?.cart?.totalTax) +
      getRawPrice(cartStore?.cart?.discountTotal) ===
    0
  )
})

const updateQuantity = async (key: string, quantity: number) => {
  console.log('Updating quantity:', key, quantity)
  if (quantity <= 0) {
    await removeItem(key)
  } else {
    // await cartStore.emptyCart()
    await cartStore.updateItemQuantity(key, quantity)
  }
}

const removeItem = async (key: string) => {
  await cartStore.removeItem(key)
}

const viewCart = () => {
  cartStore.toggleCart(false)
  navigateTo('/cart')
}

const checkout = () => {
  cartStore.toggleCart(false)
  navigateTo('/checkout')
}
</script>
