<template>
  <q-page class="p-6">
    <div class="flex justify-between items-center mb-4">
      <div class="text-xl font-semibold">Manage Classes</div>
      <q-btn no-caps color="primary" icon="add" label="Add Class" @click="showAdd = true" />
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

    <!-- Add Class Dialog -->
    <q-dialog v-model="showAdd" persistent>
      <q-card style="min-width: 520px">
        <q-card-section class="text-lg font-semibold">Add Class</q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit.prevent="submitAdd">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <q-input
                v-model="form.class_name"
                label="Class Name"
                dense
                outlined
                :rules="[(v) => !!v || 'Required']"
              />
              <q-input v-model="form.class_code" label="Class Code" dense outlined />
              <q-input v-model="form.teacher_name" label="Teacher Name" dense outlined />
              <q-input
                v-model.number="form.class_fee"
                label="Class Fee"
                dense
                outlined
                type="number"
                step="0.01"
              />
              <q-input
                v-model.number="form.max_capacity"
                label="Max Capacity"
                dense
                outlined
                type="number"
              />
              <q-input
                v-model="form.description"
                label="Description"
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

    <!-- Edit Class Dialog -->
    <q-dialog v-model="showEdit" persistent>
      <q-card style="min-width: 520px">
        <q-card-section class="text-lg font-semibold">Edit Class</q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit.prevent="submitEdit">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <q-input
                v-model="editForm.class_name"
                label="Class Name"
                dense
                outlined
                :rules="[(v) => !!v || 'Required']"
              />
              <q-input v-model="editForm.class_code" label="Class Code" dense outlined />
              <q-input v-model="editForm.teacher_name" label="Teacher Name" dense outlined />
              <q-input
                v-model.number="editForm.class_fee"
                label="Class Fee"
                dense
                outlined
                type="number"
                step="0.01"
              />
              <q-input
                v-model.number="editForm.max_capacity"
                label="Max Capacity"
                dense
                outlined
                type="number"
              />
              <q-select
                v-model="editForm.status"
                label="Status"
                dense
                outlined
                :options="statusOptions"
              />
              <q-input
                v-model="editForm.description"
                label="Description"
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
import { onMounted, ref } from 'vue'
import { api } from 'src/boot/axios'

const rows = ref([])
const showAdd = ref(false)
const showEdit = ref(false)
const showSuccess = ref(false)
const successMessage = ref('')
const saving = ref(false)
const editingClassId = ref(null)
const form = ref({
  class_name: '',
  class_code: '',
  teacher_name: '',
  class_fee: 0,
  max_capacity: null,
  description: '',
})
const editForm = ref({
  class_name: '',
  class_code: '',
  teacher_name: '',
  class_fee: 0,
  max_capacity: null,
  description: '',
  status: 'active',
})
const statusOptions = ['active', 'inactive']
const columns = [
  { name: 'class_name', label: 'Class Name', field: 'class_name', align: 'left', sortable: true },
  { name: 'class_code', label: 'Code', field: 'class_code', align: 'left' },
  { name: 'teacher_name', label: 'Teacher', field: 'teacher_name', align: 'left' },
  {
    name: 'class_fee',
    label: 'Fee',
    field: 'class_fee',
    align: 'left',
    format: (val) => (val ? `Rs ${val}` : '-'),
  },
  { name: 'max_capacity', label: 'Capacity', field: 'max_capacity', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'createdAt', label: 'Created', field: 'createdAt', align: 'left', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' },
]

const load = async () => {
  const res = await api.get('/admin/classes')
  if (res.status === 200 && res.data?.data) {
    rows.value = res.data.data
  }
}

const onEdit = (row) => {
  editingClassId.value = row.id
  editForm.value = {
    class_name: row.class_name || '',
    class_code: row.class_code || '',
    teacher_name: row.teacher_name || '',
    class_fee: row.class_fee || 0,
    max_capacity: row.max_capacity || null,
    description: row.description || '',
    status: row.status || 'active',
  }
  showEdit.value = true
}

const submitAdd = async () => {
  try {
    saving.value = true
    const res = await api.post('/admin/classes', form.value)
    if (res.status === 201) {
      successMessage.value = 'Class added successfully'
      showAdd.value = false
      showSuccess.value = true
      form.value = {
        class_name: '',
        class_code: '',
        teacher_name: '',
        class_fee: 0,
        max_capacity: null,
        description: '',
      }
      await load()
    }
  } finally {
    saving.value = false
  }
}

const submitEdit = async () => {
  try {
    saving.value = true
    const res = await api.put(`/admin/classes/${editingClassId.value}`, editForm.value)
    if (res.status === 200) {
      showEdit.value = false
      successMessage.value = 'Class updated successfully'
      showSuccess.value = true
      await load()
    }
  } finally {
    saving.value = false
  }
}

const onDelete = async (row) => {
  await api.delete(`/admin/classes/${row.id}`)
  await load()
}

const closeSuccess = () => {
  showSuccess.value = false
  successMessage.value = ''
}

onMounted(load)
</script>
