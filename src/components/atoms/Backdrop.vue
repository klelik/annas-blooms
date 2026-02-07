<template>
  <Teleport to="body">
    <!-- <div
      v-if="uiStore.overlayActive"
      class="offcanvas-backdrop"
      :class="{ 'offcanvas-backdrop--active': uiStore.overlayActive }"
      @click="handleBackdropClick"
    /> -->
    <div
      class="offcanvas-backdrop"
      :class="{ 'offcanvas-backdrop--active': uiStore.overlayActive }"
      @click="uiStore.hideOverlay()"
    />
  </Teleport>
</template>

<script setup lang="ts">
import { useUiStore } from '~/stores/ui'
const uiStore = useUiStore()
</script>

<style scoped lang="scss">
.offcanvas-backdrop {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(2px);
  transition: opacity var(--duration-base) var(--ease-luxury);
  z-index: 1038;
  cursor: pointer;
  pointer-events: none;
  display: block;
}

.offcanvas-backdrop--active {
  opacity: 1;
  pointer-events: auto;
}
</style>
