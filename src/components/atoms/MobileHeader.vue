<template>
  <div class="mobile-menu container-wide" :class="{ open: isOpen }">
    <nav class="mobile-nav">
      <ul class="flex" data-column>
        <li v-for="(item, index) in appRoutes" :key="index">
          <NuxtLink
            :to="item.path"
            :class="{ active: $route.path === item.path }"
            @click="close"
          >
            <h2>
              {{ item.label }}
            </h2>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["close"]);
const close = () => {
  emit("close");
};

useHead({
  bodyAttrs: {
    class: computed(() => (props.isOpen ? "header-open" : "")),
  },
});
</script>
