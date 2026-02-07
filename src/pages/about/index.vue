<template>
  <div>
    <Masthead height="small">
      <template #title>{{ page?.title || 'About' }}</template>
    </Masthead>

    <section class="container py-12">
      <div
        v-if="page?.content"
        class="wp-content prose prose-lg mx-auto max-w-3xl"
        v-html="page.content"
      />
      <div v-else-if="!pending" class="py-8 text-center text-muted-foreground">
        <p>Content coming soon.</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { getPageTitle } from '~/utils/helpers'

const { data: pageData, pending } = await useAsyncGql('getPage', { uri: '/about/' })

const page = computed(() => pageData.value?.page || null)

useHead({
  title: page.value?.seo?.title || getPageTitle('About'),
  meta: [
    { name: 'description', content: page.value?.seo?.metaDesc || 'About Anna\'s Blooms' },
  ],
})
</script>
