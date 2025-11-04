<template>
  <q-page class="p-6">
    <div class="flex justify-between items-center mb-4">
      <div class="text-xl font-semibold">Manage Students</div>
      <q-btn no-caps color="primary" icon="add" label="Add Student" @click="showAdd = true" />
    </div>
    <q-table :rows="rows" :columns="columns" row-key="id" flat bordered>
      <template #body-cell-actions="props">
        <q-td :props="props">
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
      <q-card style="min-width: 520px">
        <q-card-section class="text-lg font-semibold">Add Student</q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit.prevent="submitAdd">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                :hint="'Leave empty to auto-generate'"
              />
              <q-input
                v-model="form.phone"
                label="Phone (WhatsApp)"
                dense
                outlined
                :rules="[(v) => !!v || 'Required']"
              />
              <q-input v-model="form.parent_phone" label="Parent Phone" dense outlined />
              <q-input v-model="form.email" label="Email" dense outlined type="email" />
              <q-input
                v-model="form.address"
                label="Address"
                dense
                outlined
                type="textarea"
                autogrow
                class="md:col-span-2"
              />
            </div>
            <div class="flex justify-end gap-2 mt-4">
              <q-btn flat no-caps label="Cancel" v-close-popup />
              <q-btn color="primary" no-caps label="Save" type="submit" :loading="saving" />
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
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { api } from 'src/boot/axios'

const rows = ref([])
const showAdd = ref(false)
const showEdit = ref(false)
const showSuccess = ref(false)
const createdStudentId = ref('')
const successMessage = ref('')
const saving = ref(false)
const editingStudentId = ref(null)
const form = ref({
  student_name: '',
  student_id: '',
  phone: '',
  parent_phone: '',
  email: '',
  address: '',
})
const editForm = ref({
  student_name: '',
  student_id: '',
  phone: '',
  parent_phone: '',
  email: '',
  address: '',
  status: 'active',
})
const statusOptions = ['active', 'inactive']
const columns = [
  { name: 'student_id', label: 'Student Id', field: 'student_id', align: 'left', sortable: true },
  { name: 'student_name', label: 'Name', field: 'student_name', align: 'left', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'phone', label: 'Phone', field: 'phone', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'createdAt', label: 'Registered', field: 'createdAt', align: 'left', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' },
]

const load = async () => {
  const res = await api.get('/admin/students')
  if (res.status === 200 && res.data?.data) {
    rows.value = res.data.data
  }
}

const onEdit = (row) => {
  editingStudentId.value = row.id
  editForm.value = {
    student_name: row.student_name || '',
    student_id: row.student_id || '',
    phone: row.phone || '',
    parent_phone: row.parent_phone || '',
    email: row.email || '',
    address: row.address || '',
    status: row.status || 'active',
  }
  showEdit.value = true
}

const submitEdit = async () => {
  try {
    saving.value = true
    const res = await api.put(`/admin/students/${editingStudentId.value}`, editForm.value)
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

onMounted(load)

function generateStudentId() {
  // simple placeholder: STU-YYYYMMDD-XXXX
  const d = new Date()
  const pad = (n) => n.toString().padStart(2, '0')
  const ymd = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `STU-${ymd}-${rand}`
}

const submitAdd = async () => {
  try {
    saving.value = true
    const payload = { ...form.value }
    if (!payload.student_id) payload.student_id = generateStudentId()
    const res = await api.post('/admin/students', payload)
    if (res.status === 201) {
      createdStudentId.value = res.data?.data?.student_id || payload.student_id
      successMessage.value = 'Student added successfully'
      showAdd.value = false
      showSuccess.value = true
      form.value = {
        student_name: '',
        student_id: '',
        phone: '',
        parent_phone: '',
        email: '',
        address: '',
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
</script>
