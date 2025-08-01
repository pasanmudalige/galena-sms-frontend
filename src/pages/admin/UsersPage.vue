<template>
  <q-page>
    <div class="space-y-5 px-6">
      <div class="flex justify-end items-center">
        <q-input
          @update:model-value="(val) => searchUsers(val)"
          dense
          outlined
          placeholder="Search"
          debounce="300"
          v-model="searchUser"
        >
          <template v-slot:append>
            <q-icon name="search" color="grey-5"/>
          </template>
        </q-input>
      </div>

      <q-table
        flat
        bordered
        :rows="rows"
        :columns="columns"
        row-key="id"
        :pagination="{
          rowsPerPage: 20,
        }"
        style="max-height: calc(100vh - 250px)"
        :loading="false"
      >
        <template v-slot:loading>
          <q-inner-loading showing>
            <q-spinner-hourglass color="primary" size="2em" />
          </q-inner-loading>
        </template>

        <!-- date -->
        <template v-slot:body-cell-birthday="props">
          <q-td :props="props">
            {{ convertGivenDateToGivenFormat(props.row.birthday, "yyyy/MM/dd") }}
          </q-td>
        </template>

        <!-- actions -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              @click="onClickDeleteHandle(props.row)"
              icon="delete"
              flat
              size="sm"
              round
              aria-label="Delete"
            >
              <q-tooltip> Delete </q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <!-- <template v-slot:no-data>
          <div class="w-full row flex-center space-x-1">
            <q-icon size="2em" name="sentiment_dissatisfied" />
            <span> Oops, it's empty...! </span>
          </div>
        </template> -->
        <!-- No Data / Loading -->
        <template v-slot:no-data>
          <div class="w-full row flex-center space-x-1">
            <q-icon v-if="!isLoading" size="2em" name="sentiment_dissatisfied" />
            <span v-if="!isLoading"> Oops, it's empty...! </span>
            <q-inner-loading v-else showing>
              <q-spinner-hourglass color="primary" size="2em" />
            </q-inner-loading>
          </div>
        </template>
      </q-table>
    </div>
  </q-page>

  <!-- Dialogs -->
  <q-dialog persistent v-model="showConfirmationPopup">
    <ConfirmationPopup
      v-bind="confirmationPopupData"
      @yesClicked="deleteUser"
    />
  </q-dialog>
</template>

<script setup>
import ConfirmationPopup from 'components/popups/ConfirmationPopup.vue'
import { onBeforeMount, ref } from 'vue'
import { useUserStore } from 'src/stores/user-store'
import {
  removeObjectById
} from 'src/utils/common-utlits'
import {
  showErrorNotification,
  showSuccessNotification
} from 'src/utils/notification'
import { convertGivenDateToGivenFormat } from 'src/utils/date-converts'

defineOptions({
  name: 'UserManagePage'
})
onBeforeMount(() => {
  getAllUsers()
})

const userStore = useUserStore()
const showAdminViewBibleVersePopup = ref(false)
const showConfirmationPopup = ref(false)
const confirmationPopupData = ref({})
const searchUser = ref('')
const rows = ref([])
const allInitialData = ref([])
const isLoading = ref(true)
const columns = [
  {
    name: 'fullname',
    label: 'Name',
    align: 'left',
    field: (row) => row.fullname,
    sortable: false
  },
  {
    name: 'email',
    label: 'Email',
    align: 'left',
    field: (row) => row.email,
    sortable: false
  },
  {
    name: 'gender',
    label: 'Gender',
    align: 'left',
    field: (row) => row.gender,
    sortable: false
  },
  {
    name: 'birthday',
    label: 'Birthday',
    align: 'left',
    field: (row) => row.birthday,
    sortable: false
  },
  {
    name: 'phone',
    label: 'Phone',
    align: 'left',
    field: (row) => row.phone,
    sortable: false
  },
  {
    name: 'actions',
    label: 'Action',
    align: 'center',
    sortable: false
  }
]

const searchUsers = (value) => {
  const searchValue = value.replace(/^\s+/, '')

  if (searchValue) {
    rows.value = allInitialData.value.filter((user) => {
      if (user.fullname && user.email) {
        return (
          user.fullname.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.email.toLowerCase().includes(searchValue.toLowerCase())
        )
      }
      return false
    })
  } else {
    rows.value = allInitialData.value
  }
}

const getAllUsers = async () => {
  try {
    const response = await userStore.getAllUsersApi('mobile-users')
    if (response.status === 200) {
      rows.value = response.data.data
      allInitialData.value = response.data.data
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const onClickDeleteHandle = (user) => {
  userStore.setSelectedUser(user)
  confirmationPopupData.value = {
    topic: 'Are you sure you want to delete account?',
    message: 'The user wont have access to his account again',
    closBtnRequired: false
  }
  showConfirmationPopup.value = true
  showAdminViewBibleVersePopup.value = false
}

const deleteUser = async () => {
  try {
    if (
      !userStore.selectedUser &&
      !userStore.selectedUser?.id
    ) {
      return true
    }

    const response = await userStore.deleteUserApi(
      userStore.selectedUser.id
    )
    if (response.status === 200) {
      allInitialData.value = removeObjectById(
        allInitialData.value,
        userStore.selectedUser.id
      )
      rows.value = allInitialData.value
      searchUser.value = ''

      showConfirmationPopup.value = false
      showSuccessNotification(response.data.message)
      userStore.setSelectedUser(null)
    }
  } catch (error) {
    console.error(error)
    if (error.status === 400 || error.status === 404) {
      showErrorNotification(error.response.data.message)
    } else {
      showErrorNotification('Internal Server Error')
    }
  }
}
</script>
