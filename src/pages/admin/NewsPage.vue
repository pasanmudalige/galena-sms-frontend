<template>
  <q-page>
    <div class="space-y-5 px-6">
      <div class="flex justify-between items-center space-y-3 sm:space-y-0">
        <q-btn
          no-caps
          unelevated
          label="Add"
          color="primary"
          class="mbi-btn"
          @click="onClickAddNews"
        />
        <q-input
          @update:model-value="(val) => searchNews(val)"
          dense
          outlined
          placeholder="Search"
          debounce="300"
          v-model="searchUser"
        >
          <template v-slot:append>
            <q-icon name="search" color="grey-5" />
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
            {{convertGivenDateToGivenFormat(props.row.birthday, "yyyy/MM/dd") }}
          </q-td>
        </template>
        <template v-slot:body-cell-description="props">
          <q-td :props="props">
            <div v-html="props.row.description"></div>
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
            <q-btn
              @click="onClickViewHandle(props.row)"
              icon="open_in_new"
              flat
              size="sm"
              round
              aria-label="View"
            >
              <q-tooltip> View </q-tooltip>
            </q-btn>
            <q-btn
              @click="onClickEditHandle(props.row)"
              icon="edit"
              flat
              size="sm"
              round
              aria-label="Edit"
              :disable="props.row.isPosted"
            >
              <q-tooltip> Edit </q-tooltip>
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
            <q-icon
              v-if="!isLoading"
              size="2em"
              name="sentiment_dissatisfied"
            />
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
  <q-dialog persistent v-model="showAdminAddEditNewsPopup">
    <AdminAddEditNews @newsAdded="newsAdded" />
  </q-dialog>
  <q-dialog persistent v-model="showAdminViewNewsPopup">
    <AdminViewNews
      @onDeleteClick="onClickDeleteHandle"
      @onEditClick="onClickEditHandle"
    />
  </q-dialog>

  <q-dialog persistent v-model="showConfirmationPopup">
    <ConfirmationPopup
      v-bind="confirmationPopupData"
      @yesClicked="deleteNews"
    />
  </q-dialog>
</template>

<script setup>
import ConfirmationPopup from 'components/popups/ConfirmationPopup.vue'
import AdminAddEditNews from 'src/components/admin/AdminAddEditNews.vue'
import AdminViewNews from 'src/components/admin/AdminViewNews.vue'
import { onBeforeMount, ref } from 'vue'
import { useNewsStore } from 'src/stores/news-store'
import {
  showErrorNotification,
  showSuccessNotification
} from 'src/utils/notification'
import { removeObjectById } from 'src/utils/common-utlits'
import { convertGivenDateToGivenFormat } from 'src/utils/date-converts'

defineOptions({
  name: 'AdminPage'
})
onBeforeMount(() => {
  getAllNews()
})

const newsStore = useNewsStore()
const showConfirmationPopup = ref(false)
const confirmationPopupData = ref({})
const rows = ref([])
const allInitialData = ref([])
const isLoading = ref(true)
const showAdminViewNewsPopup = ref(false)
const showAdminAddEditNewsPopup = ref(false)
const searchNewsValue = ref('')
const columns = [
  {
    name: 'title',
    label: 'Title',
    align: 'left',
    field: (row) => row.title,
    sortable: false,
    style: {
      minWidth: '200px',
      maxWidth: '200px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  },
  {
    name: 'dateAndTime',
    label: 'Date & Time',
    align: 'left',
    field: (row) => {
      const localDateTime = new Date(
        `${row.date}T${row.timeUTC}Z`
      ).toLocaleString() // Convert UTC to local time
      return localDateTime
    },
    sortable: false
  },
  {
    name: 'status',
    label: 'Status',
    align: 'left',
    field: (row) => row.status,
    sortable: false
  },
  // {
  //   name: 'description',
  //   label: 'Description',
  //   align: 'left',
  //   field: (row) => row.description,
  //   sortable: false,
  // style: {
  //   minWidth: '200px',
  //   maxWidth: '200px',
  //   whiteSpace: 'nowrap',
  //   overflow: 'hidden',
  //   textOverflow: 'ellipsis'
  // }
  // },
  {
    name: 'description',
    label: 'Description',
    align: 'left',
    field: (row) => row.description,
    sortable: false,
    format: (val) => val, // Ensure raw HTML is passed
    required: true,
    classes: 'text-wrap',
    slot: true, // Enables slot usage for custom rendering
    style: {
      minWidth: '200px',
      maxWidth: '200px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  },

  {
    name: 'actions',
    label: 'Action',
    align: 'center',
    sortable: false
  }
]

const searchNews = (value) => {
  const searchValue = value.replace(/^\s+/, '')

  if (searchValue) {
    rows.value = allInitialData.value.filter((object) => {
      if (object.title && object.description) {
        return (
          object.title.toLowerCase().includes(searchValue.toLowerCase())
        )
      }
      return false
    })
  } else {
    rows.value = allInitialData.value
  }
}

const getAllNews = async () => {
  try {
    // await new Promise(resolve => setTimeout(resolve, 3000))
    const response = await newsStore.getAllNewsApi()
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

const onClickAddNews = async () => {
  newsStore.selectedNews = null
  showAdminAddEditNewsPopup.value = true
}
const newsAdded = async () => {
  showAdminAddEditNewsPopup.value = false
  await getAllNews()
}

const onClickViewHandle = (news) => {
  newsStore.setSelectedNews(news)
  showAdminViewNewsPopup.value = true
}

const onClickEditHandle = (news) => {
  newsStore.setSelectedNews(news)
  showAdminAddEditNewsPopup.value = true
  showAdminViewNewsPopup.value = false
}
const onClickDeleteHandle = (news) => {
  newsStore.setSelectedNews(news)
  confirmationPopupData.value = {
    topic: 'Are you sure you want to delete?',
    message: 'The news cannot be recovered once you delete',
    closBtnRequired: false
  }
  showConfirmationPopup.value = true
  showAdminViewNewsPopup.value = false
}

const deleteNews = async () => {
  try {
    if (!newsStore.selectedNews && !newsStore.selectedNews?.id) {
      return true
    }

    const response = await newsStore.deleteNewsApi(newsStore.selectedNews.id)
    if (response.status === 200) {
      allInitialData.value = removeObjectById(
        allInitialData.value,
        newsStore.selectedNews.id
      )
      rows.value = allInitialData.value
      searchNewsValue.value = ''

      showConfirmationPopup.value = false
      showSuccessNotification(response.data.message)
      newsStore.setSelectedNews(null)
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
