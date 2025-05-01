<template>
  <template v-if="isDarkTheme"> Annas Blooms </template>

  <template v-else> Annas Blooms </template>
</template>

<script setup lang="ts">
let isDarkTheme = false;

if (import.meta.client) {
  isDarkTheme = document.documentElement.classList.contains("dark");
}
</script>
