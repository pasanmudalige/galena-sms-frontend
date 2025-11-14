<template>
  <q-page class="q-pa-md">
    <div class="q-pa-md">
      <!-- Page Header -->
      <div class="row items-center q-mb-lg">
        <div class="col">
          <div class="text-subtitle2 text-grey-6">View and manage all student records</div>
        </div>
        <div class="col-auto">
          <q-btn
            no-caps
            color="primary"
            icon="add"
            label="Add Student"
            unelevated
            @click="showAdd = true"
          />
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="stat-card stat-card-blue">
            <q-card-section class="q-pa-md">
              <div class="row items-center">
                <div class="col">
                  <div class="text-overline text-grey-7">Total Students</div>
                  <div class="text-h4 text-weight-bold text-primary q-mt-xs">
                    {{ rows.length }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="56px" color="blue-1" text-color="primary">
                    <q-icon name="people" size="32px" />
                  </q-avatar>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="stat-card stat-card-green">
            <q-card-section class="q-pa-md">
              <div class="row items-center">
                <div class="col">
                  <div class="text-overline text-grey-7">Active Students</div>
                  <div class="text-h4 text-weight-bold text-positive q-mt-xs">
                    {{ activeStudentsCount }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="56px" color="green-1" text-color="positive">
                    <q-icon name="check_circle" size="32px" />
                  </q-avatar>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="stat-card stat-card-orange">
            <q-card-section class="q-pa-md">
              <div class="row items-center">
                <div class="col">
                  <div class="text-overline text-grey-7">Pending Access</div>
                  <div class="text-h4 text-weight-bold text-warning q-mt-xs">
                    {{ pendingAccessCount }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="56px" color="orange-1" text-color="warning">
                    <q-icon name="schedule" size="32px" />
                  </q-avatar>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="stat-card stat-card-red">
            <q-card-section class="q-pa-md">
              <div class="row items-center">
                <div class="col">
                  <div class="text-overline text-grey-7">Inactive Students</div>
                  <div class="text-h4 text-weight-bold text-negative q-mt-xs">
                    {{ inactiveStudentsCount }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="56px" color="red-1" text-color="negative">
                    <q-icon name="block" size="32px" />
                  </q-avatar>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Students Table -->
      <q-card flat bordered>
        <q-card-section class="q-pa-md">
          <q-table
            :rows="rows"
            :columns="columns"
            row-key="id"
            flat
            bordered
            :loading="loading"
            :rows-per-page-options="[10, 20, 50, 100]"
            class="students-table"
          >
            <template #top>
              <div class="text-h6 text-weight-bold text-grey-8">Students List</div>
            </template>

            <template #body-cell-status="props">
              <q-td :props="props">
                <q-chip
                  :color="props.value === 'active' ? 'positive' : 'negative'"
                  text-color="white"
                  :icon="props.value === 'active' ? 'check_circle' : 'block'"
                  size="sm"
                >
                  {{ props.value || 'active' }}
                </q-chip>
              </q-td>
            </template>

            <template #body-cell-pending_access="props">
              <q-td :props="props">
                <q-badge v-if="props.value" color="orange" label="Pending Access" />
                <q-badge v-else color="positive" label="Access Granted" />
              </q-td>
            </template>

            <template #body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  v-if="props.row.pending_access && !props.row.user_id"
                  dense
                  flat
                  round
                  icon="vpn_key"
                  color="positive"
                  class="q-mr-xs"
                  @click="grantAccess(props.row)"
                  title="Grant Access"
                />
                <q-btn
                  v-else-if="props.row.user_id"
                  dense
                  flat
                  round
                  icon="lock_reset"
                  color="warning"
                  class="q-mr-xs"
                  @click="resetPassword(props.row)"
                  title="Reset Password"
                />
                <q-btn
                  dense
                  flat
                  round
                  icon="edit"
                  color="primary"
                  class="q-mr-xs"
                  @click="onEdit(props.row)"
                  title="Edit Student"
                />
                <q-btn
                  dense
                  flat
                  round
                  icon="delete"
                  color="negative"
                  @click="onDelete(props.row)"
                  title="Delete Student"
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>

      <!-- Add Student Dialog -->
      <q-dialog v-model="showAdd" persistent>
        <q-card class="rounded-xl shadow-lg" style="min-width: 540px; max-width: 600px">
          <!-- Header -->
          <q-card-section
            class="bg-primary text-white text-lg font-semibold flex items-center justify-between rounded-t-xl"
          >
            <div>Add Student</div>
            <q-btn flat dense round icon="close" color="white" v-close-popup />
          </q-card-section>

          <q-separator color="grey-4" />

          <!-- Form Section -->
          <q-card-section class="q-pa-lg bg-grey-1">
            <q-form @submit.prevent="submitAdd" class="q-gutter-md">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.student_name"
                    label="Student Name *"
                    dense
                    outlined
                    :rules="[(v) => !!v || 'Required']"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.student_id"
                    label="Student ID (optional)"
                    dense
                    outlined
                    hint="Leave empty to auto-generate"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model="form.school" label="School" dense outlined />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.phone"
                    label="Phone (WhatsApp) *"
                    dense
                    outlined
                    :rules="[(v) => !!v || 'Required']"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model="form.parent_phone" label="Parent Phone" dense outlined />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.email"
                    label="Email *"
                    dense
                    outlined
                    type="email"
                    :rules="[
                      (v) => !!v || 'Required',
                      (v) =>
                        !form.grant_access_immediately ||
                        !!v ||
                        'Email is required to grant access',
                    ]"
                  />
                </div>
                <div class="col-12">
                  <q-input
                    v-model="form.address"
                    label="Address"
                    dense
                    outlined
                    type="textarea"
                    autogrow
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-select
                    v-model="form.year_of_al"
                    label="Year of A/L"
                    dense
                    outlined
                    :options="alYears"
                    emit-value
                    map-options
                    clearable
                  />
                </div>
                <div class="col-12">
                  <div class="text-sm text-grey-8 font-medium q-mb-sm">
                    Where did you hear about us?
                  </div>
                  <div class="row q-col-gutter-sm">
                    <div
                      class="col-12 col-sm-6"
                      v-for="option in hearAboutUsOptions"
                      :key="option.value"
                    >
                      <q-card flat bordered class="q-pa-xs">
                        <q-checkbox
                          :val="option.value"
                          v-model="form.hear_about_us"
                          :label="option.label"
                          dense
                          color="primary"
                        />
                      </q-card>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <q-checkbox
                    v-model="form.grant_access_immediately"
                    label="Grant access immediately (generate username and password)"
                    color="primary"
                    dense
                  />
                  <div class="text-xs text-grey-6 q-mt-xs">
                    If checked, access credentials will be generated and shown after saving
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex justify-end q-gutter-sm q-mt-lg">
                <q-btn flat no-caps label="Cancel" color="grey-7" v-close-popup />
                <q-btn
                  color="primary"
                  no-caps
                  label="Save"
                  type="submit"
                  :loading="saving"
                  unelevated
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- Edit Student Dialog -->
      <q-dialog v-model="showEdit" persistent>
        <q-card class="rounded-xl shadow-lg" style="min-width: 540px; max-width: 600px">
          <q-card-section
            class="bg-primary text-white text-lg font-semibold flex items-center justify-between rounded-t-xl"
          >
            <div>Edit Student</div>
            <q-btn flat dense round icon="close" color="white" v-close-popup />
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-lg bg-grey-1">
            <q-form @submit.prevent="submitEdit" class="q-gutter-md">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="editForm.student_name"
                    label="Student Name *"
                    dense
                    outlined
                    :rules="[(v) => !!v || 'Required']"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model="editForm.student_id" label="Student ID" dense outlined />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model="editForm.school" label="School" dense outlined />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="editForm.phone"
                    label="Phone (WhatsApp) *"
                    dense
                    outlined
                    :rules="[(v) => !!v || 'Required']"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model="editForm.parent_phone" label="Parent Phone" dense outlined />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model="editForm.email" label="Email" dense outlined type="email" />
                </div>
                <div class="col-12">
                  <q-select
                    v-model="editForm.status"
                    label="Status *"
                    dense
                    outlined
                    :options="statusOptions"
                    option-label="label"
                    option-value="value"
                    emit-value
                    map-options
                  >
                    <template #option="scope">
                      <q-item v-bind="scope.itemProps">
                        <q-item-section avatar>
                          <q-icon
                            :name="scope.opt.value === 'active' ? 'check_circle' : 'block'"
                            :color="scope.opt.value === 'active' ? 'positive' : 'negative'"
                          />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ scope.opt.label }}</q-item-label>
                          <q-item-label caption>
                            {{
                              scope.opt.value === 'active'
                                ? 'Student can login'
                                : 'Student will be blocked from login'
                            }}
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                    <template #selected>
                      <span v-if="editForm.status">
                        {{
                          statusOptions.find((opt) => opt.value === editForm.status)?.label ||
                          editForm.status
                        }}
                      </span>
                    </template>
                  </q-select>
                </div>
                <div class="col-12">
                  <q-input
                    v-model="editForm.address"
                    label="Address"
                    dense
                    outlined
                    type="textarea"
                    autogrow
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-select
                    v-model="editForm.year_of_al"
                    label="Year of A/L"
                    dense
                    outlined
                    :options="alYears"
                    emit-value
                    map-options
                    clearable
                  />
                </div>
                <div class="col-12">
                  <div class="text-sm text-grey-7 q-mb-sm">Where did you hear about us?</div>
                  <div class="row q-col-gutter-sm">
                    <div
                      class="col-12 col-sm-6"
                      v-for="option in hearAboutUsOptions"
                      :key="option.value"
                    >
                      <q-card flat bordered class="q-pa-xs">
                        <q-checkbox
                          :val="option.value"
                          v-model="editForm.hear_about_us"
                          :label="option.label"
                          dense
                        />
                      </q-card>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex justify-end q-gutter-sm q-mt-lg">
                <q-btn flat no-caps label="Cancel" v-close-popup />
                <q-btn
                  color="primary"
                  no-caps
                  label="Update"
                  type="submit"
                  :loading="saving"
                  unelevated
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- Success Dialog -->
      <q-dialog v-model="showSuccess">
        <q-card class="rounded-xl" style="min-width: 420px">
          <q-card-section class="text-center q-pa-lg">
            <q-icon name="check_circle" color="positive" size="64px" />
            <div class="text-h6 text-weight-bold q-mt-md">{{ successMessage }}</div>
            <div v-if="createdStudentId" class="text-grey-7 q-mt-sm">
              Student ID: <span class="text-weight-bold">{{ createdStudentId }}</span>
            </div>
          </q-card-section>
          <q-card-actions align="center" class="q-pb-lg">
            <q-btn color="primary" no-caps label="OK" unelevated @click="closeSuccess" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Credentials Dialog -->
      <q-dialog v-model="showCredentials" persistent>
        <q-card class="rounded-xl" style="min-width: 500px">
          <q-card-section class="bg-primary text-white text-lg font-semibold rounded-t-xl">
            Student Login Credentials
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-lg">
            <div class="q-gutter-md">
              <div>
                <div class="text-caption text-grey-7 q-mb-xs">Student Name</div>
                <div class="text-body1 text-weight-bold">{{ credentials.student_name }}</div>
              </div>
              <div>
                <div class="text-caption text-grey-7 q-mb-xs">Student ID</div>
                <div class="text-body1 font-mono">{{ credentials.student_id }}</div>
              </div>
              <q-separator />
              <div>
                <div class="text-caption text-grey-7 q-mb-xs">Username (Email)</div>
                <div class="row items-center q-gutter-xs">
                  <div class="col text-body1 font-mono bg-grey-2 q-pa-sm rounded-borders">
                    {{ credentials.username }}
                  </div>
                  <q-btn
                    flat
                    dense
                    round
                    icon="content_copy"
                    color="primary"
                    @click="copyToClipboard(credentials.username)"
                  />
                </div>
              </div>
              <div>
                <div class="text-caption text-grey-7 q-mb-xs">Password</div>
                <div class="row items-center q-gutter-xs">
                  <div class="col text-body1 font-mono bg-grey-2 q-pa-sm rounded-borders">
                    {{ credentials.password }}
                  </div>
                  <q-btn
                    flat
                    dense
                    round
                    icon="content_copy"
                    color="primary"
                    @click="copyToClipboard(credentials.password)"
                  />
                </div>
              </div>
              <q-separator />
              <q-banner class="bg-blue-1 text-blue-9 rounded-borders">
                <template #avatar>
                  <q-icon name="info" color="blue" />
                </template>
                <div class="text-caption">
                  <strong>Note:</strong> Copy these credentials and send them to the student via
                  WhatsApp. The password is shown only once.
                </div>
              </q-banner>
            </div>
          </q-card-section>
          <q-card-actions align="right" class="q-pa-md">
            <q-btn flat no-caps label="Copy All" color="primary" @click="copyAllCredentials" />
            <q-btn flat no-caps label="Close" color="grey-7" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Delete Confirmation Dialog -->
      <q-dialog v-model="showDeleteConfirm" persistent>
        <q-card style="min-width: 350px">
          <q-card-section class="row items-center">
            <q-avatar icon="delete" color="negative" text-color="white" />
            <span class="q-ml-sm text-h6">Confirm Delete</span>
          </q-card-section>
          <q-card-section>
            Are you sure you want to delete {{ studentToDelete?.student_name }}?
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="grey-7" v-close-popup />
            <q-btn flat label="Delete" color="negative" @click="confirmDelete" :loading="deleting" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Grant Access Confirmation Dialog -->
      <q-dialog v-model="showGrantAccessConfirm" persistent>
        <q-card style="min-width: 350px">
          <q-card-section class="row items-center">
            <q-avatar icon="vpn_key" color="positive" text-color="white" />
            <span class="q-ml-sm text-h6">Grant Access</span>
          </q-card-section>
          <q-card-section>
            Grant access to {{ studentToGrantAccess?.student_name }}?
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="grey-7" v-close-popup />
            <q-btn flat label="Grant Access" color="positive" @click="confirmGrantAccess" :loading="grantingAccess" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Reset Password Confirmation Dialog -->
      <q-dialog v-model="showResetPasswordConfirm" persistent>
        <q-card style="min-width: 350px">
          <q-card-section class="row items-center">
            <q-avatar icon="lock_reset" color="warning" text-color="white" />
            <span class="q-ml-sm text-h6">Reset Password</span>
          </q-card-section>
          <q-card-section>
            Reset password for {{ studentToResetPassword?.student_name }}?
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="grey-7" v-close-popup />
            <q-btn flat label="Reset Password" color="warning" @click="confirmResetPassword" :loading="resettingPassword" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { api } from 'src/boot/axios'
import { showSuccessNotification, showErrorNotification } from 'src/utils/notification'

const rows = ref([])
const loading = ref(false)
const showDeleteConfirm = ref(false)
const showGrantAccessConfirm = ref(false)
const showResetPasswordConfirm = ref(false)
const studentToDelete = ref(null)
const studentToGrantAccess = ref(null)
const studentToResetPassword = ref(null)
const deleting = ref(false)
const grantingAccess = ref(false)
const resettingPassword = ref(false)
const showAdd = ref(false)
const showEdit = ref(false)
const showSuccess = ref(false)
const showCredentials = ref(false)
const createdStudentId = ref('')
const successMessage = ref('')
const saving = ref(false)
const editingStudentId = ref(null)
const credentials = ref({
  student_name: '',
  student_id: '',
  username: '',
  password: '',
})
const form = ref({
  student_name: '',
  student_id: '',
  school: '',
  phone: '',
  parent_phone: '',
  email: '',
  address: '',
  year_of_al: '',
  hear_about_us: [],
  grant_access_immediately: false,
})
const editForm = ref({
  student_name: '',
  student_id: '',
  school: '',
  phone: '',
  parent_phone: '',
  email: '',
  address: '',
  year_of_al: '',
  hear_about_us: [],
  status: 'active',
})
const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]
const alYears = ref([])
const hearAboutUsOptions = [
  { label: 'From Poster', value: 'From Poster' },
  { label: 'From Facebook', value: 'From Facebook' },
  { label: 'From Instagram', value: 'From Instagram' },
  { label: 'From Leaflet', value: 'From Leaflet' },
  { label: 'A Friend Or Colleague', value: 'A Friend Or Colleague' },
]
const columns = [
  { name: 'student_id', label: 'Student ID', field: 'student_id', align: 'left', sortable: true },
  { name: 'student_name', label: 'Name', field: 'student_name', align: 'left', sortable: true },
  { name: 'school', label: 'School', field: 'school', align: 'left', sortable: true },
  { name: 'year_of_al', label: 'Year of A/L', field: 'year_of_al', align: 'left', sortable: true },
  {
    name: 'hear_about_us',
    label: 'Hear About Us',
    field: 'hear_about_us',
    align: 'left',
    format: (val) => formatHearAboutUs(val),
  },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'phone', label: 'Phone', field: 'phone', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'pending_access', label: 'Access Status', field: 'pending_access', align: 'left' },
  { name: 'createdAt', label: 'Registered', field: 'createdAt', align: 'left', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' },
]

const activeStudentsCount = computed(() => {
  return rows.value.filter((r) => r.status === 'active').length
})

const inactiveStudentsCount = computed(() => {
  return rows.value.filter((r) => r.status === 'inactive').length
})

const pendingAccessCount = computed(() => {
  return rows.value.filter((r) => r.pending_access && !r.user_id).length
})

const loadALYears = async () => {
  try {
    const res = await api.get('/admin/constants/al-years')
    if (res.status === 200 && res.data?.data) {
      alYears.value = res.data.data.map((year) => ({ label: year, value: year }))
    }
  } catch (error) {
    console.error('Error loading A/L years:', error)
  }
}

const formatHearAboutUs = (val) => {
  if (!val) return '-'
  try {
    const parsed = JSON.parse(val)
    if (Array.isArray(parsed)) {
      return parsed.join(', ')
    }
    return parsed
  } catch (e) {
    console.log(e)
    return val
  }
}

const load = async () => {
  loading.value = true
  try {
    const res = await api.get('/admin/students')
    if (res.status === 200 && res.data?.data) {
      rows.value = res.data.data
    }
  } catch (error) {
    showErrorNotification('Failed to load students')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const onEdit = (row) => {
  editingStudentId.value = row.id
  // Parse hear_about_us from JSON string if it exists
  let hearAboutUs = []
  if (row.hear_about_us) {
    try {
      hearAboutUs = JSON.parse(row.hear_about_us)
    } catch (e) {
      console.log(e)
      hearAboutUs = row.hear_about_us ? [row.hear_about_us] : []
    }
  }
  editForm.value = {
    student_name: row.student_name || '',
    student_id: row.student_id || '',
    school: row.school || '',
    phone: row.phone || '',
    parent_phone: row.parent_phone || '',
    email: row.email || '',
    address: row.address || '',
    year_of_al: row.year_of_al || '',
    hear_about_us: hearAboutUs,
    status: row.status || 'active',
  }
  showEdit.value = true
}

const submitEdit = async () => {
  try {
    saving.value = true
    const payload = { ...editForm.value }
    // Ensure hear_about_us is sent as array
    if (!Array.isArray(payload.hear_about_us)) {
      payload.hear_about_us = payload.hear_about_us ? [payload.hear_about_us] : []
    }
    const res = await api.put(`/admin/students/${editingStudentId.value}`, payload)
    if (res.status === 200) {
      showEdit.value = false
      successMessage.value = 'Student updated successfully'
      createdStudentId.value = ''
      showSuccess.value = true
      await load()
      showSuccessNotification('Student updated successfully')
    }
  } catch (error) {
    showErrorNotification('Failed to update student')
    console.error(error)
  } finally {
    saving.value = false
  }
}

const onDelete = (row) => {
  studentToDelete.value = row
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (!studentToDelete.value) return
  
  deleting.value = true
  try {
    await api.delete(`/admin/students/${studentToDelete.value.id}`)
    await load()
    showSuccessNotification('Student deleted successfully')
    showDeleteConfirm.value = false
    studentToDelete.value = null
  } catch (error) {
    showErrorNotification(error.response?.data?.message || 'Failed to delete student')
    console.error(error)
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  load()
  loadALYears()
})

const submitAdd = async () => {
  try {
    saving.value = true
    const payload = { ...form.value }
    const grantAccessImmediately = payload.grant_access_immediately
    // Remove grant_access_immediately from payload - it's not a backend field
    delete payload.grant_access_immediately
    // Remove student_id from payload if empty - backend will auto-generate
    if (!payload.student_id || payload.student_id.trim() === '') {
      delete payload.student_id
    }
    // Ensure hear_about_us is sent as array
    if (!Array.isArray(payload.hear_about_us)) {
      payload.hear_about_us = payload.hear_about_us ? [payload.hear_about_us] : []
    }
    const res = await api.post('/admin/students', payload)
    if (res.status === 201) {
      const studentId = res.data?.data?.id // Database ID for API calls
      createdStudentId.value = res.data?.data?.student_id || payload.student_id
      successMessage.value = 'Student added successfully'
      showAdd.value = false

      // If grant access immediately is checked, grant access
      if (grantAccessImmediately && studentId && payload.email) {
        try {
          const accessRes = await api.post(`/admin/students/${studentId}/grant-access`)
          if (accessRes.status === 200 && accessRes.data?.data) {
            credentials.value = {
              student_name: accessRes.data.data.student_name,
              student_id: accessRes.data.data.student_id,
              username: accessRes.data.data.username,
              password: accessRes.data.data.password,
            }
            showCredentials.value = true
          }
        } catch (error) {
          console.error('Grant access error:', error)
          showSuccess.value = true
        }
      } else {
        showSuccess.value = true
      }

      form.value = {
        student_name: '',
        student_id: '',
        school: '',
        phone: '',
        parent_phone: '',
        email: '',
        address: '',
        year_of_al: '',
        hear_about_us: [],
        grant_access_immediately: false,
      }
      await load()
      showSuccessNotification('Student added successfully')
    }
  } catch (error) {
    showErrorNotification('Failed to add student')
    console.error(error)
  } finally {
    saving.value = false
  }
}

const closeSuccess = () => {
  showSuccess.value = false
  createdStudentId.value = ''
  successMessage.value = ''
}

const grantAccess = (row) => {
  studentToGrantAccess.value = row
  showGrantAccessConfirm.value = true
}

const confirmGrantAccess = async () => {
  if (!studentToGrantAccess.value) return
  
  grantingAccess.value = true
  try {
    const res = await api.post(`/admin/students/${studentToGrantAccess.value.id}/grant-access`)
    if (res.status === 200 && res.data?.data) {
      credentials.value = {
        student_name: res.data.data.student_name,
        student_id: res.data.data.student_id,
        username: res.data.data.username,
        password: res.data.data.password,
      }
      showCredentials.value = true
      await load()
      showSuccessNotification('Access granted successfully')
      showGrantAccessConfirm.value = false
      studentToGrantAccess.value = null
    }
  } catch (error) {
    console.error('Grant access error:', error)
    showErrorNotification(error.response?.data?.message || 'Failed to grant access')
  } finally {
    grantingAccess.value = false
  }
}

const resetPassword = (row) => {
  studentToResetPassword.value = row
  showResetPasswordConfirm.value = true
}

const confirmResetPassword = async () => {
  if (!studentToResetPassword.value) return
  
  resettingPassword.value = true
  try {
    const res = await api.post(`/admin/students/${studentToResetPassword.value.id}/reset-password`)
    if (res.status === 200 && res.data?.data) {
      credentials.value = {
        student_name: res.data.data.student_name,
        student_id: res.data.data.student_id,
        username: res.data.data.username,
        password: res.data.data.password,
      }
      showCredentials.value = true
      showSuccessNotification('Password reset successfully')
      showResetPasswordConfirm.value = false
      studentToResetPassword.value = null
    }
  } catch (error) {
    console.error('Reset password error:', error)
    showErrorNotification(error.response?.data?.message || 'Failed to reset password')
  } finally {
    resettingPassword.value = false
  }
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    showSuccessNotification('Copied to clipboard')
  } catch (err) {
    console.error('Failed to copy:', err)
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    showSuccessNotification('Copied to clipboard')
  }
}

const copyAllCredentials = () => {
  const loginUrl = `${window.location.origin}/login`
  const text = `Student Login Credentials\n\nStudent: ${credentials.value.student_name}\nStudent ID: ${credentials.value.student_id}\nUsername: ${credentials.value.username}\nPassword: ${credentials.value.password}\n\nLogin using this link:\n${loginUrl}`
  copyToClipboard(text)
  showSuccessNotification('All credentials copied to clipboard')
}
</script>

<style scoped>
.stat-card {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  border-left: 4px solid transparent;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-card-blue {
  border-left-color: #1976d2;
}

.stat-card-green {
  border-left-color: #21ba45;
}

.stat-card-orange {
  border-left-color: #f2c037;
}

.stat-card-red {
  border-left-color: #c10015;
}

.students-table :deep(.q-table__top) {
  padding: 16px;
}

.students-table :deep(.q-table thead tr th) {
  background-color: #f5f5f5;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.5px;
}

.students-table :deep(.q-table tbody tr:hover) {
  background-color: #f9f9f9;
}
</style>
