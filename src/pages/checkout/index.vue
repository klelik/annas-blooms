<template>
  <div class="content-section flex container" data-start>
    <section class="flow flow-gap-3 data-section">
      <div class="container flow flow-gap-1">
        <div class="flow flow-gap-05">
          <h5 class="t-h5">Contact Information</h5>
          <p>
            Already have an account?
            <NuxtLink to="/my-account" class="text-main-light">Log in</NuxtLink>.
          </p>
        </div>

        <div class="form-container flow flow-gap-2">
          <FormField
            v-model="formData.email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            autocomplete="email"
            required
            class=""
            :validation="v$.email"
          />
          <div v-if="showCreateAccount" class="flow flow-gap-1">
            <FormField
              v-model="formData.username"
              type="text"
              label="Username"
              placeholder="JohnDoe"
              autocomplete="text"
              class=""
              :validation="v$.username"
            />
            <FormField
              v-model="formData.password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              autocomplete="password"
              class=""
              :validation="v$.password"
            />
          </div>
        </div>

        <div>
          <p class="flex" style="justify-content: start; gap: var(--space-1)">
            Create Account
            <Checkbox id="create-account-checkout" v-model="showCreateAccount" />
          </p>
        </div>
      </div>

      <!-- Enhanced Billing Details with Address Lookup -->
      <div class="container flow flow-gap-1">
        <h5 class="t-h5">Billing Details</h5>
        <div class="grid grid-max-cols-2 form-container" data-repel>
          <FormField
            v-model="formData.firstName"
            type="text"
            label="First Name"
            placeholder="Klement"
            :validation="v$.firstName"
          />

          <FormField
            v-model="formData.lastName"
            type="text"
            label="Last Name"
            placeholder="Lika"
            :validation="v$.lastName"
          />

          <FormField
            v-model="formData.phone"
            class="grid-col-span-full"
            type="text"
            label="Phone"
            placeholder="+44 123 456 7890"
            :validation="v$.phone"
            required
          />

          <!-- Enhanced Postcode Field with Lookup -->
          <div class="grid-col-span-full relative">
            <FormField
              v-model="formData.postcode"
              type="text"
              label="Postcode"
              placeholder="Enter your postcode (e.g., SW1A 1AA)"
              :validation="v$.postcode"
              required
              @blur="handlePostcodeLookup"
              @input="handlePostcodeInput"
            />
            <div v-if="postcodeStatus.isLoading" class="postcode-loading-spinner">
              <Spinner />
            </div>

            <!-- Postcode Status Display -->
            <!-- <div v-if="postcodeStatus.message" :class="getStatusClass">
              {{ postcodeStatus.message }}
              <span v-if="postcodeStatus.coordinates" class="coordinates">
                ({{ postcodeStatus.coordinates.lat.toFixed(4) }},
                {{ postcodeStatus.coordinates.lng.toFixed(4) }})
              </span>
            </div> -->
          </div>

          <!-- Street Suggestion Section -->
          <div
            v-if="streetSuggestion.show && postcodeStatus.isValid"
            class="flow grid-col-span-full"
          >
            <p>
              Is
              <span class="text-main-light ts-body-large">{{ streetSuggestion.street }} </span> your
              street?
            </p>
            <div class="flex decision-buttons">
              <Checkbox
                id="correct-address"
                v-model="streetSuggestion.isCorrect"
                label="Yes, that's correct"
                @change="handleStreetConfirmation(true)"
              />
              <Checkbox
                id="wrong-address"
                v-model="streetSuggestion.isWrong"
                label="No, different street"
                @change="handleStreetConfirmation(false)"
              />
            </div>
          </div>

          <!-- Address Form (Manual Entry or Confirmed) -->
          <FormField
            v-if="showAddressForm"
            v-model="formData.houseNumber"
            type="text"
            label="House Number/Name"
            placeholder="123 or Flat 2A"
            :validation="v$.houseNumber"
            required
          />

          <FormField
            v-if="showAddressForm"
            v-model="formData.streetName"
            type="text"
            label="Street Name"
            placeholder="Main Street"
            :validation="v$.streetName"
            :disabled="streetSuggestion.confirmed"
            required
          />

          <FormField
            v-if="showAddressForm"
            v-model="formData.townCity"
            type="text"
            label="Town/City"
            placeholder="London"
            :validation="v$.townCity"
            required
          />

          <FormField
            v-if="showAddressForm"
            v-model="formData.county"
            type="text"
            label="County"
            placeholder="England"
          />
        </div>

        <!-- Final Address Display -->
        <div v-if="finalAddress.show" class="grid-col-span-full final-address">
          <h4>✓ Address Confirmed</h4>
          <div class="address-display">
            {{ finalAddress.formatted }}
          </div>
          <button type="button" @click="editAddress">Edit Address</button>
        </div>
      </div>

      <!-- //TODO: Setup Shipping Method in Cms -->
      <div v-if="shippingOptions?.length" class="container flow flow-gap-1">
        <h5 class="t-h5">Shipping Method</h5>

        <FormField
          v-model="formData.shippingMethod"
          type="radio"
          label="Shipping Method"
          :options="shippingOptions"
          :validation="v$.shippingMethod"
          required
        />
      </div>

      <div v-if="paymentOptions?.length" class="container flow flow-gap-1">
        <h5 class="t-h5">Payment Options</h5>

        <FormField
          v-model="formData.paymentMethod"
          type="radio"
          label="Shipping Method"
          :options="paymentOptions"
          :validation="v$.paymentMethod"
          required
        />
      </div>

      <div class="container flow flow-gap-1">
        <h5 class="t-h5">Notes</h5>
        <div class="grid grid-max-cols-2" data-repel>
          <FormField
            v-model="formData.shippingNotes"
            type="textarea"
            label="Delivery Instructions"
            placeholder="Leave at front door, ring bell twice, etc."
            class="grid-col-span-full"
          />
        </div>
      </div>
    </section>

    <!-- //Sidebar with Order Summary -->
    <aside class="">
      <div class="form-container flow flow-gap-2">
        <p>Order Summary</p>
        <CartItem v-for="item in cartItems" :key="item.key" :item="item" @update="updateQuantity" />
        <div class="flex">
          <FormField v-model="formData.coupon" type="text" label="" placeholder="Coupon code" />
          <button
            class=""
            secondary
            :disabled="!formData.coupon || cartStore.isUpdatingCoupon"
            @click="handleApplyCoupon"
          >
            {{ cartStore.isUpdatingCoupon ? 'Applying...' : 'Apply' }}
          </button>
        </div>
        <p v-if="couponMessage" :class="couponMessage.success ? 'c-success' : 'c-error'" class="ts-label">
          {{ couponMessage.text }}
        </p>

        <!-- Footer -->
        <div v-if="cartStore.cartItemsCount > 0" class="">
          <div class="cart-sidebar__summary">
            <div v-if="!showOnlyTotal" class="cart-sidebar__summary-row">
              <span>Subtotal ({{ cartStore.cartItemsCount }} items)</span>
              <span class="cart-sidebar__summary-price">{{ cartStore.cart?.subtotal }}</span>
            </div>

            <div
              v-if="getRawPrice(cartStore.cart?.shippingTotal) > 0"
              class="cart-sidebar__summary-row"
            >
              <span>Shipping</span>
              <span class="cart-sidebar__summary-price">{{
                cartStore.cart?.shippingTotal || '£0.00'
              }}</span>
            </div>

            <div v-if="getRawPrice(cartStore.cart?.totalTax) > 0" class="cart-sidebar__summary-row">
              <span>Tax</span>
              <span class="cart-sidebar__summary-price">{{ cartStore.cart?.totalTax }}</span>
            </div>

            <div
              v-if="getRawPrice(cartStore.cart?.discountTotal) > 0"
              class="cart-sidebar__summary-row"
            >
              <span>Discount</span>
              <span class="cart-sidebar__summary-price">
                -{{ cartStore.cart?.discountTotal }}
              </span>
            </div>

            <div class="cart-sidebar__summary-row cart-sidebar__summary-row--total">
              <span>Total</span>
              <span class="cart-sidebar__summary-price--total">
                {{ cartStore.cart?.total || '£0.00' }}
              </span>
            </div>
          </div>

          <div class="cart-sidebar__actions">
            <button class="" primary :disabled="isProcessingOrder" @click="processCheckout">
              {{ isProcessingOrder ? 'Processing...' : 'Place Order' }}
            </button>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, helpers } from '@vuelidate/validators'
import CartItem from '~/components/atoms/CartItem.vue'
import { usePostcode } from '~/composables/usePostcode'
import { isValidPostcodeFormat, getRawPrice } from '~/utils/helpers'

const cartStore = useCartStore()
const showOnlyTotal = ref(false)
const cartItems = computed(() => {
  return cartStore.cart?.contents?.nodes || []
})

// Enhanced Form Data with Address Fields
const formData = reactive({
  firstName: '',
  lastName: '',
  username: '',
  password: '',
  email: '',
  postcode: '',
  houseNumber: '',
  streetName: '',
  townCity: '',
  county: '',
  phone: '',
  coupon: '',
  shippingNotes: '',
  shippingMethod: '',
  paymentMethod: '',
})

// Use the postcode composable
const {
  postcodeStatus,
  streetSuggestion,
  showAddressForm,
  finalAddress,
  isPostcodeValid,
  lookupPostcode,
  resetAddressState,
  handleStreetConfirmation: handleStreetConfirmationComposable,
  editAddress,
} = usePostcode()

// Enhanced Validation Rules
const rules = {
  email: {
    required: helpers.withMessage('Email is required', required),
    email: helpers.withMessage('Invalid email address', email),
  },
  password: {
    required: helpers.withMessage('Password is required', required),
    minLength: helpers.withMessage('Minimum 6 characters', minLength(6)),
  },

  postcode: {
    required: helpers.withMessage('Address is required', required),
    validFormat: helpers.withMessage('Please enter a valid postcode', (value: string) => {
      if (!value) return true
      return isValidPostcodeFormat(value.trim())
    }),
    isValidPostcode: helpers.withMessage(
      () => {
        if (postcodeStatus.isLoading) return 'Validating postcode...'
        if (postcodeStatus.message && !postcodeStatus.isValid) {
          return postcodeStatus.message
        }
        return ' '
      },
      (value: string) => {
        if (!value) return true

        if (!isValidPostcodeFormat(value.trim())) {
          return true
        }

        return postcodeStatus.isValid || postcodeStatus.isLoading
      }
    ),
  },

  firstName: {
    required: helpers.withMessage('First name is required', required),
  },
  lastName: {
    required: helpers.withMessage('Last name is required', required),
  },
  houseNumber: {
    required: helpers.withMessage('House number/name is required', required),
  },
  streetName: {
    required: helpers.withMessage('Street name is required', required),
  },
  townCity: {
    required: helpers.withMessage('Town/City is required', required),
  },
  phone: {
    required: helpers.withMessage('Phone number is required', required),
    validPhone: helpers.withMessage('Please enter a valid phone number', (value: string) => {
      if (!value) return true

      const cleanPhone = value.replace(/[\s\-\(\)\.\+]/g, '')

      if (!/^\d+$/.test(cleanPhone)) return false

      return cleanPhone.length >= 10 && cleanPhone.length <= 15
    }),
  },
}

const v$ = useVuelidate(rules, formData)
const showCreateAccount = ref(false)

// Component-specific handlers that use the composable
const handlePostcodeInput = () => {
  if (formData.postcode.length < 3) {
    resetAddressState()
  }
}

const handlePostcodeLookup = async () => {
  if (!formData.postcode || formData.postcode.length < 5) return

  const result = await lookupPostcode(formData.postcode, formData)

  if (!result.success) {
    console.error('Postcode lookup failed:', result.error)
  }
}

const handleStreetConfirmation = (isCorrect: boolean) => {
  handleStreetConfirmationComposable(isCorrect, formData)
}

const couponMessage = ref<{ success: boolean; text: string } | null>(null)

const handleApplyCoupon = async () => {
  if (!formData.coupon) return
  couponMessage.value = null
  const result = await cartStore.applyCoupon(formData.coupon)
  if (result.success) {
    couponMessage.value = { success: true, text: 'Coupon applied successfully!' }
    formData.coupon = ''
  } else {
    couponMessage.value = { success: false, text: result.error || 'Failed to apply coupon' }
  }
}

// When shipping method changes, tell WooCommerce to update shipping rates on the cart
watch(
  () => formData.shippingMethod,
  async (newMethod) => {
    if (newMethod) {
      await cartStore.updateShippingMethod(newMethod)
    }
  },
)

const isProcessingOrder = ref(false)

const handleSubmit = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return

  isProcessingOrder.value = true

  try {
    const billing = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address1: `${formData.houseNumber} ${formData.streetName}`.trim(),
      city: formData.townCity,
      state: formData.county,
      postcode: formData.postcode,
      country: 'GB',
    }

    const { checkout } = await GqlCheckout({
      billing,
      shipping: billing,
      paymentMethod: formData.paymentMethod || 'cod',
      customerNote: formData.shippingNotes || '',
      shipToDifferentAddress: false,
      metaData: [{ key: 'order_via', value: 'AnnasBloom' }],
      isPaid: false,
    })

    if (checkout?.result === 'success' && checkout?.order?.databaseId) {
      // Clear the cart after successful checkout
      await cartStore.emptyCart()
      await cartStore.refreshCart()

      // Navigate to order confirmation
      navigateTo(`/order-summary?orderId=${checkout.order.databaseId}&key=${checkout.order.orderKey}`)
    } else {
      alert('There was an error processing your order. Please try again.')
    }
  } catch (error: any) {
    console.error('Checkout error:', error)
    const errorMsg = error?.gqlErrors?.[0]?.message || 'An error occurred during checkout.'
    alert(errorMsg)
  } finally {
    isProcessingOrder.value = false
  }
}

const updateQuantity = async (key: string, quantity: number) => {
  await cartStore.updateItemQuantity(key, quantity)
}

const processCheckout = async () => {
  await handleSubmit()
}

// Payment options from your cart
const paymentOptions = computed(() => {
  return cartStore.paymentGateways?.nodes
    ? cartStore.paymentGateways.nodes.map((gateway) => ({
        label: gateway.title,
        value: gateway.id,
        description: gateway.description,
      }))
    : [
        {
          label: 'Cash on Delivery',
          value: 'cod',
          description: 'Pay with cash upon delivery',
        },
      ]
})

// Shipping options from your cart
const shippingOptions = computed(() => {
  return (
    cartStore.cart?.availableShippingMethods?.[0]?.rates?.map((rate) => ({
      label: rate?.label || 'Unknown Shipping Method',
      value: rate?.id,
      description: 'Same day delivery',
      price: `£${parseFloat(rate.cost).toFixed(2)}`,
    })) || []
  )
})

</script>

<style scoped lang="scss">
.form-container {
  background: var(--c-white);
  padding: var(--space-2);
  border-radius: var(--radius-small);
  border: 1px solid var(--c-grey-light);
}

.data-section {
  flex: 1;
  max-width: 60rem;
}

aside {
  position: sticky;
  max-width: 28rem;
  top: 8rem;

  & .cart-item {
    padding: 0;
  }
}

.postcode-loading-spinner {
  position: absolute;
  right: var(--space-1);
  top: 50%;
  pointer-events: none;
}
</style>
