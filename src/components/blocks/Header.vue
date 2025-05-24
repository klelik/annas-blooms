<template>
  <header class="site-header container-wide" :class="{ 'site-header-hidden': hide }">
    <div class="site-header__container" :class="{ 'header-hidden': hide }">
      <div class="site-header__content">
        <div class="header__logo">
          <NuxtLink to="/">
            <Logo />
          </NuxtLink>
        </div>
        <nav class="main-nav flex">
          <ul class="flex">
            <li v-for="(item, index) in appRoutes" :key="index">
              <NuxtLink :to="item.path" :class="{ active: $route.path === item.path }">
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
        <div class="socials flex">
          <!-- Cart Trigger -->
          <button class="cart-trigger" @click="toggleCart()" :aria-label="`Cart with items`">
            <svg
              class="cart-trigger__icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M9 19.5C9.8 19.5 10.5 20.2 10.5 21S9.8 22.5 9 22.5 7.5 21.8 7.5 21 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21S20.8 22.5 20 22.5 18.5 21.8 18.5 21 19.2 19.5 20 19.5Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span v-if="cartStore.cartItemsCount > 0" class="cart-trigger__badge">
              {{ cartStore.cartItemsCount }}
            </span>
          </button>
        </div>

        <!-- Mobile Menu Button -->
        <button
          id="MenuTrigger"
          type="button"
          :aria-label="isOpen ? 'Close menu' : 'Open menu'"
          :aria-expanded="isOpen"
          class="hamburger"
          :class="{ active: isOpen }"
          @click="toggle"
        >
          <span class="hamburger-inner" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- Mobile Header -->
    <MobileHeader :is-open="isOpen" @close="close" />
  </header>
</template>

<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()
const shrink = ref(false)
const hide = ref(false)
const isOpen = ref<boolean>(false)

const cartStore = useCartStore()
const toggleCart = () => {
  // ui.toggleOverlay()
  cartStore.toggleCart()
  if (cartStore.isShowingCart) {
    hide.value = true
  }
}
const handleKeydownEvent = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    close()
  }
}

const toggle = () => {
  if (isOpen.value) close()
  else open()
}

const open = () => {
  document.addEventListener('keydown', handleKeydownEvent)
  isOpen.value = true
  shrink.value = true
}

const close = () => {
  document.removeEventListener('keydown', handleKeydownEvent)
  isOpen.value = false
}

watch(y, (newValue, oldValue) => {
  if (isOpen.value) return

  let scrollDirection = ''
  scrollDirection = newValue > oldValue ? 'down' : 'up'
  shrink.value = newValue > 10

  if (cartStore.isShowingCart) {
    //if cart open hide menu
    hide.value = true
  } else {
    if (newValue > 200) {
      hide.value = scrollDirection === 'down'
    } else {
      hide.value = false
    }
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydownEvent)
})
</script>

<style scoped>
/* Cart Trigger Button */
.cart-trigger {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: var(--color-text-primary);
  transition: all 0.2s ease;
  border-radius: 6px;
}

.cart-trigger:hover {
  color: var(--color-primary);
  background-color: rgba(192, 121, 127, 0.1);
}

.cart-trigger__icon {
  width: 24px;
  height: 24px;
}

.cart-trigger__badge {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #d4556b;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(25%, -25%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
