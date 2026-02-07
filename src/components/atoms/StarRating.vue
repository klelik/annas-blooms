<template>
  <div class="rating" :class="{ 'rating--static': static }" ref="ratingRef">
    <div class="rating__stars">
      <!-- Static display -->
      <template v-if="static">
        <div v-for="star in 5" :key="`static-${star}`" class="rating__label rating__label--static">
          <svg class="rating__star" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
            <g transform="translate(16,16)">
              <circle
                class="rating__star-ring"
                fill="none"
                stroke="#000"
                stroke-width="16"
                r="8"
                transform="scale(0)"
              />
            </g>
            <g stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <g transform="translate(16,16) rotate(180)">
                <polygon
                  class="rating__star-stroke"
                  :class="{ 'rating__star-stroke--active': star <= modelValue }"
                  points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07"
                  fill="none"
                />
                <polygon
                  class="rating__star-fill"
                  :class="{ 'rating__star-fill--active': star <= modelValue }"
                  points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07"
                  fill="#000"
                />
              </g>
              <g transform="translate(16,16)" stroke-dasharray="12 12" stroke-dashoffset="12">
                <polyline
                  class="rating__star-line"
                  :class="{ 'rating__star-line--active': star <= modelValue }"
                  transform="rotate(0)"
                  points="0 4,0 16"
                />
                <polyline
                  class="rating__star-line"
                  :class="{ 'rating__star-line--active': star <= modelValue }"
                  transform="rotate(72)"
                  points="0 4,0 16"
                />
                <polyline
                  class="rating__star-line"
                  :class="{ 'rating__star-line--active': star <= modelValue }"
                  transform="rotate(144)"
                  points="0 4,0 16"
                />
                <polyline
                  class="rating__star-line"
                  :class="{ 'rating__star-line--active': star <= modelValue }"
                  transform="rotate(216)"
                  points="0 4,0 16"
                />
                <polyline
                  class="rating__star-line"
                  :class="{ 'rating__star-line--active': star <= modelValue }"
                  transform="rotate(288)"
                  points="0 4,0 16"
                />
              </g>
            </g>
          </svg>
        </div>
      </template>

      <!-- Interactive rating -->
      <template v-else>
        <!-- Radio inputs -->
        <input
          v-for="star in 5"
          :id="`rating-${star}`"
          :key="`input-${star}`"
          v-model="selectedRating"
          :class="`rating__input rating__input-${star}`"
          type="radio"
          name="rating"
          :value="star"
          @change="updateRating(star)"
        />

        <!-- Labels with SVG stars -->
        <label
          v-for="star in 5"
          :key="`label-${star}`"
          :class="`rating__label ${animationClasses[star] || ''}`"
          :for="`rating-${star}`"
        >
          <svg class="rating__star" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
            <g transform="translate(16,16)">
              <circle
                class="rating__star-ring"
                fill="none"
                stroke="#000"
                stroke-width="16"
                r="8"
                transform="scale(0)"
              />
            </g>
            <g stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <g transform="translate(16,16) rotate(180)">
                <polygon
                  class="rating__star-stroke"
                  points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07"
                  fill="none"
                />
                <polygon
                  class="rating__star-fill"
                  points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07"
                  fill="#000"
                />
              </g>
              <g transform="translate(16,16)" stroke-dasharray="12 12" stroke-dashoffset="12">
                <polyline class="rating__star-line" transform="rotate(0)" points="0 4,0 16" />
                <polyline class="rating__star-line" transform="rotate(72)" points="0 4,0 16" />
                <polyline class="rating__star-line" transform="rotate(144)" points="0 4,0 16" />
                <polyline class="rating__star-line" transform="rotate(216)" points="0 4,0 16" />
                <polyline class="rating__star-line" transform="rotate(288)" points="0 4,0 16" />
              </g>
            </g>
          </svg>
          <span class="rating__sr">{{ star }} star—{{ descriptions[star] }}</span>
        </label>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  descriptions: {
    type: Object,
    default: () => ({
      1: 'Terrible',
      2: 'Bad',
      3: 'OK',
      4: 'Good',
      5: 'Excellent',
    }),
  },
  static: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const selectedRating = ref(props.modelValue)
const animationClasses = reactive({})
const ratingRef = ref(null)

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    selectedRating.value = newValue
  }
)

const updateRating = (newRating) => {
  // Don't update if in static mode
  if (props.static) return

  // Clear all animation classes
  for (let i = 1; i <= 5; i++) {
    animationClasses[i] = ''
  }

  const prevRatingID = selectedRating.value || 0
  let delay = 0

  // Add animation delays for cascade effect
  for (let id = 1; id <= 5; id++) {
    if (id > prevRatingID + 1 && id <= newRating) {
      delay++
      animationClasses[id] = `rating__label--delay${delay}`
    }
  }

  selectedRating.value = newRating
  emit('update:modelValue', newRating)
  emit('change', { rating: newRating, description: props.descriptions[newRating] || '' })
}
</script>

<style lang="scss" scoped>
.rating {
  margin: auto;

  &__display {
    font-size: 1em;
    font-weight: 500;
    position: absolute;
    top: 100%;
    width: 100%;
    text-align: center;
  }

  &__stars {
    display: flex;
    position: relative;
  }

  &__star {
    display: block;
    overflow: visible;
    pointer-events: none;
    width: 0.9em;
    height: 0.9em;

    .big & {
      width: 1.8em;
      height: 1.8em;
    }
  }

  &__star {
    display: block;
    overflow: visible;
    pointer-events: none;
    width: 0.9em;
    height: 0.9em;

    &-ring,
    &-fill,
    &-line,
    &-stroke {
      animation-duration: 1s;
      animation-timing-function: ease-in-out;
      animation-fill-mode: forwards;
    }

    &-ring,
    &-fill,
    &-line {
      stroke: #f4a31d;
    }

    &-fill {
      fill: #f4a31d;
      transform: scale(0);
      transition:
        fill 0.3s cubic-bezier(0.42, 0, 0.58, 1),
        transform 0.3s cubic-bezier(0.42, 0, 0.58, 1);
    }

    &-line {
      stroke-dasharray: 12 13;
      stroke-dashoffset: -13;
    }

    &-stroke {
      stroke: #c9cad1;
      transition: stroke 0.3s;
    }
  }

  &__label {
    cursor: pointer;
    padding: 0.125em;

    &--delay1 &__star-ring,
    &--delay1 &__star-fill,
    &--delay1 &__star-line,
    &--delay1 &__star-stroke {
      animation-delay: 0.05s;
    }

    &--delay2 &__star-ring,
    &--delay2 &__star-fill,
    &--delay2 &__star-line,
    &--delay2 &__star-stroke {
      animation-delay: 0.1s;
    }

    &--delay3 &__star-ring,
    &--delay3 &__star-fill,
    &--delay3 &__star-line,
    &--delay3 &__star-stroke {
      animation-delay: 0.15s;
    }

    &--delay4 &__star-ring,
    &--delay4 &__star-fill,
    &--delay4 &__star-line,
    &--delay4 &__star-stroke {
      animation-delay: 0.2s;
    }
  }

  &__input {
    position: absolute;
    -webkit-appearance: none;
    appearance: none;
  }

  // Display interactions
  &__input:hover ~ [data-rating]:not([hidden]) {
    display: none;
  }

  &__input-1:hover ~ [data-rating='1'][hidden],
  &__input-2:hover ~ [data-rating='2'][hidden],
  &__input-3:hover ~ [data-rating='3'][hidden],
  &__input-4:hover ~ [data-rating='4'][hidden],
  &__input-5:hover ~ [data-rating='5'][hidden],
  &__input:checked:hover ~ [data-rating]:not([hidden]) {
    display: block;
  }

  // Star hover states
  &__input-1:hover ~ &__label:first-of-type &__star-stroke,
  &__input-2:hover ~ &__label:nth-of-type(-n + 2) &__star-stroke,
  &__input-3:hover ~ &__label:nth-of-type(-n + 3) &__star-stroke,
  &__input-4:hover ~ &__label:nth-of-type(-n + 4) &__star-stroke,
  &__input-5:hover ~ &__label:nth-of-type(-n + 5) &__star-stroke {
    stroke: #f4a31d;
    transform: scale(1);
  }

  // Checked animations
  &__input-1:checked ~ &__label:first-of-type &__star-ring,
  &__input-2:checked ~ &__label:nth-of-type(-n + 2) &__star-ring,
  &__input-3:checked ~ &__label:nth-of-type(-n + 3) &__star-ring,
  &__input-4:checked ~ &__label:nth-of-type(-n + 4) &__star-ring,
  &__input-5:checked ~ &__label:nth-of-type(-n + 5) &__star-ring {
    animation-name: starRing;
  }

  &__input-1:checked ~ &__label:first-of-type &__star-stroke,
  &__input-2:checked ~ &__label:nth-of-type(-n + 2) &__star-stroke,
  &__input-3:checked ~ &__label:nth-of-type(-n + 3) &__star-stroke,
  &__input-4:checked ~ &__label:nth-of-type(-n + 4) &__star-stroke,
  &__input-5:checked ~ &__label:nth-of-type(-n + 5) &__star-stroke {
    animation-name: starStroke;
  }

  &__input-1:checked ~ &__label:first-of-type &__star-line,
  &__input-2:checked ~ &__label:nth-of-type(-n + 2) &__star-line,
  &__input-3:checked ~ &__label:nth-of-type(-n + 3) &__star-line,
  &__input-4:checked ~ &__label:nth-of-type(-n + 4) &__star-line,
  &__input-5:checked ~ &__label:nth-of-type(-n + 5) &__star-line {
    animation-name: starLine;
  }

  &__input-1:checked ~ &__label:first-of-type &__star-fill,
  &__input-2:checked ~ &__label:nth-of-type(-n + 2) &__star-fill,
  &__input-3:checked ~ &__label:nth-of-type(-n + 3) &__star-fill,
  &__input-4:checked ~ &__label:nth-of-type(-n + 4) &__star-fill,
  &__input-5:checked ~ &__label:nth-of-type(-n + 5) &__star-fill {
    animation-name: starFill;
  }

  // Hover fill transparency fix
  &__input-1:not(:checked):hover ~ &__label:first-of-type &__star-fill,
  &__input-2:not(:checked):hover ~ &__label:nth-of-type(2) &__star-fill,
  &__input-3:not(:checked):hover ~ &__label:nth-of-type(3) &__star-fill,
  &__input-4:not(:checked):hover ~ &__label:nth-of-type(4) &__star-fill,
  &__input-5:not(:checked):hover ~ &__label:nth-of-type(5) &__star-fill {
    fill: transparent;
  }

  // Screen reader text
  &__sr {
    clip: rect(1px, 1px, 1px, 1px);
    overflow: hidden;
    position: absolute;
    width: 1px;
    height: 1px;
  }
}

// Static mode styles
.rating--static {
  .rating__label {
    cursor: default;
    pointer-events: none;

    &--static {
      display: flex;
    }
  }

  .rating__star-stroke--active {
    stroke: #f4a31d;
  }

  .rating__star-fill--active {
    fill: #f4a31d;
    transform: scale(1);
  }

  .rating__star-line--active {
    stroke-dashoffset: -13;
  }
}

// Dark theme
@media (prefers-color-scheme: dark) {
  .rating__star-stroke {
    stroke: #424551;
  }
}

@keyframes starRing {
  from,
  20% {
    animation-timing-function: ease-in;
    opacity: 1;
    r: 8px;
    stroke-width: 16px;
    transform: scale(0);
  }
  35% {
    animation-timing-function: ease-out;
    opacity: 0.5;
    r: 8px;
    stroke-width: 16px;
    transform: scale(1);
  }
  50%,
  to {
    opacity: 0;
    r: 16px;
    stroke-width: 0;
    transform: scale(1);
  }
}

@keyframes starFill {
  from,
  40% {
    animation-timing-function: ease-out;
    transform: scale(0);
  }
  60% {
    animation-timing-function: ease-in-out;
    transform: scale(1.2);
  }
  80% {
    transform: scale(0.9);
  }
  to {
    transform: scale(1);
  }
}

@keyframes starStroke {
  from {
    transform: scale(1);
  }
  20%,
  to {
    transform: scale(0);
  }
}

@keyframes starLine {
  from,
  40% {
    animation-timing-function: ease-out;
    stroke-dasharray: 1 23;
    stroke-dashoffset: 1;
  }
  60%,
  to {
    stroke-dasharray: 12 13;
    stroke-dashoffset: -13;
  }
}
</style>
