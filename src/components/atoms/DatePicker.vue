<template>
  <div class="datepicker" ref="datepickerRef">
    <input
      type="text"
      class="datepicker__input"
      :value="formattedDate"
      :placeholder="placeholder"
      @click="toggleCalendar"
      @focus="handleFocus"
      @blur="handleBlur"
      readonly
    />
    <svg
      class="datepicker__icon"
      @click="toggleCalendar"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>

    <Transition name="calendar-transition">
      <div v-if="isOpen" class="datepicker__calendar calendar">
        <div class="calendar__header">
          <button @click="previousMonth" class="calendar__nav calendar__nav--prev">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <div class="calendar__title">{{ currentMonth.format('MMMM YYYY') }}</div>
          <button @click="nextMonth" class="calendar__nav calendar__nav--next">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        <div class="calendar__weekdays">
          <div v-for="(day, index) in weekDays" :key="index" class="calendar__weekday">
            {{ day }}
          </div>
        </div>

        <div class="calendar__days">
          <div
            v-for="day in calendarDays"
            :key="day.format('YYYY-MM-DD')"
            class="calendar__day"
            :class="{
              'calendar__day--other-month': !day.isSame(currentMonth, 'month'),
              'calendar__day--selected': isSelectedDate(day),
              'calendar__day--today': day.isSame(today, 'day'),
              'calendar__day--disabled': isDisabled(day),
            }"
            @click="selectDate(day)"
          >
            {{ day.date() }}
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDayjs } from '#dayjs'
import type { Dayjs } from 'dayjs'

const dayjs = useDayjs()

interface Props {
  modelValue?: string
  min?: string
  max?: string
  placeholder?: string
  format?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  min: undefined,
  max: undefined,
  placeholder: 'Select date',
  format: 'D MMMM YYYY',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const datepickerRef = ref<HTMLElement>()
const isOpen = ref(false)
const today = dayjs()
const currentMonth = ref(dayjs())

// Get weekday abbreviations using dayjs locale data
const weekDays = computed(() => {
  const days = []
  for (let i = 0; i < 7; i++) {
    days.push(dayjs().day(i).format('ddd').substring(0, 2))
  }
  return days
})

const selectedDate = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
})

const formattedDate = computed(() => {
  if (!selectedDate.value) return ''
  return dayjs(selectedDate.value).format(props.format)
})

const calendarDays = computed((): Dayjs[] => {
  const days: Dayjs[] = []
  const firstDay = currentMonth.value.startOf('month')
  const firstDayOfWeek = firstDay.day() // 0 = Sunday, 1 = Monday, etc.
  const startDate = firstDay.subtract(firstDayOfWeek, 'day') // Start from the previous Sunday

  // Generate 42 days (6 weeks)
  for (let i = 0; i < 42; i++) {
    days.push(startDate.add(i, 'day'))
  }

  return days
})

const toggleCalendar = () => {
  // If opening the calendar and there's a selected date, show that month
  if (!isOpen.value && selectedDate.value) {
    currentMonth.value = dayjs(selectedDate.value).startOf('month')
  }
  isOpen.value = !isOpen.value
}

const closeCalendar = (event: MouseEvent) => {
  if (datepickerRef.value && !datepickerRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

const previousMonth = () => {
  currentMonth.value = currentMonth.value.subtract(1, 'month')
}

const nextMonth = () => {
  currentMonth.value = currentMonth.value.add(1, 'month')
}

const selectDate = (day: Dayjs) => {
  if (isDisabled(day)) return

  selectedDate.value = day.format('YYYY-MM-DD')
  isOpen.value = false
}

const isSelectedDate = (day: Dayjs): boolean => {
  if (!selectedDate.value) return false
  return day.isSame(dayjs(selectedDate.value), 'day')
}

const isDisabled = (day: Dayjs): boolean => {
  if (props.min && day.isBefore(dayjs(props.min), 'day')) return true
  if (props.max && day.isAfter(dayjs(props.max), 'day')) return true
  return false
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

onMounted(() => {
  document.addEventListener('click', closeCalendar)

  // Set initial month from selected date or min date
  if (selectedDate.value) {
    currentMonth.value = dayjs(selectedDate.value).startOf('month')
  } else if (props.min) {
    currentMonth.value = dayjs(props.min).startOf('month')
  }
})

onUnmounted(() => {
  document.removeEventListener('click', closeCalendar)
})
</script>

<style lang="scss" scoped>
// Block
.datepicker {
  position: relative;
  width: 100%;
  max-width: 20rem;

  // Elements
  &__input {
    display: block;
    width: 100%;
    padding: 0.75rem 2.5rem 0.75rem 1rem;
    font-size: 0.875rem;
    font-family: inherit;
    line-height: 1.5;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
    cursor: pointer;
    background-color: var(--c-white);
    border: 1px solid var(--c-grey-light);
    color: var(--c-grey);

    &::placeholder {
      color: var(--c-grey);
    }

    &:focus {
      outline: none;
      border-color: var(--c-main-color);
      box-shadow: 0 0 0 3px rgba(192, 121, 127, 0.15);
    }

    &:hover:not(:focus) {
      border-color: var(--c-rich-brown-secondary);
    }
  }

  &__icon {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--c-grey);
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: var(--c-main-color);
    }
  }

  &__calendar {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    z-index: 50;
    min-width: 280px;
  }
}

// Calendar Block
.calendar {
  background: var(--c-warm-white);
  border: 1px solid var(--c-grey-light);
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(30, 30, 30, 0.15);
  padding: 1rem;

  // Elements
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  &__title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--c-rich-brown);
  }

  &__nav {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    border-radius: 0.375rem;
    cursor: pointer;
    color: var(--c-grey);
    transition: all 0.2s ease;

    svg {
      stroke-width: 2.5;
    }

    &:hover {
      background-color: rgba(192, 121, 127, 0.1);
      color: var(--c-main-color);
    }

    // Modifiers
    &--prev {
      margin-right: auto;
    }

    &--next {
      margin-left: auto;
    }
  }

  &__weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.25rem;
    margin-bottom: 0.5rem;
  }

  &__weekday {
    text-align: center;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--c-rich-brown-secondary);
    padding: 0.25rem;
  }

  &__days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.25rem;
  }

  &__day {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--c-dark-soil);

    &:hover:not(&--disabled) {
      background-color: rgba(192, 121, 127, 0.1);
      color: var(--c-main-color);
    }

    // Modifiers
    &--other-month {
      color: var(--c-grey-light);
    }

    &--selected {
      background-color: var(--c-main-color);
      color: var(--c-white);
      font-weight: 600;

      &:hover {
        background-color: var(--c-rich-brown);
      }
    }

    &--today {
      position: relative;
      font-weight: 600;
      color: var(--c-main-color);

      &::after {
        content: '';
        position: absolute;
        bottom: 0.125rem;
        left: 50%;
        transform: translateX(-50%);
        width: 0.25rem;
        height: 0.25rem;
        border-radius: 50%;
        background-color: var(--c-main-color);
      }

      &.calendar__day--selected::after {
        background-color: var(--c-white);
      }
    }

    &--disabled {
      color: var(--c-disabled);
      cursor: not-allowed;
      opacity: 0.5;

      &:hover {
        background-color: transparent;
      }
    }
  }
}

// Transition animations
.calendar-transition {
  &-enter-active,
  &-leave-active {
    transition: all 0.2s ease;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translateY(-0.5rem);
  }
}

// Responsive
@media (max-width: 640px) {
  .datepicker {
    &__calendar {
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
