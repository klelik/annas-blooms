<template>
  <div class="section-header" :class="[alignment]">
    <div class="section-header__content">
      <div v-if="hasTag || tag" class="section-header__tag">
        <slot name="tag">{{ tag }}</slot>
      </div>
      <div class="flex" data-repel>
        <h3
          v-if="hasTitle || title"
          class="section-header__title section-header__title-md"
          :class="'titleSize'"
          data-aos="fade-up"
          data-aos-delay="200"
          data-aos-once="true"
        >
          <slot name="title">{{ title }}</slot>
        </h3>
        <slot name="link" />
      </div>
      <p
        v-if="hasDescription || description"
        class="section-header__description"
        data-aos="fade-up"
        data-aos-delay="300"
        data-aos-once="true"
      >
        <slot name="description">{{ description }}</slot>
      </p>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SectionHeader } from '~/types';

const props = withDefaults(defineProps<SectionHeader>(), {});

const hasTag = computed(() => !!useSlots().tag);
const hasTitle = computed(() => !!useSlots().title);
const hasDescription = computed(() => !!useSlots().description);
const resolvedTag = computed(() => props.tagElement || 'h3');
</script>
