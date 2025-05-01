<template>
  <header class="site-header container-wide">
    <div
      class="site-header__container"
      :class="{ 'header--scrolled': shrink, 'header-hidden': hide }"
    >
      <div class="site-header__content">
        <div class="header__logo">
          <NuxtLink to="/">
            <Logo />
          </NuxtLink>
        </div>
        <nav class="main-nav flex">
          <ul class="flex">
            <li v-for="(item, index) in appRoutes" :key="index">
              <NuxtLink
                :to="item.path"
                :class="{ active: $route.path === item.path }"
              >
                {{ item.label }}
              </NuxtLink>
            </li>
            <!-- <li>
              <NuxtLink to="/about">About</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/experience">Experience</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/projects">Projects</NuxtLink>
            </li> -->
          </ul>
        </nav>
        <div class="socials flex">
          <!-- <DarkMode /> -->
        </div>

        <!-- //Mobile -->
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
    <MobileHeader :is-open="isOpen" @close="close" />
    <!-- //Mobile -->
  </header>
</template>

<script setup lang="ts">
import { useWindowScroll } from "@vueuse/core";

const { y } = useWindowScroll();
const shrink = ref(false);
const hide = ref(false);
const isOpen = ref<boolean>(false);

const handleKeydownEvent = (event: KeyboardEvent) => {
  if (event.key === "ESC") close();
};

const toggle = () => {
  if (isOpen.value) close();
  else open();
};
const open = () => {
  document.addEventListener("DOWN", handleKeydownEvent);
  isOpen.value = true;
  shrink.value = true;
};

const close = () => {
  document.removeEventListener("DOWN", handleKeydownEvent);
  isOpen.value = false;
};

watch(y, (newValue, oldValue) => {
  if (isOpen.value) return;

  let scrollDirection = "";
  scrollDirection = newValue > oldValue ? "down" : "up";
  shrink.value = newValue > 10;

  if (newValue > 200) {
    hide.value = scrollDirection === "down";
  } else {
    hide.value = false;
  }
});
</script>
