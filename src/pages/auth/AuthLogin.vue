<template>
  <q-page class="flex flex-center">
    <q-form @submit="onSubmit" class="w-[374px]">
      <p class="text-[32px] font-semibold leading-7 mb-6">Login</p>

      <q-input
        outlined
        placeholder="Email"
        v-model="form.email"
        type="email"
        :rules="rules.email"
        dense
      />

      <q-input
        outlined
        placeholder="Password"
        v-model="form.password"
        :type="showNewPassword ? 'text' : 'password'"
        :rules="rules.passwordLogin"
        dense
      >
        <template v-slot:append>
          <q-icon
            :name="showNewPassword ? 'visibility' : 'visibility_off'"
            @click="toggleNewPassword"
            class="cursor-pointer"
          />
        </template>
      </q-input>

      <q-btn
        no-caps
        unelevated
        label="Submit"
        type="submit"
        color="primary"
        class="mbi-btn w-full"
      />

      <div
        @click="navigateToForgotPassword"
        class="cursor-pointer mt-6 w-full text-center text-primary"
      >
        Forgot Your Password?
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { showSuccessNotification, showErrorNotification } from 'src/utils/notification'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth-store'
import { rules } from 'src/utils/validation-rules'

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
const showNewPassword = ref(false) // For toggling new password visibility
// Methods to toggle password visibility
const toggleNewPassword = () => {
  showNewPassword.value = !showNewPassword.value
}
const onSubmit = async () => {
  try {
    const response = await authStore.loginApi(form.value)
    console.log(response)
    if (response.status === 200) {
      if (response.data.code === 200) {
        authStore.setAuthObject(response.data.data)
        showSuccessNotification('Successfully logged in')
        router.push('/dashboard')
      } else {
        console.log('no access')
        showErrorNotification(response.data.message)
      }

      // if (authStore.auth.view === 'ADMIN_VIEW' || authStore.auth.view === 'SUPER_ADMIN_VIEW') {
      //   const grantedRoutesArray = await authStore.adminDashboardRouteBuild()
      //   if (grantedRoutesArray.length > 0) {
      //     router.push(grantedRoutesArray[0].route)
      // showSuccessNotification('Successfully logged in')
      //   } else {
      //     showErrorNotification("You don't have access. Please contact Admin")
      //   }
      // } else {
      //   showErrorNotification(
      //     'Sorry, you don’t have the necessary permissions to access this page.',
      //   )
      // }
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
