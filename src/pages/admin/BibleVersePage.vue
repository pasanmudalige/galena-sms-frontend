<template>
  <q-page>
    <div class="space-y-5 px-6">
      <div class="flex justify-between items-center space-y-3 sm:space-y-0">
        <q-btn
          no-caps
          unelevated
          label="Add Message"
          color="primary"
          class="mbi-btn"
          @click="onClickAddReading()"
        />
        <q-input
          @update:model-value="(val) => searchVerses(val)"
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
        <template v-slot:body-cell-date="props">
          <q-td :props="props">
            {{ convertGivenDateToGivenFormat(props.row.date, "EEEE, MMMM d") }}
          </q-td>
        </template>

        <!-- language -->
        <template v-slot:body-cell-language="props">
          <q-td :props="props">
            {{ capitalizeFirstLetter(props.row.language) }}
          </q-td>
        </template>

        <!-- verse -->
        <!-- <template v-slot:body-cell-verse="props">
          <q-td :props="props">
            {{ truncateText(props.row.verse) }}
          </q-td>
        </template> -->

        <template v-slot:body-cell-verse="props">
          <q-td :props="props">
            <div v-html="props.row.verse"></div>
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
  <q-dialog persistent v-model="showAdminAddEditBibleVersePopup">
    <AdminAddEditBibleVerse
      :language="route.params.language"
      @bibleVerseAdded="bibleVerseAdded"
    />
  </q-dialog>

  <q-dialog persistent v-model="showAdminViewBibleVersePopup">
    <AdminViewBibleVerse
      @onDeleteClick="onClickDeleteHandle"
      @onEditClick="onClickEditHandle"
    />
  </q-dialog>

  <q-dialog persistent v-model="showConfirmationPopup">
    <ConfirmationPopup
      v-bind="confirmationPopupData"
      @yesClicked="deleteBibleVerse"
    />
  </q-dialog>
</template>

<script setup>
import ConfirmationPopup from 'components/popups/ConfirmationPopup.vue'
import AdminAddEditBibleVerse from 'src/components/admin/AdminAddEditBibleVerse.vue'
import AdminViewBibleVerse from 'src/components/admin/AdminViewBibleVerse.vue'
import { onBeforeMount, ref, watch } from 'vue'
import { useScriptStore } from 'src/stores/script-store'
import { useRoute } from 'vue-router' // Import useRoute
import {
  capitalizeFirstLetter,
  // truncateHTML,
  removeObjectById
} from 'src/utils/common-utlits'
import {
  showErrorNotification,
  showSuccessNotification
} from 'src/utils/notification'
import { convertGivenDateToGivenFormat } from 'src/utils/date-converts'

defineOptions({
  name: 'BibleVersePage'
})
onBeforeMount(() => {
  getAllBibleVerses()
})

const scriptStore = useScriptStore()
const route = useRoute() // Define route using useRoute
const showAdminViewBibleVersePopup = ref(false)
const showAdminAddEditBibleVersePopup = ref(false)
const showConfirmationPopup = ref(false)
const confirmationPopupData = ref({})
const searchVerse = ref('')
const rows = ref([])
const allInitialData = ref([])
const isLoading = ref(true)
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
    name: 'date',
    label: 'Date',
    align: 'left',
    field: (row) => row.date,
    sortable: false
  },
  {
    name: 'status',
    label: 'Status',
    align: 'left',
    field: (row) => row.status,
    sortable: false
  },
  {
    name: 'listeners',
    label: 'Listeners',
    align: 'left',
    field: (row) => row.listeners,
    sortable: false
  },
  // {
  //   name: 'language',
  //   label: 'Language',
  //   align: 'left',
  //   field: (row) => row.language,
  //   sortable: false
  // },
  // {
  //   name: 'verse',
  //   label: 'Message',
  //   align: 'left',
  //   field: (row) => row.verse,
  //   sortable: false
  // },
  {
    name: 'verse',
    label: 'Message',
    align: 'left',
    field: (row) => row.verse,
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
// Watch for changes in the language route parameter
watch(
  () => route.params.language,
  () => {
    isLoading.value = true // Optional: show loading spinner
    getAllBibleVerses()
  }
)

const searchVerses = (value) => {
  const searchValue = value.replace(/^\s+/, '')

  if (searchValue) {
    rows.value = allInitialData.value.filter((verse) => {
      if (verse.title && verse.language) {
        return (
          verse.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          verse.language.toLowerCase().includes(searchValue.toLowerCase())
        )
      }
      return false
    })
  } else {
    rows.value = allInitialData.value
  }
}

const getAllBibleVerses = async () => {
  try {
    const response = await scriptStore.getAllScriptsApi(route.params.language)
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

const onClickAddReading = () => {
  scriptStore.selectedBibleVerse = null
  showAdminAddEditBibleVersePopup.value = true
}

const onClickDeleteHandle = (verse) => {
  scriptStore.setSelectedBibleVerse(verse)
  confirmationPopupData.value = {
    topic: 'Are you sure you want to delete?',
    message: 'The message cannot be recovered once you delete',
    closBtnRequired: false
  }
  showConfirmationPopup.value = true
  showAdminViewBibleVersePopup.value = false
}

const deleteBibleVerse = async () => {
  try {
    if (
      !scriptStore.selectedBibleVerse &&
      !scriptStore.selectedBibleVerse?.id
    ) {
      return true
    }

    const response = await scriptStore.deleteScriptApi(
      scriptStore.selectedBibleVerse.id
    )
    if (response.status === 200) {
      allInitialData.value = removeObjectById(
        allInitialData.value,
        scriptStore.selectedBibleVerse.id
      )
      rows.value = allInitialData.value
      searchVerse.value = ''

      showConfirmationPopup.value = false
      showSuccessNotification(response.data.message)
      scriptStore.setSelectedBibleVerse(null)
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

const onClickViewHandle = (verse) => {
  scriptStore.setSelectedBibleVerse(verse)
  showAdminViewBibleVersePopup.value = true
}

const onClickEditHandle = (verse) => {
  scriptStore.setSelectedBibleVerse(verse)
  showAdminAddEditBibleVersePopup.value = true
  showAdminViewBibleVersePopup.value = false
}

const bibleVerseAdded = () => {
  showAdminAddEditBibleVersePopup.value = false
  getAllBibleVerses()
}
</script>
