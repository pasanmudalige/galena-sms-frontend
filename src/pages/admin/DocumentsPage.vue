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
          <q-btn dense flat round icon="visibility" color="primary" class="mr-1" @click="onView(props.row)" />
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

    <!-- Document Viewer Dialog -->
    <q-dialog v-model="showViewer" maximized @hide="closeViewer">
      <q-card class="bg-grey-1">
        <q-card-section class="row items-center q-pb-none bg-white">
          <div class="text-h6">{{ currentDocument?.document_name }}</div>
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
            <!-- PDF Viewer with Canvas Watermark -->
            <div v-if="currentDocument?.file_type === 'pdf'" style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; overflow: auto">
              <div v-if="pdfLoading" class="flex justify-center items-center" style="height: 100%">
                <q-spinner color="primary" size="3em" />
              </div>
              <div v-else id="pdf-container" ref="pdfContainer" style="width: 100%; height: 100%; overflow: auto; text-align: center; padding: 20px">
                <!-- PDF pages will be rendered here -->
              </div>
            </div>
            <!-- Image Viewer with Canvas Watermark -->
            <div v-else style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; overflow: auto">
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
import { ref, onMounted, nextTick } from 'vue'
import { api, apiFiles } from 'src/boot/axios'
import { showSuccessNotification, showErrorNotification } from 'src/utils/notification'
import * as pdfjsLib from 'pdfjs-dist'

// Configure PDF.js worker - use local file from public folder
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

const rows = ref([])
const saving = ref(false)
const showAdd = ref(false)
const showEdit = ref(false)
const showViewer = ref(false)
const viewerLoading = ref(false)
const currentDocument = ref(null)
const documentUrl = ref('')
const imageCanvas = ref(null)
const pdfLoading = ref(false)
const pdfPages = ref([])
const pdfCanvases = ref([])
const pdfContainer = ref(null)

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

// Admin view document - unlimited access
const onView = async (doc) => {
  currentDocument.value = doc
  viewerLoading.value = true
  showViewer.value = true
  
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 100))

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
          response = await api.get(`/common/student/documents/${doc.id}/view`, { responseType: 'blob' })
          blob = response.data
        } catch (studentError) {
          // If student endpoint blocks admin (403), show helpful error
          if (studentError.response?.status === 403) {
            showErrorNotification('Admin access to view documents is not configured. Please contact the backend developer to add an admin view endpoint or allow admin access to the student endpoint.')
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
      await new Promise(resolve => setTimeout(resolve, 150))
      
      const waitForCanvas = async (maxAttempts = 20) => {
        for (let i = 0; i < maxAttempts; i++) {
          await nextTick()
          await new Promise(resolve => setTimeout(resolve, 50))
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
      await new Promise(resolve => setTimeout(resolve, 200))
      
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
        viewport: viewport
      }
      
      await page.render(renderContext).promise
      
      // No watermark for admin - render PDF as-is
      pdfPages.value.push({ pageNum, canvas, width: viewport.width, height: viewport.height })
    }
    
    await nextTick()
    
    let attempts = 0
    while (!pdfContainer.value && attempts < 20) {
      await new Promise(resolve => setTimeout(resolve, 50))
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

