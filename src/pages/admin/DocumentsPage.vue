<template>
  <q-page class="p-6">
    <div class="flex justify-between items-center mb-4">
      <div class="text-xl font-semibold">Manage Documents</div>
      <q-btn no-caps color="primary" icon="add" label="Upload Document" @click="showAdd = true" />
    </div>

    <q-table :rows="rows" :columns="columns" row-key="id" flat bordered>
      <template #body-cell-file_type="props">
        <q-td :props="props">
          <q-badge :color="props.value === 'pdf' ? 'red' : 'blue'" :label="props.value.toUpperCase()" />
        </q-td>
      </template>
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge
            :color="props.value === 'active' ? 'positive' : props.value === 'expired' ? 'negative' : 'grey'"
            :label="props.value"
          />
        </q-td>
      </template>
      <template #body-cell-classes="props">
        <q-td :props="props">
          <div class="flex flex-wrap gap-1">
            <q-badge
              v-for="cls in props.value"
              :key="cls.id"
              color="primary"
              :label="cls.class_name"
              class="text-xs"
            />
          </div>
        </q-td>
      </template>
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn dense flat round icon="edit" color="primary" class="mr-1" @click="onEdit(props.row)" />
          <q-btn dense flat round icon="delete" color="negative" @click="onDelete(props.row)" />
        </q-td>
      </template>
    </q-table>

    <!-- Upload Document Dialog -->
    <q-dialog v-model="showAdd" persistent>
      <q-card style="min-width: 600px; max-width: 800px">
        <q-card-section class="text-lg font-semibold">Upload Document</q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit.prevent="submitAdd">
            <div class="space-y-4">
              <q-input
                v-model="form.document_name"
                label="Document Name *"
                dense
                outlined
                :rules="[(v) => !!v || 'Required']"
              />

              <q-file
                v-model="form.file"
                label="Select File (PDF or Image) *"
                accept=".pdf,.jpg,.jpeg,.png,.gif"
                outlined
                dense
                :rules="[(v) => !!v || 'File is required']"
              >
                <template #prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>

              <q-input
                v-model.number="form.views_per_student"
                label="Views Per Student *"
                dense
                outlined
                type="number"
                min="1"
                :rules="[(v) => v > 0 || 'Must be at least 1']"
                hint="Maximum number of times a student can view this document"
              />

              <q-input
                v-model="form.expires_at"
                label="Expiration Date *"
                dense
                outlined
                type="date"
                :rules="[(v) => !!v || 'Required']"
                hint="Default: 2 weeks from today"
              />

              <q-select
                v-model="form.class_ids"
                label="Assign to Classes *"
                dense
                outlined
                multiple
                :options="classOptions"
                option-label="label"
                option-value="value"
                emit-value
                map-options
                lazy-rules
                :rules="[(v) => (Array.isArray(v) && v.length > 0) || 'Select at least one class']"
                hint="Select one or more classes"
              />
            </div>
            <div class="flex justify-end gap-2 mt-4">
              <q-btn flat no-caps label="Cancel" v-close-popup />
              <q-btn color="primary" no-caps label="Upload" type="submit" :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Edit Document Dialog -->
    <q-dialog v-model="showEdit" persistent>
      <q-card style="min-width: 600px; max-width: 800px">
        <q-card-section class="text-lg font-semibold">Edit Document</q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit.prevent="submitEdit">
            <div class="space-y-4">
              <q-input
                v-model="editForm.document_name"
                label="Document Name *"
                dense
                outlined
                :rules="[(v) => !!v || 'Required']"
              />

              <q-input
                v-model.number="editForm.views_per_student"
                label="Views Per Student *"
                dense
                outlined
                type="number"
                min="1"
                :rules="[(v) => v > 0 || 'Must be at least 1']"
              />

              <q-input
                v-model="editForm.expires_at"
                label="Expiration Date *"
                dense
                outlined
                type="date"
                :rules="[(v) => !!v || 'Required']"
              />

              <q-select
                v-model="editForm.status"
                label="Status"
                dense
                outlined
                :options="statusOptions"
                emit-value
                map-options
              />

              <q-select
                v-model="editForm.class_ids"
                label="Assign to Classes *"
                dense
                outlined
                multiple
                :options="classOptions"
                option-label="label"
                option-value="value"
                emit-value
                map-options
                lazy-rules
                :rules="[(v) => (Array.isArray(v) && v.length > 0) || 'Select at least one class']"
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
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api, apiFiles } from 'src/boot/axios'
import { showSuccessNotification, showErrorNotification } from 'src/utils/notification'

const rows = ref([])
const saving = ref(false)
const showAdd = ref(false)
const showEdit = ref(false)

const form = ref({
  document_name: '',
  file: null,
  views_per_student: 1,
  expires_at: '',
  class_ids: [],
})

const editForm = ref({
  id: null,
  document_name: '',
  views_per_student: 1,
  expires_at: '',
  status: 'active',
  class_ids: [],
})

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Expired', value: 'expired' },
  { label: 'Archived', value: 'archived' },
]

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'document_name', label: 'Document Name', field: 'document_name', align: 'left', sortable: true },
  { name: 'file_type', label: 'Type', field: 'file_type', align: 'left' },
  { name: 'views_per_student', label: 'Views/Student', field: 'views_per_student', align: 'center' },
  { name: 'expires_at', label: 'Expires At', field: 'expires_at', align: 'left', format: (val) => new Date(val).toLocaleDateString() },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'classes', label: 'Classes', field: 'classes', align: 'left' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' },
]

const classOptions = ref([])

onMounted(async () => {
  await loadDocuments()
  await loadClasses()
  // Set default expiration date (2 weeks from today)
  const defaultDate = new Date()
  defaultDate.setDate(defaultDate.getDate() + 14)
  form.value.expires_at = defaultDate.toISOString().split('T')[0]
})

const loadClasses = async () => {
  try {
    const response = await api.get('/admin/classes')
    if (response.data.code === 200) {
      classOptions.value = response.data.data
        .filter((c) => c.status === 'active')
        .map((cls) => ({
          label: cls.class_name,
          value: cls.id,
        }))
    }
  } catch (error) {
    console.error('Failed to load classes:', error)
  }
}

const loadDocuments = async () => {
  try {
    const response = await api.get('/admin/documents')
    if (response.data.code === 200) {
      rows.value = response.data.data
    }
  } catch (error) {
    showErrorNotification('Failed to load documents')
    console.error(error)
  }
}

const submitAdd = async () => {
  if (!form.value.file) {
    showErrorNotification('Please select a file')
    return
  }

  if (!form.value.class_ids || form.value.class_ids.length === 0) {
    showErrorNotification('Please select at least one class')
    return
  }

  saving.value = true
  try {
    const formData = new FormData()
    formData.append('file', form.value.file)
    formData.append('document_name', form.value.document_name)
    formData.append('views_per_student', form.value.views_per_student)
    formData.append('expires_at', form.value.expires_at)
    // Send class_ids as JSON string to ensure proper parsing
    formData.append('class_ids', JSON.stringify(form.value.class_ids))

    const response = await apiFiles.post('/admin/documents', formData)
    if (response.data.code === 201) {
      showSuccessNotification('Document uploaded successfully')
      showAdd.value = false
      form.value = {
        document_name: '',
        file: null,
        views_per_student: 1,
        expires_at: '',
        class_ids: [],
      }
      // Reset expiration date
      const defaultDate = new Date()
      defaultDate.setDate(defaultDate.getDate() + 14)
      form.value.expires_at = defaultDate.toISOString().split('T')[0]
      await loadDocuments()
    } else {
      showErrorNotification(response.data.message || 'Failed to upload document')
    }
  } catch (error) {
    showErrorNotification(error.response?.data?.message || 'Failed to upload document')
    console.error(error)
  } finally {
    saving.value = false
  }
}

const onEdit = (row) => {
  editForm.value = {
    id: row.id,
    document_name: row.document_name,
    views_per_student: row.views_per_student,
    expires_at: new Date(row.expires_at).toISOString().split('T')[0],
    status: row.status,
    class_ids: row.classes ? row.classes.map((c) => c.id || c.value) : [],
  }
  showEdit.value = true
}

const submitEdit = async () => {
  saving.value = true
  try {
    const response = await api.put(`/admin/documents/${editForm.value.id}`, {
      document_name: editForm.value.document_name,
      views_per_student: editForm.value.views_per_student,
      expires_at: editForm.value.expires_at,
      status: editForm.value.status,
      class_ids: editForm.value.class_ids,
    })
    if (response.data.code === 200) {
      showSuccessNotification('Document updated successfully')
      showEdit.value = false
      await loadDocuments()
    } else {
      showErrorNotification(response.data.message || 'Failed to update document')
    }
  } catch (error) {
    showErrorNotification(error.response?.data?.message || 'Failed to update document')
    console.error(error)
  } finally {
    saving.value = false
  }
}

const onDelete = async (row) => {
  if (confirm(`Are you sure you want to delete "${row.document_name}"?`)) {
    try {
      const response = await api.delete(`/admin/documents/${row.id}`)
      if (response.data.code === 200) {
        showSuccessNotification('Document deleted successfully')
        await loadDocuments()
      } else {
        showErrorNotification(response.data.message || 'Failed to delete document')
      }
    } catch (error) {
      showErrorNotification(error.response?.data?.message || 'Failed to delete document')
      console.error(error)
    }
  }
}
</script>

