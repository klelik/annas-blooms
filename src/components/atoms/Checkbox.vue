<template>
  <div class="checkbox">
    <input
      :id="id"
      class="checkbox__input"
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <label class="checkbox__label" :for="id">
      <span class="checkbox__box">
        <svg width="12" height="10">
          <use xlink:href="#check" />
        </svg>
      </span>
      <span class="checkbox__text">{{ label }}</span>
    </label>

    <svg class="checkbox__sprite">
      <symbol id="check" viewBox="0 0 12 10">
        <polyline points="1.5 6 4.5 9 10.5 1" />
      </symbol>
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string
  label: string
  modelValue: boolean
}>()

defineEmits(['update:modelValue'])
</script>

<style scoped lang="scss">
.checkbox {
  position: relative;
  display: inline-block;

  &__input {
    position: absolute;
    visibility: hidden;
  }

  &__label {
    display: flex;
    align-items: center;
    cursor: pointer;
    border-radius: var(--radius-default);
  }

  &__box {
    position: relative;
    width: 18px;
    height: 18px;
    border-radius: 4px;
    border: 1px solid #cccfdb;
    box-shadow: 0 1px 1px rgba(#00104b, 0.05);
    background-color: var(--c-white);
    transition: all 0.2s ease;

    svg {
      position: absolute;
      top: 3px;
      left: 2px;
      fill: none;
      stroke: var(--c-white);
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: 16px;
      stroke-dashoffset: 16px;
      transition: stroke-dashoffset 0.3s ease;
    }
  }

  &__text {
    line-height: 18px;
    font-size: 14px;
    margin-left: var(--space-1);
  }

  &__input:checked + .checkbox__label .checkbox__box {
    background: var(--c-main-color);
    border-color: var(--c-main-color);

    svg {
      stroke-dashoffset: 0;
    }
  }

  &__sprite {
    position: absolute;
    width: 0;
    height: 0;
    pointer-events: none;
    user-select: none;
  }
}
</style>
