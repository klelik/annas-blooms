<template>
  <div class="spinner"></div>
</template>

<style scoped lang="scss">
.spinner {
  width: 25px;
  height: 25px;

  border: 2px solid var(--c-grey-light);
  border-top: 3px solid var(--c-main-color);
  border-radius: 100%;

  animation: spin 1s infinite linear;
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
