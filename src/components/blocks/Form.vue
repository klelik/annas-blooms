<!-- components/SimpleLoginForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="pb-1">
    <div class="grid grid-max-cols-2" data-repel>
      <FormField
        v-model="formData.firstName"
        type="text"
        label="First Name"
        placeholder="John"
        :validation="v$.firstName"
      />

      <FormField
        v-model="formData.lastName"
        type="text"
        label="Last Name"
        placeholder="Lika"
        :validation="v$.lastName"
      />

      <!-- Password Field -->
      <FormField
        v-model="formData.password"
        class="grid-col-span-full"
        type="password"
        label="Password"
        placeholder="Enter your password"
        :validation="v$.password"
      />

      <!-- Email Field -->
      <FormField
        v-model="formData.email"
        type="email"
        label="Email"
        placeholder="Enter your email"
        :validation="v$.email"
      />
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      class="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
    >
      Login
    </button>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, helpers } from '@vuelidate/validators'

// Form data
const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
})

// Validation rules
const rules = {
  email: {
    required: helpers.withMessage('Email is required', required),
    email: helpers.withMessage('Invalid email format', email),
  },
  password: {
    required: helpers.withMessage('Password is required', required),
    minLength: helpers.withMessage('Minimum 6 characters', minLength(6)),
  },
}

// Initialize validation
const v$ = useVuelidate(rules, formData)

// Handle form submission
const handleSubmit = async () => {
  const isValid = await v$.value.$validate()

  if (isValid) {
    // Handle login logic here
  }
}
</script>
