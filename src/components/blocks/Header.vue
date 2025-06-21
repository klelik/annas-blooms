<template>
  <header class="site-header container-full" :class="{ 'site-header-hidden': hide }">
    <div
      class="site-header__container"
      :class="{ 'header-hidden': hide, 'header-colored': shrink }"
    >
      <div class="site-header__content">
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

        <nav class="main-nav">
          <ul class="flex flx-gap-2">
            <li
              v-for="(item, index) in appRoutes"
              :key="index"
              class="dot-hover-effect"
              :class="{ active: isActiveRoute(item.path) }"
            >
              <NuxtLink
                :to="item.path"
                :class="{ active: isActiveRoute(item.path) }"
                @click="handleNavClick"
              >
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <div class="header__logo">
          <NuxtLink to="/">
            <Logo />
          </NuxtLink>
        </div>

        <div class="socials flex flex-gap-2">
          <button
            class="dot-hover-effect"
            :class="{ active: isAccountActive }"
            @click="handleAccountClick"
            aria-label="Account"
          >
            <!-- Account SVG -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
              role="presentation"
              class="icon icon-account"
              width="22"
              height="23"
              fill="none"
              viewBox="0 0 22 23"
            >
              <path
                d="M11 14.25C14.0376 14.25 16.5 11.7876 16.5 8.75C16.5 5.71243 14.0376 3.25 11 3.25C7.96243 3.25 5.5 5.71243 5.5 8.75C5.5 11.7876 7.96243 14.25 11 14.25Z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-miterlimit="10"
              />
              <path
                d="M2.66406 19.0625C3.50877 17.5991 4.72384 16.3838 6.18712 15.5389C7.65039 14.694 9.31031 14.2492 11 14.2492C12.6897 14.2492 14.3496 14.694 15.8129 15.5389C17.2762 16.3838 18.4912 17.5991 19.3359 19.0625"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <!-- Cart Trigger -->
          <button
            class="cart-trigger dot-hover-effect"
            :class="{ active: cartStore.isShowingCart }"
            @click="toggleCart()"
            :aria-label="`Cart with ${cartStore.cartItemsCount || 0} items`"
          >
            <!-- Cart SVG -->
            <svg
              class="icon icon-cart"
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
            <span v-if="cartStore.cartItemsCount > 0" class="cart-trigger__badge">
              {{ cartStore.cartItemsCount }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Header -->
    <MobileHeader :is-open="isOpen" @close="close" />
  </header>
</template>

<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()
const { isActiveRoute } = useNavigation()
const route = useRoute()
const shrink = ref(false)
const hide = ref(false)
const isOpen = ref<boolean>(false)
const isAccountActive = ref(false)

const cartStore = useCartStore()

const toggleCart = () => {
  cartStore.toggleCart()
  if (cartStore.isShowingCart) {
    hide.value = true
  }
}

//TODO: Implement Accounts
const handleAccountClick = () => {
  isAccountActive.value = !isAccountActive.value
}

const handleNavClick = () => {
  if (isOpen.value) {
    close()
  }
}

const handleKeydownEvent = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    close()
    isAccountActive.value = false
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
    hide.value = true
  } else {
    if (newValue > 200) {
      hide.value = scrollDirection === 'down'
    } else {
      hide.value = false
    }
  }
})

watch(
  () => route.path,
  () => {
    isAccountActive.value = false
    if (isOpen.value) {
      close()
    }
  }
)

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydownEvent)
})
</script>

<style scoped>
/* Cart Trigger Button */

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
