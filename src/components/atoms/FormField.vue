<template>
  <div class="form-field flow flow-gap-05" :class="{ 'has-error': hasError }">
    <!-- Label -->
    <label v-if="label" :for="inputId" class="form-label" :class="{ required: required }">
      {{ label }}
    </label>

    <div class="input-wrapper">
      <!-- Radio Buttons -->
      <div v-if="type === 'radio'" class="radio-group">
        <div
          v-for="option in options"
          :key="option.value"
          class="radio-option"
          :class="{ selected: modelValue === option.value }"
        >
          <label class="radio-label">
            <input
              :id="`${inputId}-${option.value}`"
              type="radio"
              :name="inputId"
              :value="option.value"
              :checked="modelValue === option.value"
              :disabled="disabled"
              class="radio-input"
              @change="handleInput"
            />
            <div class="radio-content">
              <div class="radio-info">
                <span class="radio-title">{{ option.label }}</span>
                <span v-if="option.description" class="radio-description">
                  {{ option.description }}
                </span>
              </div>
              <span v-if="option.price" class="radio-price">
                {{ option.price }}
              </span>
            </div>
          </label>
        </div>
      </div>

      <!-- Text Input -->
      <input
        v-else-if="type !== 'textarea' && type !== 'select'"
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        class="form-input"
        :class="inputClass"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <!-- Textarea -->
      <textarea
        v-else-if="type === 'textarea'"
        :id="inputId"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :rows="rows"
        class="form-input form-textarea"
        :class="inputClass"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <!-- Select -->
      <select
        v-else-if="type === 'select'"
        :id="inputId"
        :value="modelValue"
        :disabled="disabled"
        class="form-input form-select"
        :class="inputClass"
        @change="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <!-- Icon slot -->
      <span v-if="$slots.icon" class="input-icon">
        <slot name="icon" />
      </span>
    </div>

    <!-- Error messages -->
    <div v-if="hasError && showErrors" class="error-messages">
      <p v-for="error in errorMessages" :key="error" class="error-message">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BaseValidation } from '@vuelidate/core'

interface SelectOption {
  label: string
  value: string | number
  description?: string
  price?: string
}

interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'radio'
  label?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  autocomplete?: string
  inputClass?: string | string[] | object
  options?: SelectOption[] // For select and radio types
  rows?: number // For textarea
  validation?: BaseValidation // Vuelidate validation object
  showErrors?: boolean // Control when to show errors
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  readonly: false,
  required: false,
  rows: 3,
  showErrors: true,
  options: () => [],
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: []
  focus: []
}>()

const inputId = useId()

const hasError = computed(() => {
  return props.validation?.$error || false
})

const errorMessages = computed(() => {
  if (!props.validation?.$errors) return []

  return props.validation.$errors.map((error) => {
    return error.$message || 'Some error occurred'
  })
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  let value: string | number = target.value

  if (props.type === 'number' && value !== '') {
    value = Number(value)
  }

  emit('update:modelValue', value)

  if (props.validation) {
    props.validation.$touch()
  }
}

const handleBlur = () => {
  emit('blur')

  if (props.validation) {
    props.validation.$touch()
  }
}

const handleFocus = () => {
  emit('focus')
}
</script>

<style scoped>
.form-field {
  /* margin-bottom: var(--space-2); */
}

.form-label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--c-grey);
  font-size: var(--ts-tiny);
  margin-left: 0.3rem;
}

.form-label.required::after {
  content: ' *';
  color: var(--c-error);
}

.input-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid var(--c-grey-light);
  border-radius: var(--radius-small);
  font-size: var(--ts-body);
  transition: all 0.2s;
  background-color: var(--c-white);
}

.form-input:focus {
  outline: none;
  border-color: var(--c-grey);
}

.form-input:disabled {
  background-color: var(--c-grey-light);
  cursor: not-allowed;
  opacity: 0.6;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-select {
  cursor: pointer;
  padding-right: 2.5rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-1, 0.5rem);
  max-width: 15rem;
}

.radio-option {
  border: 2px solid var(--c-grey-light);
  border-radius: var(--radius-small);
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--c-main-color, var(--c-grey));
  }

  &.selected {
    border-color: var(--c-main-color, var(--c-grey));
    background-color: rgba(192, 121, 127, 0.05);
  }
}

.radio-label {
  display: block;
  padding: var(--space-1-5, 1rem);
  cursor: pointer;
  width: 100%;
}

.radio-input {
  margin-right: var(--space-1, 0.5rem);
}

.radio-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.radio-info {
  display: flex;
  flex-direction: column;
}

.radio-title {
  font-weight: 600;
  margin-bottom: var(--space-05, 0.25rem);
}

.radio-description {
  font-size: 0.9rem;
  color: var(--c-grey-dark, #666);
}

.radio-price {
  font-weight: 600;
  color: var(--c-main-color, var(--c-grey));
}

.has-error .form-input {
  border-color: var(--c-error);
}

.has-error .form-input:focus {
  border-color: var(--c-error);
  /* ring-color: rgba(239, 68, 68, 0.1); */
}

.has-error .radio-option {
  border-color: var(--c-error);
}

.input-icon {
  position: absolute;
  right: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--c-grey);
  pointer-events: none;
}

.error-messages {
  margin-top: 0.375rem;
}

.error-message {
  padding-top: var(--space-05);
  color: var(--c-error);
  font-size: var(--ts-tiny);
}
</style>
