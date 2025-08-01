<template>
  <q-page class="flex flex-center">
    <AdminRegister v-if="registerStep === 1" @adminRegisterClicked="adminRegisterClicked" />
    <CreateNewPassword
      v-if="registerStep === 2"
      @onClickContinue="createNewPasswordContinue"
    />
    <PasswordUpdatedSuccess
       v-if="registerStep === 3"
      @onClickOkay="passwordSuccessOkClick"
    />
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import AdminRegister from 'src/components/auth/AdminRegister.vue'
import CreateNewPassword from 'src/components/auth/CreateNewPassword.vue'
import PasswordUpdatedSuccess from 'src/components/auth/PasswordUpdatedSuccess.vue'
import { useAuthStore } from 'src/stores/auth-store'
import { showErrorNotification } from 'src/utils/notification'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'AuthRegister'
})

const registerStep = ref(1)
const authStore = useAuthStore()
const router = useRouter()

const adminRegisterClicked = async (data) => {
  try {
    const response = await authStore.updateAdminRegisterDataApi(data)
    if (response.status === 200) {
      registerStep.value = 2
    }
  } catch (error) {
    console.error(error)
  }
}

const createNewPasswordContinue = async (password) => {
  try {
    const response = await authStore.updateAdminPaaswordApi({
      password
    })
    if (response.status === 200) {
      registerStep.value = 3
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

const passwordSuccessOkClick = () => {
  router.push('/')
}

</script>
