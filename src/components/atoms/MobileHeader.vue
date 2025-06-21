<template>
  <div class="mobile-menu container-wide" :class="{ open: isOpen }">
    <nav class="mobile-nav">
      <ul class="flex" data-column>
        <li
          v-for="(item, index) in appRoutes"
          :key="index"
          class="dot-hover-effect"
          :class="{ active: isActiveRoute(item.path) }"
        >
          <NuxtLink :to="item.path" :class="{ active: isActiveRoute(item.path) }" @click="close">
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
const { isActiveRoute } = useNavigation()

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}

useHead({
  bodyAttrs: {
    class: computed(() => (props.isOpen ? 'header-open' : '')),
  },
})
</script>
