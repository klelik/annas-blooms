<!-- eslint-disable vue/valid-v-for -->
<template>
  <div class="flow card-wrapper">
    <div class="card project-card">
      <NuxtImg
        v-if="image"
        :src="image.src"
        :alt="image.alt"
        :width="image.width"
        :height="image.height"
        class="card__image"
      />
    </div>
    <div class="flow flow-gap-2 pi-1">
      <div class="flex" data-repel>
        <h5 v-if="title" class="card__title">{{ title }}</h5>
        <div class="flex flex-gap-1">
          <Chip v-for="tag in tags" class="card__tag">{{ tag }}</Chip>
        </div>
      </div>

      <p v-if="description" class="card__description">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Card } from '~/types';

const props = defineProps<Card>();
</script>
