<template>
  <q-page
    class="flex flex-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
  >
    <div class="w-full max-w-md px-6">
      <!-- Login Card -->
      <div class="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-95">
        <!-- Header Section -->
        <div class="text-center mb-8">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl mb-4 shadow-lg"
          >
            <q-icon name="lock" size="32px" color="white" />
          </div>
          <img
            src="~assets/galena.png"
            alt="Logo"
            class="q-mb-lg"
            style="width: 300px; height: auto"
          />
          <p class="text-gray-500 text-sm">Sign in to continue to your account</p>
        </div>

        <!-- Form -->
        <q-form @submit="onSubmit" class="space-y-5">
          <!-- Email Input -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 block">Email Address</label>
            <q-input
              outlined
              placeholder="Enter your email"
              v-model="form.email"
              type="email"
              :rules="rules.email"
              class="modern-input"
            >
              <template v-slot:prepend>
                <q-icon name="email" color="grey-6" />
              </template>
            </q-input>
          </div>

          <!-- Password Input -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 block">Password</label>
            <q-input
              outlined
              placeholder="Enter your password"
              v-model="form.password"
              :type="showNewPassword ? 'text' : 'password'"
              :rules="rules.passwordLogin"
              class="modern-input"
            >
              <template v-slot:prepend>
                <q-icon name="key" color="grey-6" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="showNewPassword ? 'visibility' : 'visibility_off'"
                  @click="toggleNewPassword"
                  class="cursor-pointer text-grey-6 hover:text-primary transition-colors"
                />
              </template>
            </q-input>
          </div>

          <!-- Forgot Password Link -->
          <div class="flex justify-end">
            <div
              @click="navigateToForgotPassword"
              class="text-sm text-primary hover:text-purple-600 cursor-pointer font-medium transition-colors"
            >
              Forgot Password?
            </div>
          </div>

          <!-- Submit Button -->
          <q-btn
            no-caps
            unelevated
            label="Sign In"
            type="submit"
            color="primary"
            class="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-purple-600 text-black rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          />
        </q-form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white text-gray-500">Or</span>
          </div>
        </div>

        <!-- Additional Options -->
        <div class="text-center">
          <p class="text-sm text-gray-600">
            Don't have an account?
            <span
              class="text-primary hover:text-purple-600 cursor-pointer font-medium transition-colors"
            >
              Sign up
            </span>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-6 text-sm text-gray-500">
        Copyright © 2025 - Werzuo IT Solutions (PVT) Ltd. All Rights Reserved.
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { showSuccessNotification, showErrorNotification } from 'src/utils/notification'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth-store'
import { rules } from 'src/utils/validation-rules'
import { setAccessToken } from 'src/utils/cookie-storage'

defineOptions({
  name: 'AuthLogin',
})

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: '',
  isWeb: true,
})

const showNewPassword = ref(false)

const toggleNewPassword = () => {
  showNewPassword.value = !showNewPassword.value
}

const onSubmit = async () => {
  try {
    const response = await authStore.loginApi(form.value)
    console.log(response)
    if (response.status === 200) {
      if (response.data.code === 200) {
        const token = response.data.accessToken
        if (token) setAccessToken(token)
        showSuccessNotification('Successfully logged in')
        router.push('/admin/dashboard')
      } else {
        console.log('no access')
        showErrorNotification(response.data.message)
      }
    }
  } catch (error) {
    console.error(error)
    if (error.status === 400 || error.status === 403) {
      showErrorNotification(error.response.data.message)
    } else {
      showErrorNotification('Internal Server Error')
    }
  }
}

const navigateToForgotPassword = () => {
  router.push('/forgot-password')
}
</script>

<style scoped>
.modern-input :deep(.q-field__control) {
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.modern-input :deep(.q-field__control:hover) {
  border-color: var(--q-primary);
}

.modern-input :deep(.q-field__control):focus-within {
  border-color: var(--q-primary);
  box-shadow: 0 0 0 3px rgba(var(--q-primary-rgb), 0.1);
}
</style>
