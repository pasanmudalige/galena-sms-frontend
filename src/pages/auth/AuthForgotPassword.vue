<template>
  <q-page class="flex flex-center">
    <ForgotPassword
      v-if="authStore.forgotPassword.step === 1"
      @onClickContinue="forgotPasswordStepOneDone"
    />
    <VerifyOtp
      v-if="authStore.forgotPassword.step === 2"
      @onClickVerify="forgotPasswordStepTwoDone"
    />
    <CreateNewPassword
      v-if="authStore.forgotPassword.step === 3"
      @onClickContinue="forgotPasswordStepThreeDone"
    />
    <PasswordUpdatedSuccess
      v-if="authStore.forgotPassword.step === 4"
      @onClickOkay="forgotPasswordStepFourDone"
    />
  </q-page>
</template>

<script setup>
import ForgotPassword from 'src/components/auth/ForgotPassword.vue'
import VerifyOtp from 'src/components/auth/VerifyOtp.vue'
import CreateNewPassword from 'src/components/auth/CreateNewPassword.vue'
import PasswordUpdatedSuccess from 'src/components/auth/PasswordUpdatedSuccess.vue'

import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth-store'
import { showErrorNotification } from 'src/utils/notification'
import { setAccessToken } from 'src/utils/cookie-storage'

defineOptions({
  name: 'AuthForgotPassword',
})
const authStore = useAuthStore()
const router = useRouter()

const forgotPasswordStepOneDone = async (email) => {
  const data = {
    email,
    step: 'FORGOTPASSWORD',
  }
  try {
    const response = await authStore.sendOtpApi(data)
    if (response.status === 200) {
      authStore.forgotPassword.step = 2
      authStore.forgotPassword.email = email
    }
  } catch (error) {
    console.error(error)
    if (error.status === 400) {
      showErrorNotification(error.response.data.message)
    } else {
      showErrorNotification('Internal Server Error')
    }
  }
}

const forgotPasswordStepTwoDone = async (otp) => {
  try {
    const response = await authStore.verifyOtpApi({
      email: authStore.forgotPassword.email,
      otp,
      step: 'FORGOTPASSWORD',
    })
    if (response.status === 200) {
      authStore.forgotPassword.step = 3
      setAccessToken(response.data.data.accessToken)
    }
  } catch (error) {
    console.error(error)
    if (error.status === 400) {
      showErrorNotification(error.response.data.message)
    } else {
      showErrorNotification('Internal Server Error')
    }
  }
}

const forgotPasswordStepThreeDone = async (password) => {
  try {
    const response = await authStore.updateAdminPaaswordApi({
      password,
    })
    if (response.status === 200) {
      authStore.forgotPassword.step = 4
    }
  } catch (error) {
    console.error(error)
    if (error.status === 400) {
      showErrorNotification(error.response.data.message)
    } else {
      showErrorNotification('Internal Server Error')
    }
  }
}

const forgotPasswordStepFourDone = () => {
  router.push('/')
}
</script>
