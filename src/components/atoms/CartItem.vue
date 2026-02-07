<template>
  <div class="flex items-start gap-3 p-4 transition-colors hover:bg-muted/50">
    <!-- Image -->
    <div class="size-20 shrink-0 overflow-hidden rounded-md bg-muted shadow-sm max-sm:size-16">
      <img
        v-if="itemImage"
        :src="itemImage.sourceUrl"
        :alt="itemImage.altText || item.product?.node?.name || ''"
        class="size-full object-cover"
      />
      <div v-else class="flex size-full items-center justify-center bg-muted text-muted-foreground">
        <svg class="size-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5" />
          <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="1.5" />
          <path d="M21 15L16 10L5 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>

    <!-- Details -->
    <div class="min-w-0 flex-1 space-y-1">
      <p class="line-clamp-2 text-sm font-semibold leading-tight text-foreground">{{ itemName }}</p>
      <p v-if="itemDescription" class="text-xs leading-relaxed text-muted-foreground">
        {{ itemDescription }}
      </p>
      <div class="flex items-center gap-1.5">
        <template v-if="item.product?.node?.salePrice">
          <span class="text-sm font-semibold text-destructive">
            {{ item.product.node.salePrice }}
          </span>
          <span class="text-xs text-muted-foreground line-through">
            {{ item.product.node.regularPrice }}
          </span>
        </template>
        <span v-else class="text-sm font-semibold text-foreground">
          {{ item.product?.node?.price }}
        </span>
      </div>
    </div>

    <!-- Quantity Controls -->
    <div class="flex flex-col items-center gap-2">
      <div class="flex items-center gap-1 rounded-md bg-muted p-1">
        <UiButton
          v-if="item.quantity === 1"
          variant="ghost"
          size="icon-sm"
          class="size-6 text-destructive hover:bg-destructive/10 hover:text-destructive"
          @click="$emit('update', item.key, 0)"
          aria-label="Remove item"
        >
          <svg class="size-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 6H5H21M8 6V4C8 3.4 8.4 3 9 3H15C15.6 3 16 3.4 16 4V6M19 6V20C19 20.6 18.6 21 18 21H6C5.4 21 5 20.6 5 20V6H19Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </UiButton>
        <UiButton
          v-else
          variant="ghost"
          size="icon-sm"
          class="size-6"
          :disabled="item.quantity <= 1"
          @click="$emit('update', item.key, item.quantity - 1)"
        >
          <svg class="size-3" viewBox="0 0 12 2" fill="none"><line x1="0" y1="1" x2="12" y2="1" stroke="currentColor" stroke-width="2" /></svg>
        </UiButton>
        <span class="min-w-[2rem] text-center text-xs font-medium text-foreground">{{ item.quantity }}</span>
        <UiButton
          variant="ghost"
          size="icon-sm"
          class="size-6"
          @click="$emit('update', item.key, item.quantity + 1)"
        >
          <svg class="size-3" viewBox="0 0 12 12" fill="none"><line x1="6" y1="0" x2="6" y2="12" stroke="currentColor" stroke-width="2" /><line x1="0" y1="6" x2="12" y2="6" stroke="currentColor" stroke-width="2" /></svg>
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  item: any
  isSmall?: boolean
}>()

defineEmits<{
  (e: 'update', key: string, newQuantity: number): void
}>()

/**
 * Get the right image — prefer variation image over product image.
 * Matches WooNuxt's CartCard pattern.
 */
const itemImage = computed(() => {
  return props.item.variation?.node?.image || props.item.product?.node?.image || null
})

/**
 * Get the display name — prefer variation name over product name.
 */
const itemName = computed(() => {
  return props.item.variation?.node?.name || props.item.product?.node?.name || 'Product'
})

/**
 * Get short description if available.
 */
const itemDescription = computed(() => {
  const desc = props.item.product?.node?.shortDescription
  return desc && desc !== '' ? desc : null
})
</script>
