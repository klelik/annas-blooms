<template>
  <section class="product content-section">
    <div class="container">
      <div class="product__container">
        <!-- Product Images -->
        <ThumbsCarousel
          v-if="productImages.length > 0"
          :images="productImages"
          :alt="product.name || 'Product Image'"
        />

        <!-- Product Info -->
        <div class="product__info">
          <div class="flow flow-gap-1">
            <div>
              <StarRating :model-value="5" :static="true" class="" />
              <h1 class="product__title ts-heading-3">{{ product?.name }}</h1>
            </div>

            <div class="product__price-rating flex" data-repel data-wrap>
              <div class="product__price-container">
                <p v-if="product?.salePrice" class="product__price">
                  <span class="product__price--sale">{{ product.salePrice }}</span>
                  <span class="product__price--regular">{{ product.regularPrice }}</span>
                </p>
                <p v-else class="product__price">{{ product?.price }}</p>
              </div>
            </div>
          </div>

          <hr class="product__divider" />

          <div class="flow flow-gap-2">
            <!-- //TODO: Dynamic attribute rendering -->
            <!-- Size Options -->
            <div v-if="hasSizeVariants" class="flow flow-gap-1 mb-2">
              <div class="flex flex-gap-1 mb-1">
                <h3 class="product__option-label">Size :</h3>
                <p class="product__option-label__selected">{{ selectedSize }}</p>
              </div>
              <div class="flex flex-gap-1" data-wrap>
                <div
                  v-for="size in sizeOptions"
                  :key="size.slug"
                  class="product__option-item"
                  :class="{ 'product__option-item--active': selectedSize === size.slug }"
                  @click="selectedSize = size.slug"
                >
                  {{ size.name }}
                </div>
              </div>
            </div>

            <!-- Color Options -->
            <div v-if="hasColorVariants" class="flow flow-gap-1 mb-2">
              <div class="flex flex-gap-1 mb-1">
                <h3 class="product__option-label">Flower :</h3>
                <p class="product__option-label__selected">{{ selectedColor }}</p>
              </div>

              <div class="flex flex-gap-1" data-wrap>
                <template v-for="color in colorOptionsWithLinks" :key="color.slug">
                  <!-- Linked product (NuxtLink) -->
                  <NuxtLink
                    v-if="color.linkedProduct"
                    :to="`/product/${color.linkedProduct.slug}`"
                    class="product__option-item product__option-item--color"
                    :class="{
                      'product__option-item--active': selectedColor === color.slug,
                    }"
                  >
                    <NuxtImg
                      :src="color.image.sourceUrl"
                      class="product__option-img"
                      v-bind="color.image"
                      width="60"
                      height="60"
                    />
                  </NuxtLink>

                  <!-- No linked product (div) -->
                  <div
                    v-else
                    class="product__option-item"
                    :class="{
                      'product__option-item--active': selectedColor === color.slug,
                    }"
                    :style="{
                      backgroundImage: `url('${color.image.sourceUrl}')`,
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'contain',
                    }"
                    @click="selectedColor = color.slug"
                  />
                </template>
              </div>
            </div>

            <!-- Message  -->
            <div v-if="messageCards" class="flow flow-gap-1 mb-2">
              <div class="flex flex-gap-1 mb-1">
                <h3 class="product__option-label">Message :</h3>
                <p class="product__option-label__selected">{{ selectedMessageCard?.name || '' }}</p>
              </div>
              <div class="flex flex-gap-1">
                <div
                  v-for="messageOption in messageCards"
                  :key="messageOption.databaseId"
                  class="product__option-item"
                  :class="{
                    'product__option-item--active':
                      selectedMessageCard?.databaseId === messageOption.databaseId,
                  }"
                  @click="selectedMessageCard = messageOption"
                >
                  {{ messageOption.name }}
                </div>
              </div>

              <div v-if="selectedMessageCard" class="message-textarea-wrapper">
                <textarea
                  id="messageText"
                  v-model="messageText"
                  class="message-textarea"
                  placeholder="Write your message here..."
                  rows="4"
                  maxlength="250"
                ></textarea>

                <div
                  v-if="
                    selectedMessageCard.cardOccasionLinks?.occasionsAndDetails?.nodes?.length > 0
                  "
                  class="flex flex-gap-1 p-1"
                >
                  <button
                    v-for="occasion in selectedMessageCard.cardOccasionLinks?.occasionsAndDetails
                      ?.nodes"
                    :key="occasion.id"
                    type="button"
                    class="occasion-button product__option-item"
                    :class="{
                      'product__option-item--active': selectedOccasion?.id === occasion.id,
                    }"
                    style="height: auto"
                    @click="selectedOccasion = occasion"
                  >
                    {{ occasion.title }}
                  </button>
                </div>
                <!-- <p>{{ selectedMessageCard }}</p> -->
              </div>
              <p v-if="selectedMessageCard" class="character-count ts-tiny">
                {{ messageText.length }}/250 characters
              </p>
            </div>

            <!-- Date Selection -->
            <!-- <div class="flow flow-gap-1 mb-2">
              <h3 class="product__option-label mb-1">Choose a Delivery Date</h3>
              <DatePicker v-model="selectedDate" :min="today" placeholder="Select delivery date" />
            </div>

            <hr class="product__divider" /> -->

            <!-- Add a Little Extra -->
            <div v-if="product?.crossSell?.nodes?.length > 0" class="mb-2">
              <h3 class="product__option-label mb-1">Add a Little Extra?</h3>

              <div class="flex gap-2">
                <!-- <div v-for="extra in product?.crossSell?.nodes" :key="extra.databaseId">
                  <div class="extras-product mb-05">
                    <NuxtImg :src="extra.image?.sourceUrl" v-bind="extra.image" />
                    <span class="extras-product__icon">+</span>
                  </div>
                  <p>{{ extra?.shortDescription }}</p>
                  <p class="ts-label c-disabled">{{ extra?.price }}</p>
                </div> -->

                <div
                  v-for="extra in product?.crossSell?.nodes"
                  :key="extra.databaseId"
                  class="product__option-item product__option-item--color"
                  :class="{
                    'product__option-item--active': selectedExtras === extra.slug,
                  }"
                  @click="selectedExtras = extra.slug"
                >
                  <NuxtImg
                    :src="extra.image?.sourceUrl"
                    class="product__option-img"
                    v-bind="extra?.image"
                    width="60"
                    height="60"
                  />
                  <p>{{ extra?.shortDescription }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Quantity and Add to Cart -->
          <div class="mt-4">
            <div class="product-add-to-cart">
              <select
                id="quantitySelect"
                v-model="quantity"
                class="product-add-to-cart__select cta"
                primary
                :disabled="!canAddToCart || cartStore.isUpdatingCart"
              >
                <option :value="1">1</option>
                <option :value="2">2</option>
                <option :value="3">3</option>
                <option :value="4">4</option>
                <option :value="5">5</option>
              </select>
              <button
                class="cta product-add-to-cart__btn"
                primary
                :disabled="!canAddToCart || cartStore.isUpdatingCart"
                @click="handleAddToCart"
              >
                {{ addToCartText }}
              </button>
            </div>
          </div>

          <!-- Show cart info if items present -->
          <div v-if="cartStore.cartItemsCount > 0" class="mt-2">
            <p class="ts-label">
              Cart: {{ cartStore.cartItemsCount }} items - {{ cartStore.cartTotal }}
            </p>
          </div>
        </div>
      </div>

      <!-- Product Recommendations sections remain the same -->
      <!-- <ProductRecommendations
        v-if="product?.upsell?.nodes?.length > 0"
        :items="product.upsell.nodes"
        title="You May Also Like ( Upsells )"
        class="product__recommendations--related"
      /> -->

      <SectionHeader :alignment="'left'" class="mb-6">
        <template #tag>
          <div class="flex flex-gap-1" data-aos="fade-up" data-aos-delay="100" data-aos-once="true">
            Recommended
          </div>
        </template>
        <template #title>
          <h2 class="">Similar Products</h2>
        </template>
      </SectionHeader>
      <ProductsCarousel
        v-if="product?.related?.nodes?.length > 0"
        :products="randomizeArray(product.related.nodes)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useDayjs } from '#dayjs'
import type { AddToCartInput } from '#gql'
import type { Product } from '~/types'
import { NuxtLink } from '#components'
import ThumbsCarousel from '~/components/atoms/ThumbsCarousel.vue'
import { getImage, randomizeArray, stripHtml } from '~/utils/helpers'
import { useCartStore } from '~/stores/cart'

const dayjs = useDayjs()
const route = useRoute()
const cartStore = useCartStore()

// Props
const slug = route.params.slug as string

// Fetch product data
const { data } = await useAsyncGql('getProduct', { slug })
if (!data.value?.product) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found' })
}

// Lazy-load message cards — doesn't block product page render
const { data: messageCardsData } = useLazyAsyncData('messageCards', () =>
  GqlGetMessageCards().then((res) => res.products?.nodes || []),
)

// State
const product = ref<Product>(data.value.product)
const messageCards = computed(() => messageCardsData.value || [])
const selectedColor = ref('')
const selectedDesign = ref('')
const selectedSize = ref('')
const selectedMessageCard = ref<any>(null)
const selectedExtras = ref<any>(null)
const quantity = ref(1)
const isAddingToCart = ref(false)
const selectedDate = ref<string>('')
const showGiftCard = ref(false)
const messageText = ref('')
const selectedOccasion = ref<any>(null)
// Constants
const today = dayjs().format('YYYY-MM-DD')

// Helper function to get default attribute value
const getDefaultAttributeValue = (attributeName: string): string => {
  const defaultAttr = product.value?.defaultAttributes?.nodes?.find(
    (attr) => attr.name === attributeName
  )
  return defaultAttr?.value || ''
}

// Computed: Process images for carousel
const productImages = computed(() => {
  const images = []

  // Add main product image if it exists
  if (product.value?.image?.sourceUrl) {
    images.push({
      sourceUrl: product.value.image.sourceUrl,
      altText: product.value.image.altText || product.value.name,
      title: product.value.image.title,
    })
  }

  // Add gallery images if they exist
  if (product.value?.galleryImages?.nodes?.length > 0) {
    product.value.galleryImages.nodes.forEach((galleryImage) => {
      if (galleryImage.sourceUrl) {
        images.push({
          sourceUrl: galleryImage.sourceUrl,
          altText: galleryImage.altText || product.value.name,
          title: galleryImage.title,
        })
      }
    })
  }

  return images
})

const colorOptionsWithLinks = computed(() => {
  if (!product.value?.variations?.nodes) return []

  return product.value.variations.nodes
    .filter((variation) => {
      const colorAttr = variation.attributes?.nodes?.find((attr) => attr.name === 'pa_color')
      return colorAttr && colorAttr.value
    })
    .map((variation) => {
      const colorAttr = variation.attributes.nodes.find((attr) => attr.name === 'pa_color')
      return {
        name: colorAttr.value,
        slug: colorAttr.value,
        image: variation.image,
        linkedProduct: variation.linkedProduct,
        variationId: variation.databaseId,
      }
    })
    .filter((color, index, self) => index === self.findIndex((c) => c.slug === color.slug))
})

// Computed: Size options
const sizeOptions = computed(() => {
  const sizeAttribute = product.value?.attributes?.nodes?.find((attr) => attr.name === 'pa_size')
  if (!sizeAttribute?.options) return []

  return sizeAttribute.options.map((option) => ({
    name: option,
    slug: option.toLowerCase(),
  }))
})

// Computed: Design options
const designOptions = computed(() => {
  const designAttribute = product.value?.attributes?.nodes?.find(
    (attr) => attr.name === 'pa_design'
  )
  if (!designAttribute?.options) return []

  return designAttribute.options.map((option) => ({
    name: option,
    slug: option.toLowerCase(),
  }))
})

// Computed: Variant checks
const hasSizeVariants = computed(() => sizeOptions.value.length > 0)
const hasColorVariants = computed(() => colorOptionsWithLinks.value.length > 0)

// Rest of your computed properties and methods remain the same...
const selectedVariation = computed(() => {
  if (!product.value?.variations?.nodes) return null

  return product.value.variations.nodes.find((variation) => {
    const attrs = variation.attributes?.nodes || []
    const colorMatch =
      !selectedColor.value ||
      attrs.some((attr) => attr.name === 'pa_color' && attr.value === selectedColor.value)
    const designMatch =
      !selectedDesign.value ||
      attrs.some((attr) => attr.name === 'pa_design' && attr.value === selectedDesign.value)
    return colorMatch && designMatch
  })
})

const maxQuantity = computed(() => {
  if (!selectedVariation.value) return 10
  return selectedVariation.value.stockQuantity || 10
})

const stockStatusText = computed(() => {
  if (!selectedVariation.value) return ''
  const qty = selectedVariation.value.stockQuantity
  if (selectedVariation.value.stockStatus === 'OUT_OF_STOCK') return 'Out of Stock'
  if (qty && qty <= 5) return `Only ${qty} left in stock`
  return 'In Stock'
})

const isSimpleProduct = computed(() => product.value?.type === 'SIMPLE')
const isVariableProduct = computed(() => product.value?.type === 'VARIABLE')

const canAddToCart = computed(() => {
  if (isAddingToCart.value || cartStore.isUpdatingCart) return false

  // Simple products can always be added if in stock
  if (isSimpleProduct.value) {
    return product.value?.stockStatus !== 'OUT_OF_STOCK'
  }

  // Variable products need a selected variation that's in stock
  if (isVariableProduct.value) {
    return (
      selectedVariation.value &&
      selectedVariation.value.stockStatus !== 'OUT_OF_STOCK'
    )
  }

  return false
})

const addToCartText = computed(() => {
  if (isAddingToCart.value || cartStore.isUpdatingCart) return 'Adding...'
  if (isVariableProduct.value && !selectedVariation.value) return 'Select Options'
  if (isSimpleProduct.value && product.value?.stockStatus === 'OUT_OF_STOCK') return 'Out of Stock'
  if (selectedVariation.value?.stockStatus === 'OUT_OF_STOCK') return 'Out of Stock'
  return 'Add to Cart'
})
// ============================================================
// Stock refresh — matches WooNuxt's scheduleStockRefresh pattern
// Refreshes stock status in the background after page load
// ============================================================
const mergeLiveStockStatus = (payload: any): void => {
  product.value.stockStatus = payload.stockStatus ?? product.value?.stockStatus
  payload.variations?.nodes?.forEach((variation: any, index: number) => {
    if (product.value?.variations?.nodes?.[index]) {
      product.value.variations.nodes[index].stockStatus = variation.stockStatus
    }
  })
}

const refreshStockStatus = async (): Promise<void> => {
  try {
    const { product: stockProduct } = await GqlGetStockStatus({ slug })
    if (stockProduct) mergeLiveStockStatus(stockProduct)
  } catch (error: any) {
    const errorMessage = error?.gqlErrors?.[0]?.message
    if (errorMessage) console.error(errorMessage)
  }
}

type IdleCallback = (deadline: { didTimeout: boolean; timeRemaining: () => number }) => void
type IdleCallbackWindow = Window & {
  requestIdleCallback?: (callback: IdleCallback, options?: { timeout: number }) => number
  cancelIdleCallback?: (handle: number) => void
}

let stockRefreshHandle: number | null = null
let stockRefreshHandleType: 'idle' | 'timeout' | null = null

const scheduleStockRefresh = (): void => {
  if (!import.meta.client) return

  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  if (connection?.saveData) return
  if (stockRefreshHandle !== null) return

  const run = () => {
    stockRefreshHandle = null
    stockRefreshHandleType = null
    void refreshStockStatus()
  }

  const idleWindow = window as IdleCallbackWindow
  if (idleWindow.requestIdleCallback) {
    stockRefreshHandleType = 'idle'
    stockRefreshHandle = idleWindow.requestIdleCallback(() => run(), { timeout: 2000 })
  } else {
    stockRefreshHandleType = 'timeout'
    stockRefreshHandle = window.setTimeout(run, 900)
  }
}

// Set initial selections and schedule stock refresh
onMounted(() => {
  // Set default size if available
  if (hasSizeVariants.value) {
    const defaultSize = getDefaultAttributeValue('pa_size')
    selectedSize.value =
      defaultSize || (sizeOptions.value.length > 0 ? sizeOptions.value[0].slug : '')
  }

  // Set default color if available
  if (hasColorVariants.value && colorOptionsWithLinks.value.length > 0) {
    const defaultColor = getDefaultAttributeValue('pa_color')
    selectedColor.value = defaultColor || colorOptionsWithLinks.value[0].slug
  }

  // Schedule stock refresh in background (matches WooNuxt)
  scheduleStockRefresh()
})

onBeforeUnmount(() => {
  if (!import.meta.client || stockRefreshHandle === null) return
  const idleWindow = window as IdleCallbackWindow
  if (stockRefreshHandleType === 'idle' && idleWindow.cancelIdleCallback) {
    idleWindow.cancelIdleCallback(stockRefreshHandle)
  } else {
    clearTimeout(stockRefreshHandle)
  }
  stockRefreshHandle = null
  stockRefreshHandleType = null
})

// Methods
const incrementQuantity = () => {
  if (quantity.value < maxQuantity.value) {
    quantity.value++
  }
}

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const formatPrice = (price: string | number) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(numPrice)
}

const handleAddToCart = async () => {
  if (!canAddToCart.value) return

  isAddingToCart.value = true

  try {
    const cartInput: AddToCartInput = {
      productId: product.value.databaseId,
      quantity: quantity.value,
    }

    if (selectedVariation.value) {
      cartInput.variationId = selectedVariation.value.databaseId
    }

    const metadata: { key: string; value: string }[] = []

    // Add message card
    if (selectedMessageCard.value) {
      metadata.push({
        key: 'message_card',
        value: selectedMessageCard.value.name,
      })

      if (messageText.value) {
        metadata.push({
          key: 'message_text',
          value: messageText.value,
        })
      }
    }

    if (selectedExtras.value) {
      metadata.push({
        key: 'extras',
        value: selectedExtras.value,
      })
    }

    if (selectedDate.value) {
      metadata.push({
        key: 'delivery_date',
        value: selectedDate.value,
      })
    }

    if (metadata.length > 0) {
      cartInput.extraData = JSON.stringify(metadata)
    }

    // Use the cart store to add to cart
    await cartStore.addToCart(cartInput)

    // Reset form after successful add
    quantity.value = 1
    selectedExtras.value = null
    messageText.value = ''
    selectedOccasion.value = null
    selectedMessageCard.value = null

  } catch (error) {
    console.error('Error adding to cart:', error)
    // Show error message to user if you have a notification system
  } finally {
    isAddingToCart.value = false
  }
}
</script>

<style scoped lang="scss">
@import 'assets/scss/utilities/mixin';
.product-add-to-cart {
  display: flex;
  gap: 1px;
  &__select {
    border-radius: var(--radius-default) 0 0 var(--radius-default) !important;
  }
  &__btn {
    border-radius: 0 var(--radius-default) var(--radius-default) 0 !important;
    max-width: 100% !important;
    flex: 1 !important;
    padding: 1rem !important;
  }
}

.extras-product {
  position: relative;
  cursor: pointer;
  width: 94px;
  height: 94px;
  overflow: hidden;
  background: linear-gradient(160deg, #f1ebe6 0%, #ebe4df 40%, #f3f1ec 100%);
  padding: 0.5rem;
  transition: padding 0.5s ease;
  box-shadow:
    rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
    rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__icon {
    position: absolute;
    bottom: 0;
    left: 0;
    font-size: 2rem;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  &:hover &__icon {
    background-color: rgba(0, 0, 0, 0.4);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
}

.message-textarea-wrapper {
  border: 1px solid var(--c-grey);
  border-radius: var(--radius-small);

  & textarea {
    padding: var(--space-1);
    border-radius: var(--radius-small);
    width: 100%;
    border: none;
    resize: none;

    background-color: var(--bg-color);
    overflow: auto;

    color: hsl(0, 0%, 50%);
    outline: none;
  }

  & .occasion-button {
    height: auto;
    border: none;
    &:hover {
      background: #f5eded;
    }
  }
}
</style>
