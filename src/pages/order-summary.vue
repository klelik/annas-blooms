<template>
  <section class="content-section">
    <div class="container">
      <div class="order-summary">
        <!-- Loading State -->
        <div v-if="!isLoaded" class="order-summary__loading">
          <Spinner />
        </div>

        <template v-else>
          <!-- Order Found -->
          <div v-if="order" class="order-summary__content">
            <div class="order-summary__header">
              <h1 class="ts-heading-3">Order Received</h1>
              <p class="ts-body c-disabled">Thank you for your order!</p>
            </div>

            <hr class="order-summary__divider" />

            <!-- Order Info -->
            <div class="order-summary__info">
              <div class="order-summary__info-item">
                <span class="order-summary__label">Order</span>
                <span class="order-summary__value">#{{ order.databaseId }}</span>
              </div>
              <div class="order-summary__info-item">
                <span class="order-summary__label">Date</span>
                <span class="order-summary__value">{{ formatDate(order.date) }}</span>
              </div>
              <div class="order-summary__info-item">
                <span class="order-summary__label">Status</span>
                <span class="order-summary__value order-summary__status">{{ order.status }}</span>
              </div>
              <div class="order-summary__info-item">
                <span class="order-summary__label">Payment</span>
                <span class="order-summary__value">{{ order.paymentMethodTitle }}</span>
              </div>
            </div>

            <hr class="order-summary__divider" />

            <!-- Line Items -->
            <div v-if="order.lineItems" class="order-summary__items">
              <div
                v-for="item in order.lineItems.nodes"
                :key="item.id"
                class="order-summary__item"
              >
                <div class="order-summary__item-image">
                  <NuxtImg
                    v-if="itemImage(item)"
                    :src="itemImage(item)"
                    :alt="itemName(item)"
                    width="64"
                    height="64"
                    loading="lazy"
                  />
                </div>
                <div class="order-summary__item-details">
                  <p class="order-summary__item-name">{{ itemName(item) }}</p>
                  <p class="order-summary__item-qty ts-label c-disabled">Qty. {{ item.quantity }}</p>
                </div>
                <span class="order-summary__item-total">{{ item.total }}</span>
              </div>
            </div>

            <hr class="order-summary__divider" />

            <!-- Totals -->
            <div class="order-summary__totals">
              <div class="order-summary__totals-row">
                <span>Subtotal</span>
                <span v-html="order.subtotal"></span>
              </div>
              <div class="order-summary__totals-row">
                <span>Tax</span>
                <span v-html="order.totalTax"></span>
              </div>
              <div class="order-summary__totals-row">
                <span>Shipping</span>
                <span v-html="order.shippingTotal"></span>
              </div>
              <div
                v-if="hasDiscount"
                class="order-summary__totals-row order-summary__totals-row--discount"
              >
                <span>Discount</span>
                <span>- <span v-html="order.discountTotal"></span></span>
              </div>
              <hr class="order-summary__divider" />
              <div class="order-summary__totals-row order-summary__totals-row--total">
                <span>Total</span>
                <span v-html="order.total"></span>
              </div>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="errorMessage" class="order-summary__error">
            <h2 class="ts-heading-4">Error</h2>
            <p class="c-disabled">{{ errorMessage }}</p>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { query, params } = useRoute()
const cartStore = useCartStore()

const order = ref<any>(null)
const isLoaded = ref(false)
const errorMessage = ref('')
const hasDiscount = computed(() => !!parseFloat(order.value?.rawDiscountTotal || '0'))

const formatDate = (date?: string | null): string => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-GB', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

const itemImage = (item: any): string => {
  return (
    item.variation?.node?.image?.sourceUrl ||
    item.product?.node?.image?.sourceUrl ||
    ''
  )
}

const itemName = (item: any): string => {
  return item.variation?.node?.name || item.product?.node?.name || 'Product'
}

onMounted(async () => {
  await getOrder()

  // Clear cart after successful order
  if (order.value && cartStore.cart?.contents?.nodes?.length) {
    await cartStore.emptyCart()
    await cartStore.refreshCart()
  }
})

async function getOrder() {
  try {
    const orderId = (params as any).orderId || query.id
    if (!orderId) {
      errorMessage.value = 'No order ID provided'
      isLoaded.value = true
      return
    }

    const { customer } = await GqlGetOrder({ id: orderId as string })
    const fetchedOrder = customer?.orders?.nodes?.[0]

    if (fetchedOrder) {
      order.value = fetchedOrder
    } else {
      errorMessage.value = 'Could not find order'
    }
  } catch (err: any) {
    errorMessage.value = err?.gqlErrors?.[0]?.message || 'Could not find order'
  }
  isLoaded.value = true
}
</script>

<style scoped lang="scss">
.order-summary {
  max-width: 720px;
  margin: 0 auto;
  padding: var(--space-6) 0;

  &__loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
  }

  &__header {
    margin-bottom: var(--space-4);
  }

  &__divider {
    border: none;
    border-top: 1px solid var(--c-grey-light);
    margin: var(--space-4) 0;
  }

  &__info {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-3);

    @media (min-width: 640px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  &__label {
    display: block;
    font-size: var(--ts-label);
    color: var(--c-grey);
    text-transform: uppercase;
    margin-bottom: var(--space-1);
  }

  &__value {
    font-weight: 500;
    color: var(--text-color);
  }

  &__status {
    text-transform: capitalize;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  &__item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  &__item-image {
    width: 64px;
    height: 64px;
    border-radius: var(--radius-small);
    overflow: hidden;
    flex-shrink: 0;
    background: var(--c-surface);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__item-details {
    flex: 1;
  }

  &__item-name {
    font-weight: 500;
    color: var(--text-color);
  }

  &__item-total {
    font-weight: 600;
    color: var(--text-color);
  }

  &__totals {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  &__totals-row {
    display: flex;
    justify-content: space-between;
    font-size: var(--ts-body);
    color: var(--text-color);

    &--discount {
      color: var(--c-main-color);
    }

    &--total {
      font-weight: 600;
      font-size: var(--ts-body-large);
    }
  }

  &__error {
    text-align: center;
    padding: var(--space-8) 0;
  }
}
</style>
