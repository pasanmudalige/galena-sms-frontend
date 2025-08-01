<template>
  <q-page>
    <div class="space-y-5 px-6">
      <div class="flex justify-between items-center space-y-3 sm:space-y-0">
        <q-field dense outlined class="min-w-56">
          <template v-slot:control>
            <div>
              {{
                form.dateRange.from
                  ? form.dateRange.from === form.dateRange.to
                    ? form.dateRange.from // Show single date
                    : form.dateRange.from + " - " + form.dateRange.to // Show date range
                  : "Select Date / Date Range"
              }}
            </div>
          </template>
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer" color="grey-5" />
          </template>
          <q-popup-proxy ref="datePickerPopupRef">
            <q-date
              range
              :options="disabledCalenderDateOptions"
              @update:model-value="onDateRangeChange"
            />
          </q-popup-proxy>
        </q-field>

        <q-btn
          label="Download Report"
          color="primary"
          no-caps
          unelevated
          class="mbi-btn"
          @click="downloadMainReport"
        />
      </div>
      <div class="grid md:grid-cols-3 gap-4">
        <!-- Date -->
        <div @click="onNewUsersChartClick">
          <DoughnutChartComponent
            :chartData="newUserData"
            :chartOptions="newUserOptions"
            :centerText="totalRegisteredUsers"
          />
        </div>
        <div @click="onDailyCallsChartClick">
          <DoughnutChartComponent
            :chartData="dailyCallsData"
            :chartOptions="dailyCallsOptions"
            :centerText="totalCalls"
          />
        </div>
        <div @click="onInactiveUsersChartClick">
          <DoughnutChartComponent
            :chartData="inactiveUserData"
            :chartOptions="inactiveUserOptions"
            :centerText="totalInactiveUsers"
          />
        </div>
      </div>
    </div>
  </q-page>

  <!-- Dialogs -->
  <q-dialog persistent v-model="showAdminDashboardNewUsersPopup">
    <DashboardNewUserListPopup
      :dateFrom="popupData.dateFrom"
      :dateTo="popupData.dateTo"
      v-bind="popupData"
    />
  </q-dialog>
  <q-dialog persistent v-model="showAdminDashboardDailyCallsPopup">
    <DashboardDailyCallsListPopup
      :dateFrom="popupData.dateFrom"
      :dateTo="popupData.dateTo"
      v-bind="popupData"
    />
  </q-dialog>
  <q-dialog persistent v-model="showAdminDashboardInactiveUsersPopup">
    <DashboardInactiveUsersPopup
      :dateFrom="popupData.dateFrom"
      :dateTo="popupData.dateTo"
      v-bind="popupData"
    />
  </q-dialog>
</template>

<script setup>
import DoughnutChartComponent from 'src/components/dashboard/doughnutChartComponent.vue'
import { onBeforeMount, ref } from 'vue'
import { useReportStore } from 'src/stores/report-store'
import DashboardNewUserListPopup from 'src/components/dashboard/DashboardNewUserListPopup.vue'
import DashboardDailyCallsListPopup from 'src/components/dashboard/DashboardDailyCallsListPopup.vue'
import DashboardInactiveUsersPopup from 'src/components/dashboard/DashboardInnactiveUserListPopup.vue'
import { getCurrentDateTimeInGivenFormat } from 'src/utils/date-converts'
import * as XLSX from 'xlsx'
import { format } from 'date-fns'
const datePickerPopupRef = ref(null)
const showAdminDashboardNewUsersPopup = ref(false)
const showAdminDashboardDailyCallsPopup = ref(false)
const showAdminDashboardInactiveUsersPopup = ref(false)
const popupData = ref({})
const reportStore = useReportStore()

const newUserData = ref({
  labels: ['Sinhala', 'Tamil', 'English'],
  datasets: [
    {
      label: 'New Users old',
      backgroundColor: ['#62B2FD', '#9BDFC4', '#F99BAB'],
      data: [0, 0, 0] // Initial placeholder data
    }
  ]
})
const newUserRows = ref([])
const dailyCallsRows = ref([])
const inactiveUserRows = ref([])
const form = ref({
  dateRange: { from: '', to: '' }
})
const dailyCallsData = ref({
  labels: ['Answered', 'Cancelled', 'Ignored'],
  datasets: [
    {
      label: 'Daily Calls old',
      backgroundColor: ['#62B2FD', '#9BDFC4', '#F99BAB'],
      data: [0, 0] // Data for pie chart
    }
  ]
})
const inactiveUserData = ref({
  labels: ['Male', 'Female'],
  datasets: [
    {
      label: 'Inactive users old',
      backgroundColor: ['#62B2FD', '#9BDFC4'],
      data: [0, 0] // Data for pie chart
    }
  ]
})
const totalRegisteredUsers = ref(0)
const totalCalls = ref(0)
const totalInactiveUsers = ref(0)

onBeforeMount(() => {
  const currentDate = getCurrentDateTimeInGivenFormat('yyyy/MM/dd')
  form.value.dateRange.from = currentDate
  form.value.dateRange.to = currentDate
  getAllDashboardData(form.value.dateRange.to, form.value.dateRange.to)
  popupData.value = {
    date: currentDate,
    topic: 'Are you sure you want to delete account?',
    dateFrom: currentDate,
    dateTo: currentDate
  }
})
const onDateRangeChange = (newRange) => {
  // Check if the new value is a string (single date) or an object (date range)
  if (typeof newRange === 'string') {
    // Single date selected
    form.value.dateRange.from = newRange
    form.value.dateRange.to = newRange // Set both to the same single date
  } else {
    // Date range selected
    form.value.dateRange.from = newRange.from
    form.value.dateRange.to = newRange.to
  }

  // Fetch the data based on the selected date(s)
  getAllDashboardData(form.value.dateRange.from, form.value.dateRange.to)
}

const getAllDashboardData = async (dateFrom = null, dateTo = null) => {
  try {
    const response = await reportStore.getDashboardData(dateFrom, dateTo)

    datePickerPopupRef.value.hide()
    if (response.status === 200) {
      const registeredUsers = response.data.data.registeredUsers
      const dailyCalls = response.data.data.dailyCalls
      const inactiveUsers = response.data.data.inactiveUsers
      totalRegisteredUsers.value = registeredUsers.TotalUsers
      totalCalls.value = dailyCalls.totalCalls
      totalInactiveUsers.value = inactiveUsers.totalInactiveUsers
      // Prepare labels and data arrays
      const labels = ['Sinhala', 'Tamil', 'English'] // Order should match your desired labels
      const labelsDailyCalls = ['Answered', 'Cancelled', 'Ignored'] // Order should match your desired labels
      const labelInactiveUser = ['Male', 'Female']
      const data = [
        registeredUsers.Sinhala || 0, // Ensure default value of 0 if the key does not exist
        registeredUsers.Tamil || 0,
        registeredUsers.English || 0
      ]

      const callsData = [dailyCalls.answeredCalls, dailyCalls.cancelledCalls, dailyCalls.ignoredCalls]
      const inactiveData = [inactiveUsers.male, inactiveUsers.female]
      newUserData.value = {
        labels,
        datasets: [
          {
            label: 'New Users',
            backgroundColor: ['#62B2FD', '#9BDFC4', '#F99BAB'],
            data
          }
        ]
      }
      dailyCallsData.value = {
        labels: labelsDailyCalls,
        datasets: [
          {
            label: 'Daily Calls',
            backgroundColor: ['#62B2FD', '#9BDFC4', '#F99BAB'],
            data: callsData
          }
        ]
      }
      inactiveUserData.value = {
        labels: labelInactiveUser,
        datasets: [
          {
            label: 'Daily Calls',
            backgroundColor: ['#62B2FD', '#9BDFC4'],
            data: inactiveData
          }
        ]
      }
    }
  } catch (error) {
    console.error(error)
  }
}
const onNewUsersChartClick = async () => {
  popupData.value = {
    count: totalRegisteredUsers.value,
    dateFrom: form.value.dateRange.from,
    dateTo: form.value.dateRange.to
  }
  showAdminDashboardNewUsersPopup.value = true
}
const onDailyCallsChartClick = async () => {
  popupData.value = {
    count: totalCalls.value,
    dateFrom: form.value.dateRange.from,
    dateTo: form.value.dateRange.to
  }
  showAdminDashboardDailyCallsPopup.value = true
}
const onInactiveUsersChartClick = async () => {
  popupData.value = {
    count: totalInactiveUsers.value,
    dateFrom: form.value.dateRange.from,
    dateTo: form.value.dateRange.to
  }
  showAdminDashboardInactiveUsersPopup.value = true
}
const newUserOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'right'
    },
    title: {
      display: true,
      text: 'New Users'
    }
  }
}
const dailyCallsOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'right'
    },
    title: {
      display: true,
      text: 'Daily Calls'
    }
  }
}
const inactiveUserOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'right'
    },
    title: {
      display: true,
      text: 'Inactive Users'
    }
  }
}
const disabledCalenderDateOptions = (date) => {
  const today = getCurrentDateTimeInGivenFormat('yyyy/MM/dd')
  return date <= today
}
const downloadMainReport = async () => {
  popupData.value = {
    dateFrom: form.value.dateRange.from,
    dateTo: form.value.dateRange.to
  }

  // Define custom headers
  const customHeadersForDailyCalls = [
    // { header: 'Full Name', key: 'fullname' },
    // { header: 'Email Address', key: 'email' },
    // { header: 'Call Status', key: 'status' },
    // { header: 'Age', key: 'age' },
    // { header: 'Preferred Language', key: 'language' }

    { header: 'Date', key: 'date' },
    { header: 'Time', key: 'time' },
    { header: 'Full Name', key: 'fullname' },
    { header: 'Email Address', key: 'email' },
    { header: 'Call Status', key: 'status' },
    { header: 'Age', key: 'age' },
    { header: 'Gender', key: 'gender' },
    { header: 'Duration', key: 'duration' },
    { header: 'Listened Time', key: 'listenedTime' },
    { header: 'Preferred Language', key: 'language' }
  ]
  const customHeadersForNewUser = [
    { header: 'Registered Date', key: 'regDate' },
    { header: 'Full Name', key: 'fullname' },
    { header: 'Email Address', key: 'email' },
    { header: 'Age', key: 'age' },
    { header: 'Gender', key: 'gender' },
    { header: 'Preferred Language', key: 'language' }
  ]
  const customHeadersForInactiveUser = [
    { header: 'Full Name', key: 'fullname' },
    { header: 'Email Address', key: 'email' },
    { header: 'Age', key: 'age' },
    { header: 'Gender', key: 'gender' },
    { header: 'Last Active Date', key: 'lastActiveDate' },
    { header: 'Preferred Language', key: 'language' }
  ]

  const newUserResponse = await reportStore.getNewUsersList(
    popupData.value.dateFrom,
    popupData.value.dateTo
  )
  if (newUserResponse.status === 200) {
    newUserRows.value = newUserResponse.data.data.userList
  }

  const dailyCallsResponse = await reportStore.getDailyCallsList(
    popupData.value.dateFrom,
    popupData.value.dateTo
  )
  if (dailyCallsResponse.status === 200) {
    dailyCallsRows.value = dailyCallsResponse.data.data
  }

  const inactiveUserResponse = await reportStore.getInactiveUsersList(
    popupData.value.dateFrom,
    popupData.value.dateTo
  )
  if (inactiveUserResponse.status === 200) {
    inactiveUserRows.value = inactiveUserResponse.data.data.userList
  }

  // Map rows to match custom headers
  const mappedDataForDailyCalls = dailyCallsRows.value.map((row) => {
    // Parse the audioFile JSON string to extract audioFileDuration
    const audioFileData = JSON.parse(row.audioFile)
    const audioFileDurationSeconds = parseFloat(
      audioFileData.audioFileDuration
    )

    // Calculate the duration string
    const duration = !isNaN(audioFileDurationSeconds)
      ? `${Math.floor(audioFileDurationSeconds / 60)}m ${Math.round(
          audioFileDurationSeconds % 60
        )}s`
      : ''

    // Calculate listened time
    const listenedTimeSeconds = row.callDurationInSeconds
    const listenedTime = !isNaN(listenedTimeSeconds)
      ? `${Math.floor(listenedTimeSeconds / 60)}m ${listenedTimeSeconds % 60}s`
      : ''
    return {
      date: row.callActionDateTime ? format(new Date(row.callActionDateTime), 'dd/MM/yyyy') : '',
      time: row.callActionDateTime ? format(new Date(row.callActionDateTime), 'hh.mm a') : '',
      fullname: row.fullname,
      email: row.email,
      status: row.status,
      age: row.birthday ? calculateAge(row.birthday) : '',
      gender: row.gender,
      duration,
      listenedTime,
      language: row.prefLanguage
    }
  })

  // Map rows to match custom headers
  const mappedDataForNewUser = newUserRows.value.map((row) => ({
    regDate: format(new Date(row.createdAt), 'dd/MM/yyyy'),
    fullname: row.fullname,
    email: row.email,
    age: row.birthday ? calculateAge(row.birthday) : '',
    gender: row.gender,
    language: row.prefLanguage
  }))

  // Map rows to match custom headers
  const mappedDataForInactiveUser = inactiveUserRows.value.map((row) => ({
    fullname: row.fullname,
    email: row.email,
    age: row.birthday ? calculateAge(row.birthday) : '',
    gender: row.gender,
    lastActiveDate: row.lastActiveDate,
    language: row.prefLanguage
  }))

  // Create a new workbook for merging both
  const finalWorkbook = XLSX.utils.book_new()

  // Create worksheets with custom headers and data
  const worksheetForDailyCalls = XLSX.utils.json_to_sheet(
    mappedDataForDailyCalls,
    { header: customHeadersForDailyCalls.map((col) => col.key) }
  )
  const worksheetForNewUser = XLSX.utils.json_to_sheet(
    mappedDataForNewUser,
    { header: customHeadersForNewUser.map((col) => col.key) }
  )
  const worksheetForInactiveUser = XLSX.utils.json_to_sheet(
    mappedDataForInactiveUser,
    { header: customHeadersForInactiveUser.map((col) => col.key) }
  )

  // Prepend headers to the worksheets
  XLSX.utils.sheet_add_aoa(
    worksheetForDailyCalls,
    [customHeadersForDailyCalls.map((col) => col.header)],
    { origin: 'A1' }
  )
  XLSX.utils.sheet_add_aoa(
    worksheetForNewUser,
    [customHeadersForNewUser.map((col) => col.header)],
    { origin: 'A1' }
  )
  XLSX.utils.sheet_add_aoa(
    worksheetForInactiveUser,
    [customHeadersForInactiveUser.map((col) => col.header)],
    { origin: 'A1' }
  )
  // Append worksheets to the final workbook
  XLSX.utils.book_append_sheet(finalWorkbook, worksheetForDailyCalls, 'Daily Calls')
  XLSX.utils.book_append_sheet(finalWorkbook, worksheetForNewUser, 'New Users')
  XLSX.utils.book_append_sheet(finalWorkbook, worksheetForInactiveUser, 'Inactive Users')

  // Write the file with the merged workbooks
  XLSX.writeFile(
    finalWorkbook,
    'Report From ' +
      popupData.value.dateFrom +
      ' To ' +
      popupData.value.dateTo +
      '.xlsx'
  )
}

// Helper function to calculate age from birthday
const calculateAge = (birthday) => {
  const birthDate = new Date(birthday)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--
  }

  return age
}
</script>
