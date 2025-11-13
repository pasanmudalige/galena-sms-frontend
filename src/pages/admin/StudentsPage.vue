<template>
  <q-page class="p-6">
    <div class="flex justify-between items-center mb-4">
      <div class="text-xl font-semibold">Manage Students</div>
      <q-btn no-caps color="primary" icon="add" label="Add Student" @click="showAdd = true" />
    </div>
    <q-table :rows="rows" :columns="columns" row-key="id" flat bordered>
      <template #body-cell-pending_access="props">
        <q-td :props="props">
          <q-badge v-if="props.value" color="orange" label="Pending Access" />
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
            class="mr-1"
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
            class="mr-1"
            @click="resetPassword(props.row)"
            title="Reset Password"
          />
          <q-btn
            dense
            flat
            round
            icon="edit"
            color="primary"
            class="mr-1"
            @click="onEdit(props.row)"
          />
          <q-btn dense flat round icon="delete" color="negative" @click="onDelete(props.row)" />
        </q-td>
      </template>
    </q-table>
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
          <q-form @submit.prevent="submitAdd" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <q-input
                v-model="form.student_name"
                label="Student Name"
                dense
                outlined
                :rules="[(v) => !!v || 'Required']"
              />
              <q-input
                v-model="form.student_id"
                label="Student ID (optional)"
                dense
                outlined
                hint="Leave empty to auto-generate"
              />
              <q-input v-model="form.school" label="School" dense outlined />
              <q-input
                v-model="form.phone"
                label="Phone (WhatsApp)"
                dense
                outlined
                :rules="[(v) => !!v || 'Required']"
              />
              <q-input v-model="form.parent_phone" label="Parent Phone" dense outlined />
              <q-input
                v-model="form.email"
                label="Email"
                dense
                outlined
                type="email"
                :rules="[
                  (v) => !!v || 'Required',
                  (v) => !form.grant_access_immediately || !!v || 'Email is required to grant access',
                ]"
              />

              <q-input
                v-model="form.address"
                label="Address"
                dense
                outlined
                type="textarea"
                autogrow
                class="md:col-span-2"
              />

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

              <div class="md:col-span-2">
                <div class="text-sm text-grey-8 font-medium mb-2">Where did you hear about us?</div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div
                    v-for="option in hearAboutUsOptions"
                    :key="option.value"
                    class="bg-white rounded-lg p-2 shadow-sm"
                  >
                    <q-checkbox
                      :val="option.value"
                      v-model="form.hear_about_us"
                      :label="option.label"
                      dense
                      color="primary"
                    />
                  </div>
                </div>
              </div>

              <div class="md:col-span-2">
                <q-checkbox
                  v-model="form.grant_access_immediately"
                  label="Grant access immediately (generate username and password)"
                  color="primary"
                  dense
                />
                <div class="text-xs text-grey-6 mt-1">
                  If checked, access credentials will be generated and shown after saving
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-300">
              <q-btn
                flat
                no-caps
                label="Cancel"
                color="grey-7"
                class="hover:text-grey-9"
                v-close-popup
              />
              <q-btn
                color="primary"
                no-caps
                label="Save"
                type="submit"
                :loading="saving"
                class="text-white shadow-md hover:shadow-lg"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showEdit" persistent>
      <q-card style="min-width: 520px">
        <q-card-section class="text-lg font-semibold">Edit Student</q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit.prevent="submitEdit">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <q-input
                v-model="editForm.student_name"
                label="Student Name"
                dense
                outlined
                :rules="[(v) => !!v || 'Required']"
              />
              <q-input v-model="editForm.student_id" label="Student ID" dense outlined />
              <q-input v-model="editForm.school" label="School" dense outlined />
              <q-input
                v-model="editForm.phone"
                label="Phone (WhatsApp)"
                dense
                outlined
                :rules="[(v) => !!v || 'Required']"
              />
              <q-input v-model="editForm.parent_phone" label="Parent Phone" dense outlined />
              <q-input v-model="editForm.email" label="Email" dense outlined type="email" />
              <q-select
                v-model="editForm.status"
                label="Status"
                dense
                outlined
                :options="statusOptions"
                class="md:col-span-2"
              />
              <q-input
                v-model="editForm.address"
                label="Address"
                dense
                outlined
                type="textarea"
                autogrow
                class="md:col-span-2"
              />
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
              <div class="md:col-span-2">
                <div class="text-sm text-grey-7 q-mb-sm">Where did you hear about us?</div>
                <div class="row q-col-gutter-sm">
                  <div
                    class="col-12 col-sm-6"
                    v-for="option in hearAboutUsOptions"
                    :key="option.value"
                  >
                    <q-checkbox
                      :val="option.value"
                      v-model="editForm.hear_about_us"
                      :label="option.label"
                      dense
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="flex justify-end gap-2 mt-4">
              <q-btn flat no-caps label="Cancel" v-close-popup />
              <q-btn color="primary" no-caps label="Update" type="submit" :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showSuccess">
      <q-card style="min-width: 420px">
        <q-card-section class="text-center">
          <q-icon name="check_circle" color="positive" size="64px" />
          <div class="text-xl font-semibold mt-2">{{ successMessage }}</div>
          <div v-if="createdStudentId" class="text-gray-600 mt-1">
            Student ID: <span class="font-mono">{{ createdStudentId }}</span>
          </div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn color="primary" no-caps label="OK" @click="closeSuccess" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Credentials Dialog -->
    <q-dialog v-model="showCredentials" persistent>
      <q-card style="min-width: 500px">
        <q-card-section class="bg-primary text-white text-lg font-semibold">
          Student Login Credentials
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="space-y-3">
            <div>
              <div class="text-sm text-grey-7 mb-1">Student Name</div>
              <div class="text-lg font-semibold">{{ credentials.student_name }}</div>
            </div>
            <div>
              <div class="text-sm text-grey-7 mb-1">Student ID</div>
              <div class="text-lg font-mono">{{ credentials.student_id }}</div>
            </div>
            <q-separator />
            <div>
              <div class="text-sm text-grey-7 mb-1">Username (Email)</div>
              <div class="flex items-center gap-2">
                <div class="text-lg font-mono flex-1 bg-grey-2 p-2 rounded">{{ credentials.username }}</div>
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
              <div class="text-sm text-grey-7 mb-1">Password</div>
              <div class="flex items-center gap-2">
                <div class="text-lg font-mono flex-1 bg-grey-2 p-2 rounded">{{ credentials.password }}</div>
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
            <div class="bg-blue-1 p-3 rounded">
              <div class="text-sm text-grey-8">
                <strong>Note:</strong> Copy these credentials and send them to the student via WhatsApp.
                The password is shown only once.
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat no-caps label="Copy All" color="primary" @click="copyAllCredentials" />
          <q-btn flat no-caps label="Close" color="grey-7" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { api } from 'src/boot/axios'

const rows = ref([])
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
const statusOptions = ['active', 'inactive']
const alYears = ref([])
const hearAboutUsOptions = [
  { label: 'From Poster', value: 'From Poster' },
  { label: 'From Facebook', value: 'From Facebook' },
  { label: 'From Instagram', value: 'From Instagram' },
  { label: 'From Leaflet', value: 'From Leaflet' },
  { label: 'A Friend Or Colleague', value: 'A Friend Or Colleague' },
]
const columns = [
  { name: 'student_id', label: 'Student Id', field: 'student_id', align: 'left', sortable: true },
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
  { name: 'pending_access', label: 'Access Status', field: 'pending_access', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'createdAt', label: 'Registered', field: 'createdAt', align: 'left', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' },
]

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
  const res = await api.get('/admin/students')
  if (res.status === 200 && res.data?.data) {
    rows.value = res.data.data
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
      // If not JSON, treat as string (for backward compatibility)
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
    }
  } finally {
    saving.value = false
  }
}

const onDelete = async (row) => {
  await api.delete(`/admin/students/${row.id}`)
  await load()
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
          // Still show success message even if grant access fails
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
    }
  } finally {
    saving.value = false
  }
}

const closeSuccess = () => {
  showSuccess.value = false
  createdStudentId.value = ''
  successMessage.value = ''
}

const grantAccess = async (row) => {
  if (!confirm(`Grant access to ${row.student_name}?`)) return
  try {
    const res = await api.post(`/admin/students/${row.id}/grant-access`)
    if (res.status === 200 && res.data?.data) {
      credentials.value = {
        student_name: res.data.data.student_name,
        student_id: res.data.data.student_id,
        username: res.data.data.username,
        password: res.data.data.password,
      }
      showCredentials.value = true
      await load()
    }
  } catch (error) {
    console.error('Grant access error:', error)
    if (error.response?.data?.message) {
      alert(error.response.data.message)
    }
  }
}

const resetPassword = async (row) => {
  if (!confirm(`Reset password for ${row.student_name}?`)) return
  try {
    const res = await api.post(`/admin/students/${row.id}/reset-password`)
    if (res.status === 200 && res.data?.data) {
      credentials.value = {
        student_name: res.data.data.student_name,
        student_id: res.data.data.student_id,
        username: res.data.data.username,
        password: res.data.data.password,
      }
      showCredentials.value = true
    }
  } catch (error) {
    console.error('Reset password error:', error)
    if (error.response?.data?.message) {
      alert(error.response.data.message)
    }
  }
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    // You could show a toast notification here
  } catch (err) {
    console.error('Failed to copy:', err)
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}

const copyAllCredentials = () => {
  const loginUrl = `${window.location.origin}/admin`
  const text = `Student Login Credentials\n\nStudent: ${credentials.value.student_name}\nStudent ID: ${credentials.value.student_id}\nUsername: ${credentials.value.username}\nPassword: ${credentials.value.password}\n\nLogin using this link:\n${loginUrl}`
  copyToClipboard(text)
}
</script>
