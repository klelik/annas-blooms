<template>
  <div v-if="page" class="wp-page">
    <!-- Hero -->
    <Masthead height="small">
      <template #title>{{ page.title }}</template>
    </Masthead>

    <!-- Content via Gutenberg Blocks (preferred) -->
    <section v-if="hasBlocks" class="container py-12">
      <div class="wp-content mx-auto max-w-3xl">
        <div
          v-for="(block, i) in page.editorBlocks"
          :key="i"
          :class="getBlockClass(block.name)"
          v-html="block.renderedHtml"
        />
      </div>
    </section>

    <!-- Fallback: raw HTML content -->
    <section v-else-if="page.content" class="container py-12">
      <div
        class="wp-content mx-auto max-w-3xl"
        v-html="page.content"
      />
    </section>

    <!-- No content -->
    <section v-else class="container py-16 text-center text-muted-foreground">
      <p>This page has no content yet.</p>
    </section>
  </div>

  <!-- 404 -->
  <div v-else-if="!pending" class="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
    <h1 class="text-2xl font-semibold text-foreground">Page Not Found</h1>
    <p class="text-muted-foreground">The page you're looking for doesn't exist.</p>
    <UiButton @click="navigateTo('/')">Back to Home</UiButton>
  </div>
</template>

<script setup lang="ts">
import { getPageTitle } from '~/utils/helpers'

const route = useRoute()

const slug = computed(() => {
  const parts = route.params.slug
  if (Array.isArray(parts)) {
    return '/' + parts.join('/') + '/'
  }
  return '/' + parts + '/'
})

const { data: pageData, pending } = await useAsyncGql('getPage', { uri: slug.value })

const page = computed(() => pageData.value?.page || null)

const hasBlocks = computed(() => {
  return page.value?.editorBlocks && page.value.editorBlocks.length > 0
})

/**
 * Map Gutenberg block names to optional CSS classes
 * for fine-grained styling control per block type.
 */
function getBlockClass(blockName: string): string {
  const map: Record<string, string> = {
    'core/paragraph': 'wp-block--paragraph',
    'core/heading': 'wp-block--heading',
    'core/image': 'wp-block--image',
    'core/gallery': 'wp-block--gallery',
    'core/quote': 'wp-block--quote',
    'core/list': 'wp-block--list',
    'core/separator': 'wp-block--separator',
    'core/columns': 'wp-block--columns',
    'core/buttons': 'wp-block--buttons',
    'core/table': 'wp-block--table',
    'core/embed': 'wp-block--embed',
    'core/video': 'wp-block--video',
    'core/cover': 'wp-block--cover',
    'core/group': 'wp-block--group',
    'core/spacer': 'wp-block--spacer',
  }
  return map[blockName] || 'wp-block--default'
}

useHead({
  title: page.value?.seo?.title || getPageTitle(page.value?.title),
  meta: [
    { name: 'description', content: page.value?.seo?.metaDesc || '' },
    { property: 'og:title', content: page.value?.seo?.opengraphTitle || page.value?.title || '' },
    { property: 'og:description', content: page.value?.seo?.opengraphDescription || '' },
    ...(page.value?.seo?.opengraphImage?.sourceUrl
      ? [{ property: 'og:image', content: page.value.seo.opengraphImage.sourceUrl }]
      : []),
  ],
})
</script>

<style lang="scss">
.wp-content {
  // Base typography
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    font-weight: 600;
    color: var(--heading-color);

    &:first-child {
      margin-top: 0;
    }
  }

  p {
    margin-bottom: 1em;
    line-height: 1.75;
    color: var(--text-color);
  }

  a {
    color: var(--c-main-color);
    text-decoration: underline;
    text-underline-offset: 0.175em;

    &:hover {
      color: var(--c-main-color-dark);
    }
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: var(--radius-default);
    margin: 1.5em 0;
  }

  ul, ol {
    padding-left: 1.5em;
    margin-bottom: 1em;
  }

  li {
    margin-bottom: 0.5em;
    line-height: 1.75;
  }

  blockquote,
  .wp-block-quote {
    border-left: 3px solid var(--c-main-color);
    padding-left: 1em;
    margin: 1.5em 0;
    font-style: italic;
    color: var(--text-color);

    cite {
      display: block;
      margin-top: 0.5em;
      font-size: 0.875em;
      font-style: normal;
      color: var(--c-grey);
    }
  }

  // Gutenberg block specific styles
  .wp-block-image {
    margin: 1.5em 0;

    figcaption {
      font-size: 0.875em;
      color: var(--c-grey);
      text-align: center;
      margin-top: 0.5em;
    }
  }

  .wp-block-separator,
  hr {
    border: none;
    border-top: 1px solid var(--c-grey-light);
    margin: 2em 0;
  }

  .wp-block-columns {
    display: flex;
    gap: 2em;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  .wp-block-column {
    flex: 1;
  }

  .wp-block-button {
    margin: 1em 0;

    .wp-block-button__link {
      display: inline-block;
      padding: 0.75em 1.5em;
      background-color: var(--c-main-color);
      color: white;
      border-radius: var(--radius-default);
      text-decoration: none;
      font-weight: 500;
      transition: background-color var(--duration-fast) var(--ease-luxury);

      &:hover {
        background-color: var(--c-main-color-dark);
        color: white;
      }
    }
  }

  .wp-block-buttons {
    display: flex;
    gap: 0.75em;
    flex-wrap: wrap;
    margin: 1.5em 0;
  }

  .wp-block-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1em;
    margin: 1.5em 0;

    figure {
      margin: 0;
    }
  }

  .wp-block-cover {
    position: relative;
    border-radius: var(--radius-default);
    overflow: hidden;
    margin: 1.5em 0;
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .wp-block-embed {
    margin: 1.5em 0;

    iframe {
      max-width: 100%;
      border-radius: var(--radius-default);
    }

    .wp-block-embed__wrapper {
      position: relative;
      padding-bottom: 56.25%; // 16:9 ratio
      height: 0;

      iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }
  }

  .wp-block-group {
    margin: 1.5em 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5em 0;

    th, td {
      padding: 0.75em;
      border: 1px solid var(--c-grey-light);
      text-align: left;
    }

    th {
      background-color: var(--c-surface);
      font-weight: 600;
    }
  }

  // WordPress alignment classes
  .alignwide {
    max-width: 100vw;
    margin-left: calc(-50vw + 50%);
    margin-right: calc(-50vw + 50%);
    width: 100vw;
  }

  .alignfull {
    max-width: 100vw;
    margin-left: calc(-50vw + 50%);
    margin-right: calc(-50vw + 50%);
    width: 100vw;
  }

  .aligncenter {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }

  .alignleft {
    float: left;
    margin-right: 1.5em;
    margin-bottom: 1em;
  }

  .alignright {
    float: right;
    margin-left: 1.5em;
    margin-bottom: 1em;
  }

  .has-text-align-center {
    text-align: center;
  }

  .has-text-align-right {
    text-align: right;
  }
}

// Block-level wrapper classes (from getBlockClass)
.wp-block--spacer {
  display: block;
}

.wp-block--embed {
  margin: 1.5em 0;
}
</style>
