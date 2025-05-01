<template>
  <Masthead>
    <template #title> {{ appRoutes.events.label }} </template>
  </Masthead>
</template>

<script setup lang="ts">
import { appRoutes } from "@/utils/constants.js";
</script>
