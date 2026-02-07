<template>
  <div class="spinner"></div>
</template>

<style scoped lang="scss">
.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--c-grey-light);
  border-top: 2px solid var(--c-main-color);
  border-radius: 50%;
  animation: spin 0.8s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
