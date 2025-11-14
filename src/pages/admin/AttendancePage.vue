<template>
  <q-page class="p-6">
    <div class="flex justify-between items-center mb-4">
      <div class="text-xl font-semibold">Mark Attendance</div>
      <q-btn
        no-caps
        color="primary"
        icon="qr_code_scanner"
        label="QR Scanner"
        @click="showQRScanner = true"
      />
    </div>

    <q-card class="q-mb-md">
      <q-tabs v-model="tab" align="left" class="text-primary">
        <q-tab name="manual" label="Manual Entry" icon="edit" />
        <q-tab name="qr" label="QR Scanner" icon="qr_code_scanner" />
        <q-tab name="history" label="Attendance History" icon="history" />
        <q-tab name="schedules" label="Class Schedules" icon="schedule" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated>
        <!-- Manual Entry Tab -->
        <q-tab-panel name="manual">
          <q-form @submit.prevent="submitManual">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-select
                  v-model="manualForm.enrollment_id"
                  label="Select Enrollment"
                  dense
                  outlined
                  :options="enrollmentOptions"
                  option-label="label"
                  option-value="value"
                  emit-value
                  map-options
                  :rules="[(v) => !!v || 'Required']"
                  use-input
                  input-debounce="0"
                  @filter="filterEnrollments"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">No enrollments found</q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  v-model="manualForm.attendance_datetime"
                  label="Date & Time"
                  dense
                  outlined
                  type="datetime-local"
                  :rules="[(v) => !!v || 'Required']"
                />
              </div>

              <div class="col-12">
                <q-input
                  v-model="manualForm.notes"
                  label="Notes (optional)"
                  dense
                  outlined
                  type="textarea"
                  rows="3"
                />
              </div>

              <div class="col-12">
                <q-checkbox
                  v-model="manualForm.override_allowed"
                  label="Manual Override (if payment is overdue)"
                />
              </div>

              <div v-if="manualForm.override_allowed" class="col-12">
                <q-input
                  v-model="manualForm.override_reason"
                  label="Override Reason"
                  dense
                  outlined
                  :rules="[(v) => !!v || 'Required if override is enabled']"
                />
              </div>

              <div class="col-12">
                <q-btn
                  color="primary"
                  no-caps
                  label="Mark Attendance"
                  type="submit"
                  :loading="markingAttendance"
                  icon="check_circle"
                />
              </div>
            </div>
          </q-form>
        </q-tab-panel>

        <!-- QR Scanner Tab -->
        <q-tab-panel name="qr">
          <div class="text-center">
            <div v-if="!scanning" class="q-mb-md">
              <q-btn
                color="primary"
                no-caps
                label="Start QR Scanner"
                icon="qr_code_scanner"
                @click="startScanner"
                size="lg"
              />
              <div class="text-caption text-grey-7 q-mt-md">
                Point your camera at the student's QR code
              </div>
            </div>

            <div v-if="scanning" class="scanner-container">
              <div id="qr-reader" style="width: 100%; max-width: 500px"></div>
              <q-btn
                color="negative"
                no-caps
                label="Stop Scanner"
                icon="stop"
                @click="stopScanner"
                class="q-mt-md"
              />
            </div>

            <!-- QR Scan Result Dialog -->
            <q-dialog v-model="showQRResult" persistent>
              <q-card style="min-width: 450px">
                <q-card-section class="row items-center q-pb-none">
                  <div class="text-h6 text-weight-bold">Attendance Marked</div>
                  <q-space />
                  <q-btn icon="close" flat round dense @click="closeQRResult" />
                </q-card-section>
                <q-separator />
                <q-card-section>
                  <div class="q-gutter-md">
                    <div class="row items-center q-gutter-sm">
                      <q-icon
                        :name="lastScanned?.payment_status === 'payment_pending' ? 'warning' : 'check_circle'"
                        :color="lastScanned?.payment_status === 'payment_pending' ? 'warning' : 'positive'"
                        size="48px"
                      />
                      <div class="col">
                        <div class="text-h6 text-weight-bold">
                          {{ lastScanned?.payment_status === 'payment_pending' ? 'Attendance Marked (Payment Pending)' : 'Attendance Marked Successfully!' }}
                        </div>
                      </div>
                    </div>

                    <q-separator />

                    <div class="q-gutter-sm">
                      <div class="row items-center">
                        <div class="col-4 text-body2 text-grey-7">Student Name:</div>
                        <div class="col-8 text-body1 text-weight-medium">
                          {{ lastScanned?.student_name || 'N/A' }}
                        </div>
                      </div>
                      <div class="row items-center">
                        <div class="col-4 text-body2 text-grey-7">Student ID:</div>
                        <div class="col-8 text-body1 text-weight-medium">
                          {{ lastScanned?.student_id || 'N/A' }}
                        </div>
                      </div>
                      <div class="row items-center">
                        <div class="col-4 text-body2 text-grey-7">Class:</div>
                        <div class="col-8 text-body1 text-weight-medium">
                          {{ lastScanned?.class_name || 'N/A' }}
                        </div>
                      </div>
                      <div class="row items-center">
                        <div class="col-4 text-body2 text-grey-7">Time:</div>
                        <div class="col-8 text-body1">
                          {{ lastScanned?.attendance_datetime || 'N/A' }}
                        </div>
                      </div>
                      <q-separator />
                      <div class="row items-center q-mt-sm">
                        <div class="col-4 text-body2 text-grey-7">Payment Status:</div>
                        <div class="col-8">
                          <q-chip
                            :color="getPaymentStatusColor(lastScanned?.payment_status)"
                            text-color="white"
                            :icon="getPaymentStatusIcon(lastScanned?.payment_status)"
                            size="md"
                          >
                            <span class="text-weight-bold">
                              {{ getPaymentStatusLabel(lastScanned?.payment_status) }}
                            </span>
                          </q-chip>
                        </div>
                      </div>
                      <div
                        v-if="getPaymentStatusLabel(lastScanned?.payment_status) === 'Payment Pending'"
                        class="q-mt-sm q-pa-sm bg-warning-1 rounded-borders"
                      >
                        <div class="text-caption text-warning-8">
                          <q-icon name="info" size="16px" class="q-mr-xs" />
                          This student's attendance has been marked, but payment for the current month is pending.
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn color="primary" no-caps label="OK" @click="closeQRResult" />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
        </q-tab-panel>

        <!-- History Tab -->
        <q-tab-panel name="history">
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-4">
              <q-input
                v-model="historyFilters.enrollment_id"
                label="Filter by Enrollment"
                dense
                outlined
                clearable
                :options="enrollmentOptions"
                option-label="label"
                option-value="value"
                emit-value
                map-options
                @update:model-value="loadHistory"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="historyFilters.date_from"
                label="From Date"
                dense
                outlined
                type="date"
                @update:model-value="loadHistory"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="historyFilters.date_to"
                label="To Date"
                dense
                outlined
                type="date"
                @update:model-value="loadHistory"
              />
            </div>
          </div>

          <q-table
            :rows="attendanceHistory"
            :columns="historyColumns"
            row-key="id"
            flat
            bordered
            :loading="loadingHistory"
          >
            <template #body-cell-status="props">
              <q-td :props="props">
                <q-badge
                  :color="
                    props.value === 'present'
                      ? 'positive'
                      : props.value === 'blocked_unpaid'
                        ? 'negative'
                        : 'warning'
                  "
                >
                  {{ props.value }}
                </q-badge>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- Schedules Tab -->
        <q-tab-panel name="schedules">
          <q-tabs v-model="scheduleTab" align="left" class="text-primary q-mb-md">
            <q-tab name="default" label="Default Weekly Schedules" icon="event_repeat" />
            <q-tab name="extra" label="Extra Classes" icon="event" />
          </q-tabs>

          <q-tab-panels v-model="scheduleTab" animated>
            <!-- Default Schedules Panel -->
            <q-tab-panel name="default">
              <div class="row q-col-gutter-md q-mb-md">
                <div class="col-12 col-md-4">
                  <q-select
                    v-model="scheduleFilterClass"
                    label="Filter by Class"
                    dense
                    outlined
                    clearable
                    :options="classOptions"
                    option-label="label"
                    option-value="value"
                    emit-value
                    map-options
                    @update:model-value="loadDefaultSchedules"
                  />
                </div>
                <div class="col-12 col-md-8 text-right">
                  <q-btn
                    color="primary"
                    no-caps
                    icon="add"
                    label="Add Default Schedule"
                    @click="showAddDefaultSchedule = true"
                  />
                </div>
              </div>

              <q-table
                :rows="defaultSchedules"
                :columns="defaultScheduleColumns"
                row-key="id"
                flat
                bordered
                :loading="loadingSchedules"
              >
                <template #body-cell-day_of_week="props">
                  <q-td :props="props">
                    {{ getDayName(props.value) }}
                  </q-td>
                </template>
                <template #body-cell-is_active="props">
                  <q-td :props="props">
                    <q-chip
                      :color="props.value ? 'positive' : 'grey'"
                      text-color="white"
                      size="sm"
                    >
                      {{ props.value ? 'Active' : 'Inactive' }}
                    </q-chip>
                  </q-td>
                </template>
                <template #body-cell-actions="props">
                  <q-td :props="props">
                    <q-btn
                      dense
                      flat
                      round
                      icon="edit"
                      color="primary"
                      class="q-mr-xs"
                      @click="editDefaultSchedule(props.row)"
                    />
                    <q-btn
                      dense
                      flat
                      round
                      icon="delete"
                      color="negative"
                      @click="confirmDeleteDefaultSchedule(props.row)"
                    />
                  </q-td>
                </template>
              </q-table>
            </q-tab-panel>

            <!-- Extra Classes Panel -->
            <q-tab-panel name="extra">
              <div class="row q-col-gutter-md q-mb-md">
                <div class="col-12 col-md-3">
                  <q-input
                    v-model="extraClassFilterDateFrom"
                    label="From Date"
                    dense
                    outlined
                    type="date"
                    @update:model-value="loadExtraClasses"
                  />
                </div>
                <div class="col-12 col-md-3">
                  <q-input
                    v-model="extraClassFilterDateTo"
                    label="To Date"
                    dense
                    outlined
                    type="date"
                    @update:model-value="loadExtraClasses"
                  />
                </div>
                <div class="col-12 col-md-3">
                  <q-select
                    v-model="extraClassFilterClass"
                    label="Filter by Class"
                    dense
                    outlined
                    clearable
                    :options="classOptions"
                    option-label="label"
                    option-value="value"
                    emit-value
                    map-options
                    @update:model-value="loadExtraClasses"
                  />
                </div>
                <div class="col-12 col-md-3 text-right">
                  <q-btn
                    color="primary"
                    no-caps
                    icon="add"
                    label="Add Extra Class"
                    @click="showAddExtraClass = true"
                  />
                </div>
              </div>

              <q-table
                :rows="extraClasses"
                :columns="extraClassColumns"
                row-key="id"
                flat
                bordered
                :loading="loadingExtraClasses"
              >
                <template #body-cell-classes="props">
                  <q-td :props="props">
                    <div class="flex flex-wrap q-gutter-xs">
                      <q-chip
                        v-for="cls in props.value"
                        :key="cls.id"
                        color="primary"
                        text-color="white"
                        size="sm"
                        dense
                      >
                        {{ cls.class_name }}
                      </q-chip>
                    </div>
                  </q-td>
                </template>
                <template #body-cell-is_active="props">
                  <q-td :props="props">
                    <q-chip
                      :color="props.value ? 'positive' : 'grey'"
                      text-color="white"
                      size="sm"
                    >
                      {{ props.value ? 'Active' : 'Inactive' }}
                    </q-chip>
                  </q-td>
                </template>
                <template #body-cell-actions="props">
                  <q-td :props="props">
                    <q-btn
                      dense
                      flat
                      round
                      icon="edit"
                      color="primary"
                      class="q-mr-xs"
                      @click="editExtraClass(props.row)"
                    />
                    <q-btn
                      dense
                      flat
                      round
                      icon="delete"
                      color="negative"
                      @click="confirmDeleteExtraClass(props.row)"
                    />
                  </q-td>
                </template>
              </q-table>
            </q-tab-panel>
          </q-tab-panels>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <!-- Add/Edit Default Schedule Dialog -->
    <q-dialog v-model="showAddDefaultSchedule" persistent>
      <q-card style="min-width: 500px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">
            {{ editingDefaultSchedule ? 'Edit' : 'Add' }} Default Schedule
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit.prevent="submitDefaultSchedule">
            <div class="q-gutter-md">
              <q-select
                v-model="defaultScheduleForm.class_id"
                label="Class *"
                dense
                outlined
                :options="classOptions"
                option-label="label"
                option-value="value"
                emit-value
                map-options
                :rules="[(v) => !!v || 'Required']"
                :disable="editingDefaultSchedule"
              />
              <q-select
                v-model="defaultScheduleForm.day_of_week"
                label="Day of Week *"
                dense
                outlined
                :options="dayOptions"
                option-label="label"
                option-value="value"
                emit-value
                map-options
                :rules="[(v) => v !== null && v !== undefined || 'Required']"
              />
              <q-input
                v-model="defaultScheduleForm.start_time"
                label="Start Time *"
                dense
                outlined
                type="time"
                :rules="[(v) => !!v || 'Required']"
              />
              <q-input
                v-model="defaultScheduleForm.end_time"
                label="End Time"
                dense
                outlined
                type="time"
              />
              <q-checkbox
                v-model="defaultScheduleForm.is_active"
                label="Active"
              />
            </div>
            <div class="row justify-end q-mt-lg q-gutter-sm">
              <q-btn flat no-caps label="Cancel" v-close-popup />
              <q-btn
                color="primary"
                no-caps
                label="Save"
                type="submit"
                :loading="savingSchedule"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Add/Edit Extra Class Dialog -->
    <q-dialog v-model="showAddExtraClass" persistent>
      <q-card style="min-width: 600px; max-width: 800px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">
            {{ editingExtraClass ? 'Edit' : 'Add' }} Extra Class
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit.prevent="submitExtraClass">
            <div class="q-gutter-md">
              <q-input
                v-model="extraClassForm.session_date"
                label="Session Date *"
                dense
                outlined
                type="date"
                :rules="[(v) => !!v || 'Required']"
              />
              <q-input
                v-model="extraClassForm.start_time"
                label="Start Time *"
                dense
                outlined
                type="time"
                :rules="[(v) => !!v || 'Required']"
              />
              <q-input
                v-model="extraClassForm.end_time"
                label="End Time"
                dense
                outlined
                type="time"
              />
              <q-select
                v-model="extraClassForm.class_ids"
                label="Allowed Classes *"
                dense
                outlined
                multiple
                :options="classOptions"
                option-label="label"
                option-value="value"
                emit-value
                map-options
                use-chips
                :rules="[(v) => (Array.isArray(v) && v.length > 0) || 'Select at least one class']"
                hint="Select one or more classes allowed for this session"
              />
              <q-input
                v-model="extraClassForm.description"
                label="Description"
                dense
                outlined
                type="textarea"
                rows="3"
              />
              <q-checkbox
                v-model="extraClassForm.is_active"
                label="Active"
              />
            </div>
            <div class="row justify-end q-mt-lg q-gutter-sm">
              <q-btn flat no-caps label="Cancel" v-close-popup />
              <q-btn
                color="primary"
                no-caps
                label="Save"
                type="submit"
                :loading="savingExtraClass"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialogs -->
    <q-dialog v-model="showDeleteDefaultSchedule" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm text-h6">Confirm Delete</span>
        </q-card-section>
        <q-card-section>
          Are you sure you want to delete this default schedule?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            label="Delete"
            color="negative"
            @click="deleteDefaultSchedule"
            :loading="deletingSchedule"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showDeleteExtraClass" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm text-h6">Confirm Delete</span>
        </q-card-section>
        <q-card-section>
          Are you sure you want to delete this extra class?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            label="Delete"
            color="negative"
            @click="deleteExtraClass"
            :loading="deletingExtraClass"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Success Dialog -->
    <q-dialog v-model="showSuccess">
      <q-card style="min-width: 420px">
        <q-card-section class="text-center">
          <q-icon name="check_circle" color="positive" size="64px" />
          <div class="text-xl font-semibold mt-2">{{ successMessage }}</div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn color="primary" no-caps label="OK" @click="closeSuccess" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, ref, onUnmounted, watch } from 'vue'
import { api } from 'src/boot/axios'
import { formatDateTime12H } from 'src/utils/date-converts'

const tab = ref('manual')
const scheduleTab = ref('default')
const showQRScanner = ref(false)
const showSuccess = ref(false)
const successMessage = ref('')
const markingAttendance = ref(false)
const loadingHistory = ref(false)
const scanning = ref(false)
const scanner = ref(null)
// const videoElement = ref(null)
const lastScanned = ref(null)
const showQRResult = ref(false)
const processingScan = ref(false) // Flag to prevent multiple simultaneous scans

const enrollments = ref([])
const enrollmentOptions = ref([])
const allEnrollments = ref([])
const attendanceHistory = ref([])

// Schedule management
const classes = ref([])
const classOptions = ref([])
const defaultSchedules = ref([])
const extraClasses = ref([])
const loadingSchedules = ref(false)
const loadingExtraClasses = ref(false)
const savingSchedule = ref(false)
const savingExtraClass = ref(false)
const deletingSchedule = ref(false)
const deletingExtraClass = ref(false)

const showAddDefaultSchedule = ref(false)
const showAddExtraClass = ref(false)
const showDeleteDefaultSchedule = ref(false)
const showDeleteExtraClass = ref(false)
const editingDefaultSchedule = ref(false)
const editingExtraClass = ref(false)
const scheduleToDelete = ref(null)
const extraClassToDelete = ref(null)

const scheduleFilterClass = ref(null)
const extraClassFilterDateFrom = ref(null)
const extraClassFilterDateTo = ref(null)
const extraClassFilterClass = ref(null)

const defaultScheduleForm = ref({
  id: null,
  class_id: null,
  day_of_week: null,
  start_time: '',
  end_time: '',
  is_active: true,
})

const extraClassForm = ref({
  id: null,
  session_date: '',
  start_time: '',
  end_time: '',
  class_ids: [],
  description: '',
  is_active: true,
})

const dayOptions = [
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
]

const defaultScheduleColumns = [
  { name: 'class', label: 'Class', field: (row) => row.class?.class_name, align: 'left' },
  { name: 'day_of_week', label: 'Day', field: 'day_of_week', align: 'left' },
  { name: 'start_time', label: 'Start Time', field: 'start_time', align: 'left' },
  { name: 'end_time', label: 'End Time', field: 'end_time', align: 'left' },
  { name: 'is_active', label: 'Status', field: 'is_active', align: 'center' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' },
]

const extraClassColumns = [
  { name: 'session_date', label: 'Date', field: 'session_date', align: 'left' },
  { name: 'start_time', label: 'Start Time', field: 'start_time', align: 'left' },
  { name: 'end_time', label: 'End Time', field: 'end_time', align: 'left' },
  { name: 'classes', label: 'Allowed Classes', field: 'classes', align: 'left' },
  { name: 'description', label: 'Description', field: 'description', align: 'left' },
  { name: 'is_active', label: 'Status', field: 'is_active', align: 'center' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' },
]

const manualForm = ref({
  enrollment_id: null,
  attendance_datetime: new Date().toISOString().slice(0, 16),
  notes: '',
  override_allowed: false,
  override_reason: '',
})

const historyFilters = ref({
  enrollment_id: null,
  date_from: null,
  date_to: null,
})

const historyColumns = [
  {
    name: 'student',
    label: 'Student',
    field: 'student',
    align: 'left',
    format: (val, row) => row.enrollment?.student?.student_name || '-',
  },
  {
    name: 'class',
    label: 'Class',
    field: 'class',
    align: 'left',
    format: (val, row) => row.enrollment?.class?.class_name || '-',
  },
  {
    name: 'attendance_datetime',
    label: 'Date & Time',
    field: 'attendance_datetime',
    align: 'left',
    sortable: true,
    format: (val) => (val ? formatDateTime12H(val) : '-'),
  },
  {
    name: 'status',
    label: 'Status',
    field: 'attendance_status',
    align: 'left',
  },
  {
    name: 'method',
    label: 'Method',
    field: 'entry_method',
    align: 'left',
  },
]

const loadEnrollments = async () => {
  const res = await api.get('/admin/enrollments')
  if (res.status === 200 && res.data?.data) {
    enrollments.value = res.data.data.filter((e) => e.status === 'active')
    allEnrollments.value = enrollments.value
    enrollmentOptions.value = enrollments.value.map((e) => ({
      label: `${e.student?.student_name} - ${e.class?.class_name}`,
      value: e.id,
    }))
  }
}

const filterEnrollments = (val, update) => {
  if (val === '') {
    update(() => {
      enrollmentOptions.value = allEnrollments.value.map((e) => ({
        label: `${e.student?.student_name} - ${e.class?.class_name}`,
        value: e.id,
      }))
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    enrollmentOptions.value = allEnrollments.value
      .filter((e) => {
        const studentName = e.student?.student_name?.toLowerCase() || ''
        const className = e.class?.class_name?.toLowerCase() || ''
        return studentName.includes(needle) || className.includes(needle)
      })
      .map((e) => ({
        label: `${e.student?.student_name} - ${e.class?.class_name}`,
        value: e.id,
      }))
  })
}

const submitManual = async () => {
  try {
    markingAttendance.value = true
    const payload = {
      ...manualForm.value,
      attendance_datetime: new Date(manualForm.value.attendance_datetime).toISOString(),
    }
    const res = await api.post('/admin/attendance/manual', payload)
    if (res.status === 201) {
      successMessage.value = 'Attendance marked successfully'
      showSuccess.value = true
      manualForm.value = {
        enrollment_id: null,
        attendance_datetime: new Date().toISOString().slice(0, 16),
        notes: '',
        override_allowed: false,
        override_reason: '',
      }
      await loadHistory()
    }
  } catch (error) {
    console.error('Attendance error:', error)
    if (error.response?.data?.message) {
      successMessage.value = error.response.data.message
      showSuccess.value = true
    }
  } finally {
    markingAttendance.value = false
  }
}

const startScanner = async () => {
  try {
    scanning.value = true
    const { Html5Qrcode } = await import('html5-qrcode')

    // Create scanner element if it doesn't exist
    let scannerElement = document.getElementById('qr-reader')
    if (!scannerElement) {
      const container = document.querySelector('.scanner-container')
      if (container) {
        const div = document.createElement('div')
        div.id = 'qr-reader'
        div.style.width = '100%'
        div.style.maxWidth = '500px'
        container.insertBefore(div, container.firstChild)
        scannerElement = div
      }
    }

    scanner.value = new Html5Qrcode('qr-reader')

    await scanner.value.start(
      { facingMode: 'environment' },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      (decodedText) => {
        handleQRScan(decodedText)
      },
      (errorMessage) => {
        console.log(errorMessage)
        // Ignore scanning errors
      },
    )
  } catch (error) {
    console.error('Scanner error:', error)
    scanning.value = false
  }
}

const stopScanner = () => {
  if (scanner.value) {
    scanner.value
      .stop()
      .then(() => {
        scanning.value = false
        scanner.value = null
      })
      .catch((err) => {
        console.error('Stop scanner error:', err)
        scanning.value = false
      })
  }
}

const handleQRScan = async (qrCode) => {
  // Prevent processing multiple scans simultaneously
  if (processingScan.value) {
    console.log('Already processing a scan, ignoring...')
    return
  }

  // Don't stop scanner - keep it running for continuous scanning
  processingScan.value = true

  try {
    const payload = {
      qr_code: qrCode,
      attendance_datetime: new Date().toISOString(),
    }

    const res = await api.post('/admin/attendance/qr-scan', payload)
    if (res.status === 201) {
      // Map attendance_status to payment_status for display
      // attendance_status can be 'present' (payment paid) or 'payment_pending' (payment not paid)
      const attendanceStatus = res.data.data.attendance_status
      console.log('Attendance marked - Raw attendance_status:', attendanceStatus, 'Type:', typeof attendanceStatus)
      console.log('Full response data:', res.data.data)
      
      // Ensure we have a valid status, default to payment_pending if not present
      const paymentStatus = attendanceStatus === 'present' ? 'present' : 'payment_pending'
      
      lastScanned.value = {
        student_name: res.data.data.enrollment?.student?.student_name,
        student_id: res.data.data.enrollment?.student?.student_id,
        class_name: res.data.data.enrollment?.class?.class_name,
        attendance_datetime: formatDateTime12H(res.data.data.attendance_datetime),
        payment_status: paymentStatus, // 'present' or 'payment_pending'
      }
      console.log('Set payment_status to:', paymentStatus)
      showQRResult.value = true
      await loadHistory()
    }
  } catch (error) {
    console.error('QR scan error:', error)
    if (error.response?.data?.message) {
      successMessage.value = error.response.data.message
      showSuccess.value = true
    }
  } finally {
    // Reset processing flag after a short delay to allow popup to show
    // The scanner will continue running and be ready for the next scan
    setTimeout(() => {
      processingScan.value = false
    }, 500)
  }
}

const closeQRResult = () => {
  showQRResult.value = false
  lastScanned.value = null
  // Scanner is already running, so it will automatically detect the next QR code
  // No need to restart - just reset the processing flag
  processingScan.value = false
}

const getPaymentStatusColor = (status) => {
  if (!status) return 'grey'
  const normalizedStatus = String(status).toLowerCase().trim()
  return normalizedStatus === 'payment_pending' || normalizedStatus === 'pending' ? 'warning' : 'positive'
}

const getPaymentStatusIcon = (status) => {
  if (!status) return 'help'
  const normalizedStatus = String(status).toLowerCase().trim()
  return normalizedStatus === 'payment_pending' || normalizedStatus === 'pending' ? 'schedule' : 'check_circle'
}

const getPaymentStatusLabel = (status) => {
  if (!status) return 'Unknown'
  const normalizedStatus = String(status).toLowerCase().trim()
  
  if (normalizedStatus === 'payment_pending' || normalizedStatus === 'pending') {
    return 'Payment Pending'
  } else if (normalizedStatus === 'present' || normalizedStatus === 'paid') {
    return 'Payment Paid'
  } else {
    console.warn('Unknown payment status:', status)
    return 'Unknown'
  }
}

const loadHistory = async () => {
  try {
    loadingHistory.value = true
    const params = {}
    if (historyFilters.value.enrollment_id) {
      params.enrollment_id = historyFilters.value.enrollment_id
    }
    if (historyFilters.value.date_from) {
      params.date_from = historyFilters.value.date_from
    }
    if (historyFilters.value.date_to) {
      params.date_to = historyFilters.value.date_to
    }

    const res = await api.get('/admin/attendance', { params })
    if (res.status === 200 && res.data?.data) {
      attendanceHistory.value = res.data.data
    }
  } catch (error) {
    console.error('Load history error:', error)
  } finally {
    loadingHistory.value = false
  }
}

const closeSuccess = () => {
  showSuccess.value = false
  successMessage.value = ''
  lastScanned.value = null
}

// Schedule management functions
const loadClasses = async () => {
  try {
    const res = await api.get('/admin/classes')
    if (res.status === 200 && res.data?.data) {
      classes.value = res.data.data.filter((c) => c.status === 'active')
      classOptions.value = classes.value.map((c) => ({
        label: c.class_name,
        value: c.id,
      }))
    }
  } catch (error) {
    console.error('Failed to load classes:', error)
  }
}

const loadDefaultSchedules = async () => {
  try {
    loadingSchedules.value = true
    const params = {}
    if (scheduleFilterClass.value) {
      params.class_id = scheduleFilterClass.value
    }
    const res = await api.get('/admin/schedules/default', { params })
    if (res.status === 200 && res.data?.data) {
      defaultSchedules.value = res.data.data
    }
  } catch (error) {
    console.error('Failed to load default schedules:', error)
  } finally {
    loadingSchedules.value = false
  }
}

const loadExtraClasses = async () => {
  try {
    loadingExtraClasses.value = true
    const params = {}
    if (extraClassFilterDateFrom.value) {
      params.date_from = extraClassFilterDateFrom.value
    }
    if (extraClassFilterDateTo.value) {
      params.date_to = extraClassFilterDateTo.value
    }
    if (extraClassFilterClass.value) {
      params.class_id = extraClassFilterClass.value
    }
    const res = await api.get('/admin/schedules/extra', { params })
    if (res.status === 200 && res.data?.data) {
      extraClasses.value = res.data.data
    }
  } catch (error) {
    console.error('Failed to load extra classes:', error)
  } finally {
    loadingExtraClasses.value = false
  }
}

const getDayName = (dayOfWeek) => {
  return dayOptions.find((d) => d.value === dayOfWeek)?.label || 'Unknown'
}

const submitDefaultSchedule = async () => {
  try {
    savingSchedule.value = true
    const payload = {
      ...defaultScheduleForm.value,
    }
    delete payload.id

    let res
    if (editingDefaultSchedule.value) {
      res = await api.put(`/admin/schedules/default/${defaultScheduleForm.value.id}`, payload)
    } else {
      res = await api.post('/admin/schedules/default', payload)
    }

    if (res.status === 200 || res.status === 201) {
      successMessage.value = editingDefaultSchedule.value
        ? 'Default schedule updated successfully'
        : 'Default schedule created successfully'
      showSuccess.value = true
      showAddDefaultSchedule.value = false
      resetDefaultScheduleForm()
      await loadDefaultSchedules()
    }
  } catch (error) {
    console.error('Schedule error:', error)
    if (error.response?.data?.message) {
      successMessage.value = error.response.data.message
      showSuccess.value = true
    }
  } finally {
    savingSchedule.value = false
  }
}

const submitExtraClass = async () => {
  try {
    savingExtraClass.value = true
    const payload = {
      ...extraClassForm.value,
    }
    delete payload.id

    let res
    if (editingExtraClass.value) {
      res = await api.put(`/admin/schedules/extra/${extraClassForm.value.id}`, payload)
    } else {
      res = await api.post('/admin/schedules/extra', payload)
    }

    if (res.status === 200 || res.status === 201) {
      successMessage.value = editingExtraClass.value
        ? 'Extra class updated successfully'
        : 'Extra class created successfully'
      showSuccess.value = true
      showAddExtraClass.value = false
      resetExtraClassForm()
      await loadExtraClasses()
    }
  } catch (error) {
    console.error('Extra class error:', error)
    if (error.response?.data?.message) {
      successMessage.value = error.response.data.message
      showSuccess.value = true
    }
  } finally {
    savingExtraClass.value = false
  }
}

const editDefaultSchedule = (schedule) => {
  editingDefaultSchedule.value = true
  defaultScheduleForm.value = {
    id: schedule.id,
    class_id: schedule.class_id,
    day_of_week: schedule.day_of_week,
    start_time: schedule.start_time,
    end_time: schedule.end_time || '',
    is_active: schedule.is_active,
  }
  showAddDefaultSchedule.value = true
}

const editExtraClass = (extraClass) => {
  editingExtraClass.value = true
  extraClassForm.value = {
    id: extraClass.id,
    session_date: extraClass.session_date,
    start_time: extraClass.start_time,
    end_time: extraClass.end_time || '',
    class_ids: extraClass.classes?.map((c) => c.id) || [],
    description: extraClass.description || '',
    is_active: extraClass.is_active,
  }
  showAddExtraClass.value = true
}

const confirmDeleteDefaultSchedule = (schedule) => {
  scheduleToDelete.value = schedule
  showDeleteDefaultSchedule.value = true
}

const confirmDeleteExtraClass = (extraClass) => {
  extraClassToDelete.value = extraClass
  showDeleteExtraClass.value = true
}

const deleteDefaultSchedule = async () => {
  if (!scheduleToDelete.value) return
  try {
    deletingSchedule.value = true
    const res = await api.delete(`/admin/schedules/default/${scheduleToDelete.value.id}`)
    if (res.status === 200) {
      successMessage.value = 'Default schedule deleted successfully'
      showSuccess.value = true
      showDeleteDefaultSchedule.value = false
      scheduleToDelete.value = null
      await loadDefaultSchedules()
    }
  } catch (error) {
    console.error('Delete schedule error:', error)
    if (error.response?.data?.message) {
      successMessage.value = error.response.data.message
      showSuccess.value = true
    }
  } finally {
    deletingSchedule.value = false
  }
}

const deleteExtraClass = async () => {
  if (!extraClassToDelete.value) return
  try {
    deletingExtraClass.value = true
    const res = await api.delete(`/admin/schedules/extra/${extraClassToDelete.value.id}`)
    if (res.status === 200) {
      successMessage.value = 'Extra class deleted successfully'
      showSuccess.value = true
      showDeleteExtraClass.value = false
      extraClassToDelete.value = null
      await loadExtraClasses()
    }
  } catch (error) {
    console.error('Delete extra class error:', error)
    if (error.response?.data?.message) {
      successMessage.value = error.response.data.message
      showSuccess.value = true
    }
  } finally {
    deletingExtraClass.value = false
  }
}

const resetDefaultScheduleForm = () => {
  editingDefaultSchedule.value = false
  defaultScheduleForm.value = {
    id: null,
    class_id: null,
    day_of_week: null,
    start_time: '',
    end_time: '',
    is_active: true,
  }
}

const resetExtraClassForm = () => {
  editingExtraClass.value = false
  extraClassForm.value = {
    id: null,
    session_date: '',
    start_time: '',
    end_time: '',
    class_ids: [],
    description: '',
    is_active: true,
  }
}

// Watch for dialog close to reset forms
const watchDialogClose = () => {
  if (!showAddDefaultSchedule.value) {
    resetDefaultScheduleForm()
  }
  if (!showAddExtraClass.value) {
    resetExtraClassForm()
  }
}

onMounted(() => {
  loadEnrollments()
  loadHistory()
  loadClasses()
  loadDefaultSchedules()
  loadExtraClasses()
})

// Watch dialogs
watch(showAddDefaultSchedule, watchDialogClose)
watch(showAddExtraClass, watchDialogClose)

onUnmounted(() => {
  if (scanner.value) {
    stopScanner()
  }
})
</script>

<style scoped>
.scanner-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#qr-reader {
  border-radius: 8px;
  overflow: hidden;
}

#qr-reader__dashboard_section {
  background: white;
  border-radius: 8px;
}

#qr-reader__camera_selection {
  margin: 10px 0;
}
</style>
