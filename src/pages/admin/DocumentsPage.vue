<template>
  <q-page class="q-pa-md">
    <div class="q-pa-md">
      <!-- Page Header -->
      <div class="row items-center q-mb-lg">
        <div class="col">
          <div class="text-h5 text-weight-bold text-grey-8">Manage Documents</div>
          <div class="text-subtitle2 text-grey-6 q-mt-xs">Upload, view, and manage all documents</div>
        </div>
        <div class="col-auto">
          <q-btn
            no-caps
            color="primary"
            icon="add"
            label="Upload Document"
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
                  <div class="text-overline text-grey-7">Total Documents</div>
                  <div class="text-h4 text-weight-bold text-primary q-mt-xs">
                    {{ rows.length }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="56px" color="blue-1" text-color="primary">
                    <q-icon name="description" size="32px" />
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
                  <div class="text-overline text-grey-7">Active Documents</div>
                  <div class="text-h4 text-weight-bold text-positive q-mt-xs">
                    {{ activeDocumentsCount }}
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
                  <div class="text-overline text-grey-7">Expired Documents</div>
                  <div class="text-h4 text-weight-bold text-warning q-mt-xs">
                    {{ expiredDocumentsCount }}
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
          <q-card flat bordered class="stat-card stat-card-purple">
            <q-card-section class="q-pa-md">
              <div class="row items-center">
                <div class="col">
                  <div class="text-overline text-grey-7">PDF Files</div>
                  <div class="text-h4 text-weight-bold text-purple q-mt-xs">
                    {{ pdfCount }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="56px" color="purple-1" text-color="purple">
                    <q-icon name="picture_as_pdf" size="32px" />
                  </q-avatar>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Documents Table -->
      <q-card flat bordered>
        <q-card-section class="q-pa-md">
          <q-table
            :rows="filteredRows"
            :columns="columns"
            row-key="id"
            flat
            bordered
            :loading="loading"
            :rows-per-page-options="[10, 20, 50, 100]"
            :pagination="{ rowsPerPage: 20 }"
            class="documents-table"
          >
            <template #top>
              <div class="row full-width items-center q-gutter-md">
                <div class="col-12 col-md-4">
                  <q-input
                    v-model="searchQuery"
                    dense
                    outlined
                    placeholder="Search documents..."
                    clearable
                    class="q-mb-sm"
                  >
                    <template #prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-2">
                  <q-select
                    v-model="filterStatus"
                    :options="statusFilterOptions"
                    label="Status"
                    dense
                    outlined
                    clearable
                    emit-value
                    map-options
                  />
                </div>
                <div class="col-12 col-md-2">
                  <q-select
                    v-model="filterFileType"
                    :options="fileTypeFilterOptions"
                    label="File Type"
                    dense
                    outlined
                    clearable
                    emit-value
                    map-options
                  />
                </div>
                <div class="col-12 col-md-2">
                  <q-select
                    v-model="filterClass"
                    :options="classFilterOptions"
                    label="Class"
                    dense
                    outlined
                    clearable
                    emit-value
                    map-options
                  />
                </div>
                <div class="col-12 col-md-2 text-right">
                  <q-btn
                    flat
                    dense
                    icon="refresh"
                    label="Refresh"
                    @click="loadDocuments"
                    :loading="loading"
                  />
                </div>
              </div>
            </template>

            <template #body-cell-file_type="props">
              <q-td :props="props">
                <q-chip
                  :color="props.value === 'pdf' ? 'red' : 'blue'"
                  text-color="white"
                  :icon="props.value === 'pdf' ? 'picture_as_pdf' : 'image'"
                  size="sm"
                >
                  {{ props.value?.toUpperCase() || 'N/A' }}
                </q-chip>
              </q-td>
            </template>

            <template #body-cell-status="props">
              <q-td :props="props">
                <q-chip
                  :color="getStatusColor(props.value)"
                  text-color="white"
                  :icon="getStatusIcon(props.value)"
                  size="sm"
                >
                  {{ props.value || 'active' }}
                </q-chip>
              </q-td>
            </template>

            <template #body-cell-expires_at="props">
              <q-td :props="props">
                <div class="column">
                  <div>{{ formatDate(props.value) }}</div>
                  <div class="text-caption text-grey-6">
                    {{ getExpirationStatus(props.value) }}
                  </div>
                </div>
              </q-td>
            </template>

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
                  <span v-if="!props.value || props.value.length === 0" class="text-grey-6">No classes</span>
                </div>
              </q-td>
            </template>

            <template #body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  dense
                  flat
                  round
                  icon="visibility"
                  color="primary"
                  class="q-mr-xs"
                  @click="onView(props.row)"
                  title="View Document"
                />
                <q-btn
                  dense
                  flat
                  round
                  icon="edit"
                  color="primary"
                  class="q-mr-xs"
                  @click="onEdit(props.row)"
                  title="Edit Document"
                />
                <q-btn
                  dense
                  flat
                  round
                  icon="delete"
                  color="negative"
                  @click="confirmDelete(props.row)"
                  title="Delete Document"
                />
              </q-td>
            </template>

            <template #no-data>
              <div class="full-width row flex-center text-grey-6 q-gutter-sm q-pa-lg">
                <q-icon name="description" size="2em" />
                <span>No documents found</span>
              </div>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>

    <!-- Upload Document Dialog -->
    <q-dialog v-model="showAdd" persistent>
      <q-card style="min-width: 600px; max-width: 800px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Upload Document</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pt-md">
          <q-form @submit.prevent="submitAdd">
            <div class="q-gutter-md">
              <q-input
                v-model="form.document_name"
                label="Document Name *"
                dense
                outlined
                :rules="[(v) => !!v || 'Document name is required']"
              />

              <q-file
                v-model="form.file"
                label="Select File (PDF or Image) *"
                accept=".pdf,.jpg,.jpeg,.png,.gif"
                outlined
                dense
                :rules="[
                  (v) => !!v || 'File is required',
                  (v) => !v || validateFileSize(v) || 'File size must be less than 50MB',
                  (v) => !v || validateFileType(v) || 'Only PDF and image files are allowed'
                ]"
                @update:model-value="onFileSelected"
              >
                <template #prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>

              <!-- File Preview -->
              <div v-if="filePreview" class="q-mt-sm">
                <div class="text-caption text-grey-7 q-mb-xs">File Preview:</div>
                <div class="row items-center q-gutter-sm">
                  <q-img
                    v-if="isImagePreview"
                    :src="filePreview"
                    style="max-width: 200px; max-height: 200px"
                    class="rounded-borders"
                  />
                  <div v-else class="column items-center q-pa-md bg-grey-2 rounded-borders">
                    <q-icon name="picture_as_pdf" size="48px" color="red" />
                    <div class="text-caption q-mt-xs">{{ form.file?.name }}</div>
                    <div class="text-caption text-grey-6">{{ formatFileSize(form.file?.size) }}</div>
                  </div>
                  <div class="col">
                    <div class="text-body2 text-weight-medium">{{ form.file?.name }}</div>
                    <div class="text-caption text-grey-6">{{ formatFileSize(form.file?.size) }}</div>
                  </div>
                </div>
              </div>

              <q-input
                v-model.number="form.views_per_student"
                label="Views Per Student *"
                dense
                outlined
                type="number"
                min="1"
                :rules="[(v) => (v > 0 && Number.isInteger(v)) || 'Must be a positive integer']"
                hint="Maximum number of times a student can view this document"
              />

              <q-input
                v-model="form.expires_at"
                label="Expiration Date *"
                dense
                outlined
                type="date"
                :min="minDate"
                :rules="[(v) => !!v || 'Expiration date is required']"
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
                use-chips
                :rules="[(v) => (Array.isArray(v) && v.length > 0) || 'Select at least one class']"
                hint="Select one or more classes"
              />
            </div>
            <div class="row justify-end q-mt-lg q-gutter-sm">
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
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Edit Document</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pt-md">
          <q-form @submit.prevent="submitEdit">
            <div class="q-gutter-md">
              <q-input
                v-model="editForm.document_name"
                label="Document Name *"
                dense
                outlined
                :rules="[(v) => !!v || 'Document name is required']"
              />

              <q-input
                v-model.number="editForm.views_per_student"
                label="Views Per Student *"
                dense
                outlined
                type="number"
                min="1"
                :rules="[(v) => (v > 0 && Number.isInteger(v)) || 'Must be a positive integer']"
              />

              <q-input
                v-model="editForm.expires_at"
                label="Expiration Date *"
                dense
                outlined
                type="date"
                :min="minDate"
                :rules="[(v) => !!v || 'Expiration date is required']"
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
                use-chips
                :rules="[(v) => (Array.isArray(v) && v.length > 0) || 'Select at least one class']"
              />
            </div>
            <div class="row justify-end q-mt-lg q-gutter-sm">
              <q-btn flat no-caps label="Cancel" v-close-popup />
              <q-btn color="primary" no-caps label="Update" type="submit" :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="showDeleteConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm text-h6">Confirm Delete</span>
        </q-card-section>

        <q-card-section>
          Are you sure you want to delete "<strong>{{ documentToDelete?.document_name }}</strong>"?
          <br />
          <span class="text-caption text-grey-6">This action cannot be undone.</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="onDelete" :loading="deleting" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Document Viewer Dialog -->
    <q-dialog v-model="showViewer" maximized @hide="closeViewer">
      <q-card class="bg-grey-1">
        <q-card-section class="row items-center q-pb-none bg-white">
          <div class="text-h6 text-weight-bold">{{ currentDocument?.document_name }}</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="closeViewer" />
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-none" style="height: calc(100vh - 60px)">
          <div
            v-if="viewerLoading"
            class="flex justify-center items-center"
            style="height: 100%"
          >
            <q-spinner color="primary" size="3em" />
          </div>
          <div
            v-else
            id="document-viewer"
            class="full-width full-height"
            style="position: relative; overflow: hidden"
          >
            <!-- PDF Viewer -->
            <div
              v-if="currentDocument?.file_type === 'pdf'"
              style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; overflow: auto"
            >
              <div v-if="pdfLoading" class="flex justify-center items-center" style="height: 100%">
                <q-spinner color="primary" size="3em" />
              </div>
              <div
                v-else
                id="pdf-container"
                ref="pdfContainer"
                style="width: 100%; height: 100%; overflow: auto; text-align: center; padding: 20px"
              >
                <!-- PDF pages will be rendered here -->
              </div>
            </div>
            <!-- Image Viewer -->
            <div
              v-else
              style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; overflow: auto"
            >
              <canvas
                ref="imageCanvas"
                style="max-width: 100%; max-height: 100%; object-fit: contain"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { api, apiFiles } from 'src/boot/axios'
import { showSuccessNotification, showErrorNotification } from 'src/utils/notification'
import * as pdfjsLib from 'pdfjs-dist'

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

const rows = ref([])
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const showAdd = ref(false)
const showEdit = ref(false)
const showViewer = ref(false)
const showDeleteConfirm = ref(false)
const viewerLoading = ref(false)
const currentDocument = ref(null)
const documentToDelete = ref(null)
const documentUrl = ref('')
const imageCanvas = ref(null)
const pdfLoading = ref(false)
const pdfPages = ref([])
const pdfCanvases = ref([])
const pdfContainer = ref(null)

// Search and filters
const searchQuery = ref('')
const filterStatus = ref(null)
const filterFileType = ref(null)
const filterClass = ref(null)

// File preview
const filePreview = ref(null)
const isImagePreview = ref(false)

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

const statusFilterOptions = [
  { label: 'All Status', value: null },
  ...statusOptions,
]

const fileTypeFilterOptions = [
  { label: 'All Types', value: null },
  { label: 'PDF', value: 'pdf' },
  { label: 'Image', value: 'image' },
]

const classOptions = ref([])
const classFilterOptions = computed(() => [
  { label: 'All Classes', value: null },
  ...classOptions.value,
])

const columns = [
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    align: 'left',
    sortable: true,
    style: 'width: 80px',
  },
  {
    name: 'document_name',
    label: 'Document Name',
    field: 'document_name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'file_type',
    label: 'Type',
    field: 'file_type',
    align: 'center',
    style: 'width: 100px',
  },
  {
    name: 'views_per_student',
    label: 'Views/Student',
    field: 'views_per_student',
    align: 'center',
    sortable: true,
    style: 'width: 120px',
  },
  {
    name: 'expires_at',
    label: 'Expires At',
    field: 'expires_at',
    align: 'left',
    sortable: true,
    style: 'width: 180px',
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'center',
    sortable: true,
    style: 'width: 120px',
  },
  {
    name: 'classes',
    label: 'Classes',
    field: 'classes',
    align: 'left',
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'center',
    style: 'width: 120px',
  },
]

// Computed properties
const minDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const activeDocumentsCount = computed(() => {
  return rows.value.filter((doc) => doc.status === 'active').length
})

const expiredDocumentsCount = computed(() => {
  return rows.value.filter((doc) => doc.status === 'expired').length
})

const pdfCount = computed(() => {
  return rows.value.filter((doc) => doc.file_type === 'pdf').length
})

const filteredRows = computed(() => {
  let filtered = rows.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (doc) =>
        doc.document_name?.toLowerCase().includes(query) ||
        doc.id?.toString().includes(query)
    )
  }

  // Status filter
  if (filterStatus.value) {
    filtered = filtered.filter((doc) => doc.status === filterStatus.value)
  }

  // File type filter
  if (filterFileType.value) {
    filtered = filtered.filter((doc) => doc.file_type === filterFileType.value)
  }

  // Class filter
  if (filterClass.value) {
    filtered = filtered.filter((doc) =>
      doc.classes?.some((cls) => cls.id === filterClass.value)
    )
  }

  return filtered
})

// Methods
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const getExpirationStatus = (dateString) => {
  if (!dateString) return ''
  const expiryDate = new Date(dateString)
  const today = new Date()
  const diffTime = expiryDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return 'Expired'
  } else if (diffDays <= 7) {
    return `Expires in ${diffDays} day${diffDays !== 1 ? 's' : ''}`
  } else {
    return ''
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'positive'
    case 'expired':
      return 'negative'
    case 'archived':
      return 'grey'
    default:
      return 'grey'
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'active':
      return 'check_circle'
    case 'expired':
      return 'block'
    case 'archived':
      return 'archive'
    default:
      return 'help'
  }
}

const validateFileSize = (file) => {
  if (!file) return true
  const maxSize = 50 * 1024 * 1024 // 50MB
  return file.size <= maxSize
}

const validateFileType = (file) => {
  if (!file) return true
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif']
  return allowedTypes.includes(file.type)
}

const onFileSelected = (file) => {
  if (!file) {
    filePreview.value = null
    isImagePreview.value = false
    return
  }

  if (file.type.startsWith('image/')) {
    isImagePreview.value = true
    const reader = new FileReader()
    reader.onload = (e) => {
      filePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  } else {
    isImagePreview.value = false
    filePreview.value = null
  }
}

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
  loading.value = true
  try {
    const response = await api.get('/admin/documents')
    if (response.data.code === 200) {
      rows.value = response.data.data
    }
  } catch (error) {
    showErrorNotification('Failed to load documents')
    console.error(error)
  } finally {
    loading.value = false
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

  if (!validateFileSize(form.value.file)) {
    showErrorNotification('File size must be less than 50MB')
    return
  }

  if (!validateFileType(form.value.file)) {
    showErrorNotification('Only PDF and image files are allowed')
    return
  }

  saving.value = true
  try {
    const formData = new FormData()
    formData.append('file', form.value.file)
    formData.append('document_name', form.value.document_name)
    formData.append('views_per_student', form.value.views_per_student)
    formData.append('expires_at', form.value.expires_at)
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
      filePreview.value = null
      isImagePreview.value = false
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

const confirmDelete = (row) => {
  documentToDelete.value = row
  showDeleteConfirm.value = true
}

const onDelete = async () => {
  if (!documentToDelete.value) return

  deleting.value = true
  try {
    const response = await api.delete(`/admin/documents/${documentToDelete.value.id}`)
    if (response.data.code === 200) {
      showSuccessNotification('Document deleted successfully')
      showDeleteConfirm.value = false
      documentToDelete.value = null
      await loadDocuments()
    } else {
      showErrorNotification(response.data.message || 'Failed to delete document')
    }
  } catch (error) {
    showErrorNotification(error.response?.data?.message || 'Failed to delete document')
    console.error(error)
  } finally {
    deleting.value = false
  }
}

// Admin view document - unlimited access
const onView = async (doc) => {
  currentDocument.value = doc
  viewerLoading.value = true
  showViewer.value = true

  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 100))

  try {
    // Check if document has file_url or file_path in the data
    console.log('Document data:', doc)

    // Try to get document details first to see if file URL is available
    let documentDetails = null
    try {
      const detailsResponse = await api.get(`/admin/documents/${doc.id}`)
      if (detailsResponse.data.code === 200) {
        documentDetails = detailsResponse.data.data
        console.log('Document details:', documentDetails)
        // Check if we can use file_url or file_path directly
        if (documentDetails.file_url || documentDetails.file_path) {
          // If file URL is available, we can fetch it directly
          const fileUrl = documentDetails.file_url || documentDetails.file_path
          if (fileUrl.startsWith('http')) {
            // External URL
            const fileResponse = await fetch(fileUrl)
            const blob = await fileResponse.blob()
            await processDocumentBlob(blob, doc)
            return
          }
        }
      }
    } catch (error) {
      console.warn('Could not fetch document details:', error)
    }

    // Try admin view endpoint first
    let response
    let blob
    try {
      response = await api.get(`/admin/documents/${doc.id}/view`, { responseType: 'blob' })
      blob = response.data
    } catch (error) {
      // If admin endpoint doesn't exist (404), try student endpoint
      if (error.response?.status === 404) {
        console.warn('Admin view endpoint not available, trying student endpoint...')
        try {
          response = await api.get(`/common/student/documents/${doc.id}/view`, {
            responseType: 'blob',
          })
          blob = response.data
        } catch (studentError) {
          // If student endpoint blocks admin (403), show helpful error
          if (studentError.response?.status === 403) {
            showErrorNotification(
              'Admin access to view documents is not configured. Please contact the backend developer to add an admin view endpoint or allow admin access to the student endpoint.'
            )
            showViewer.value = false
            viewerLoading.value = false
            return
          }
          throw studentError
        }
      } else {
        throw error
      }
    }

    if (!(blob instanceof Blob)) {
      throw new Error('Invalid response format')
    }

    await processDocumentBlob(blob, doc)
  } catch (error) {
    showViewer.value = false
    viewerLoading.value = false
    showErrorNotification('Failed to load document')
    console.error(error)
  }
}

const processDocumentBlob = async (blob, doc) => {
  try {
    const blobUrl = URL.createObjectURL(blob)

    if (doc.file_type !== 'pdf') {
      // For images
      viewerLoading.value = false
      await nextTick()
      await new Promise((resolve) => setTimeout(resolve, 150))

      const waitForCanvas = async (maxAttempts = 20) => {
        for (let i = 0; i < maxAttempts; i++) {
          await nextTick()
          await new Promise((resolve) => setTimeout(resolve, 50))
          if (imageCanvas.value && document.contains(imageCanvas.value)) {
            return true
          }
          const canvasInDom = document.querySelector('#document-viewer canvas')
          if (canvasInDom) {
            imageCanvas.value = canvasInDom
            return true
          }
        }
        return false
      }

      const canvasAvailable = await waitForCanvas()
      if (!canvasAvailable || !imageCanvas.value) {
        const canvasElement = document.querySelector('#document-viewer canvas')
        if (canvasElement) {
          imageCanvas.value = canvasElement
        } else {
          documentUrl.value = blobUrl
          viewerLoading.value = false
          return
        }
      }

      try {
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target.result)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
        await addWatermarkToImage(dataUrl)
      } catch (error) {
        console.error('Error adding watermark:', error)
        try {
          await addWatermarkToImage(blobUrl)
        } catch (blobError) {
          console.error('Both data URL and blob URL failed:', blobError)
          documentUrl.value = blobUrl
        }
      }
    } else {
      // For PDFs
      viewerLoading.value = false
      pdfLoading.value = false
      await nextTick()
      await new Promise((resolve) => setTimeout(resolve, 200))

      try {
        await renderPdfWithWatermark(blobUrl)
      } catch (error) {
        console.error('Error rendering PDF:', error)
        documentUrl.value = blobUrl
      }
    }
  } catch (error) {
    console.error('Error processing document blob:', error)
    throw error
  }
}

const renderPdfWithWatermark = async (pdfUrl) => {
  try {
    const loadingTask = pdfjsLib.getDocument({ url: pdfUrl })
    const pdf = await loadingTask.promise

    pdfPages.value = []
    pdfCanvases.value = []

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale: 1.5 })

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      canvas.height = viewport.height
      canvas.width = viewport.width
      canvas.style.maxWidth = '100%'
      canvas.style.width = viewport.width + 'px'
      canvas.style.height = 'auto'
      canvas.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
      canvas.style.display = 'block'
      canvas.style.margin = '0 auto 20px auto'

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
      }

      await page.render(renderContext).promise

      // No watermark for admin - render PDF as-is
      pdfPages.value.push({
        pageNum,
        canvas,
        width: viewport.width,
        height: viewport.height,
      })
    }

    await nextTick()

    let attempts = 0
    while (!pdfContainer.value && attempts < 20) {
      await new Promise((resolve) => setTimeout(resolve, 50))
      await nextTick()
      const containerInDom = document.querySelector('#pdf-container')
      if (containerInDom) {
        pdfContainer.value = containerInDom
        break
      }
      attempts++
    }

    if (pdfContainer.value) {
      pdfContainer.value.innerHTML = ''
      pdfPages.value.forEach((page) => {
        pdfContainer.value.appendChild(page.canvas)
      })
    } else {
      const containerInDom = document.querySelector('#pdf-container')
      if (containerInDom) {
        containerInDom.innerHTML = ''
        pdfPages.value.forEach((page) => {
          containerInDom.appendChild(page.canvas)
        })
      } else {
        throw new Error('PDF container element not found in DOM')
      }
    }
  } catch (error) {
    console.error('Error rendering PDF:', error)
    throw error
  }
}

const addWatermarkToImage = async (imageUrl) => {
  return new Promise((resolve, reject) => {
    if (!imageCanvas.value) {
      reject(new Error('Canvas not available'))
      return
    }

    const img = new Image()

    img.onload = () => {
      try {
        if (!img.width || !img.height || img.naturalWidth === 0 || img.naturalHeight === 0) {
          reject(new Error('Image has invalid dimensions'))
          return
        }

        const canvas = imageCanvas.value
        if (!canvas) {
          reject(new Error('Canvas element not found'))
          return
        }

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }

        const maxWidth = window.innerWidth * 0.9
        const maxHeight = window.innerHeight * 0.8
        let canvasWidth = img.naturalWidth || img.width
        let canvasHeight = img.naturalHeight || img.height

        if (canvasWidth > maxWidth || canvasHeight > maxHeight) {
          const scale = Math.min(maxWidth / canvasWidth, maxHeight / canvasHeight)
          canvasWidth = canvasWidth * scale
          canvasHeight = canvasHeight * scale
        }

        canvas.width = canvasWidth
        canvas.height = canvasHeight
        canvas.style.width = canvasWidth + 'px'
        canvas.style.height = canvasHeight + 'px'

        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight)

        // No watermark for admin - render image as-is
        resolve()
      } catch (error) {
        console.error('Error in onload handler:', error)
        reject(error)
      }
    }

    img.onerror = (error) => {
      console.error('Image load error:', error)
      reject(new Error('Failed to load image from blob URL'))
    }

    img.src = imageUrl
  })
}

const closeViewer = () => {
  if (documentUrl.value) {
    URL.revokeObjectURL(documentUrl.value)
    documentUrl.value = ''
  }
  if (pdfContainer.value) {
    pdfContainer.value.innerHTML = ''
  }
  pdfPages.value = []
  pdfCanvases.value = []
  showViewer.value = false
  currentDocument.value = null
}
</script>

<style scoped>
.stat-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-card-blue {
  border-left: 4px solid #1976d2;
}

.stat-card-green {
  border-left: 4px solid #4caf50;
}

.stat-card-orange {
  border-left: 4px solid #ff9800;
}

.stat-card-purple {
  border-left: 4px solid #9c27b0;
}
</style>
