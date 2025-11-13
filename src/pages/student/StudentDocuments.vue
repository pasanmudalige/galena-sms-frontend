<template>
  <q-page class="q-pa-md">
    <div class="q-pa-md">
      <!-- Page Header -->
      <div class="row items-center q-mb-lg">
        <div class="col">
          <div class="text-h4 text-weight-bold text-grey-8">My Documents</div>
          <div class="text-subtitle2 text-grey-6">View and manage your uploaded documents</div>
        </div>
        <div class="col-auto">
          <q-btn
            color="primary"
            icon="refresh"
            label="Refresh"
            flat
            @click="loadDocuments"
            :loading="loading"
          />
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="row q-col-gutter-md q-mb-md" v-if="!loading && rows.length > 0">
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
                    <q-icon name="folder" size="32px" />
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
                  <div class="text-overline text-grey-7">Available Views</div>
                  <div class="text-h4 text-weight-bold text-positive q-mt-xs">
                    {{ totalAvailableViews }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="56px" color="green-1" text-color="positive">
                    <q-icon name="visibility" size="32px" />
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
                  <div class="text-overline text-grey-7">PDF Documents</div>
                  <div class="text-h4 text-weight-bold text-warning q-mt-xs">
                    {{ pdfCount }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="56px" color="orange-1" text-color="warning">
                    <q-icon name="picture_as_pdf" size="32px" />
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
                  <div class="text-overline text-grey-7">Image Documents</div>
                  <div class="text-h4 text-weight-bold text-purple q-mt-xs">
                    {{ imageCount }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="56px" color="purple-1" text-color="purple">
                    <q-icon name="image" size="32px" />
                  </q-avatar>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-center" style="min-height: 400px">
        <q-spinner color="primary" size="3em" />
      </div>

      <!-- Empty State -->
      <q-card v-else-if="rows.length === 0" flat bordered>
        <q-card-section class="q-pa-xl text-center">
          <q-icon name="folder_open" size="64px" color="grey-4" class="q-mb-md" />
          <div class="text-h6 text-grey-7 q-mb-sm">No Documents Available</div>
          <div class="text-body2 text-grey-6">You don't have any documents uploaded yet.</div>
        </q-card-section>
      </q-card>

      <!-- Documents Grid -->
      <div v-else class="row q-col-gutter-md">
        <div v-for="doc in rows" :key="doc.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
          <q-card
            flat
            bordered
            class="document-card cursor-pointer"
            :class="{ 'document-disabled': doc.views_remaining === 0 }"
            @click="viewDocument(doc)"
          >
            <q-card-section class="q-pa-md">
              <!-- Document Type Icon -->
              <div class="row items-center q-mb-sm">
                <q-avatar
                  :color="doc.file_type === 'pdf' ? 'red-1' : 'blue-1'"
                  :text-color="doc.file_type === 'pdf' ? 'red' : 'blue'"
                  size="48px"
                  class="q-mr-sm"
                >
                  <q-icon
                    :name="doc.file_type === 'pdf' ? 'picture_as_pdf' : 'image'"
                    size="28px"
                  />
                </q-avatar>
                <div class="col">
                  <q-badge
                    :color="doc.file_type === 'pdf' ? 'red' : 'blue'"
                    :label="doc.file_type.toUpperCase()"
                    class="q-mb-xs"
                  />
                  <div
                    v-if="doc.views_remaining === 0"
                    class="text-caption text-negative text-weight-bold"
                  >
                    View Limit Reached
                  </div>
                </div>
              </div>

              <!-- Document Name -->
              <div class="text-weight-medium text-grey-9 q-mb-md" style="min-height: 40px">
                {{ doc.document_name }}
              </div>

              <!-- Document Info -->
              <div class="q-gutter-xs q-mb-md">
                <div class="row items-center text-caption text-grey-7">
                  <q-icon name="visibility" size="14px" class="q-mr-xs" />
                  <span>Views: {{ doc.view_count }} / {{ doc.views_per_student }}</span>
                </div>
                <div class="row items-center text-caption text-grey-7">
                  <q-icon name="schedule" size="14px" class="q-mr-xs" />
                  <span>Remaining: {{ doc.views_remaining }}</span>
                </div>
                <div class="row items-center text-caption text-grey-7">
                  <q-icon name="event" size="14px" class="q-mr-xs" />
                  <span>Expires: {{ formatDate(doc.expires_at) }}</span>
                </div>
              </div>

              <!-- Classes Tags -->
              <div v-if="doc.classes && doc.classes.length > 0" class="q-mb-md">
                <div class="text-caption text-grey-7 q-mb-xs">Associated Classes:</div>
                <div class="q-gutter-xs">
                  <q-chip
                    v-for="cls in doc.classes.slice(0, 2)"
                    :key="cls.id"
                    size="sm"
                    color="primary"
                    text-color="white"
                    dense
                  >
                    {{ cls.class_name }}
                  </q-chip>
                  <q-chip
                    v-if="doc.classes.length > 2"
                    size="sm"
                    color="grey-5"
                    text-color="white"
                    dense
                  >
                    +{{ doc.classes.length - 2 }} more
                  </q-chip>
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-actions class="q-pa-md">
              <q-btn
                flat
                no-caps
                :color="doc.views_remaining > 0 ? 'primary' : 'grey'"
                :icon="doc.views_remaining > 0 ? 'visibility' : 'block'"
                :label="doc.views_remaining > 0 ? 'View Document' : 'Limit Reached'"
                :disable="doc.views_remaining === 0"
                class="full-width"
                @click.stop="viewDocument(doc)"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>

      <!-- Document Viewer Dialog -->
      <q-dialog v-model="showViewer" maximized @hide="closeViewer">
        <q-card class="bg-grey-1">
          <q-card-section class="row items-center q-pb-none bg-white">
            <div class="col">
              <div class="text-h6 text-weight-bold">{{ currentDocument?.document_name }}</div>
              <div class="text-caption text-grey-6">
                {{ currentDocument?.file_type?.toUpperCase() }} Document
              </div>
            </div>
            <q-space />
            <q-btn icon="close" flat round dense @click="closeViewer" />
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-none" style="height: calc(100vh - 60px)">
            <div v-if="viewerLoading" class="flex justify-center items-center" style="height: 100%">
              <q-spinner color="primary" size="3em" />
            </div>
            <div
              v-else
              id="document-viewer"
              class="full-width full-height"
              style="position: relative; overflow: hidden"
            >
              <!-- PDF Viewer with Canvas Watermark -->
              <div
                v-if="currentDocument?.file_type === 'pdf'"
                style="
                  position: relative;
                  width: 100%;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  overflow: auto;
                "
              >
                <div
                  v-if="pdfLoading"
                  class="flex justify-center items-center"
                  style="height: 100%"
                >
                  <q-spinner color="primary" size="3em" />
                </div>
                <div
                  v-else
                  id="pdf-container"
                  ref="pdfContainer"
                  style="
                    width: 100%;
                    height: 100%;
                    overflow: auto;
                    text-align: center;
                    padding: 20px;
                  "
                >
                  <!-- PDF pages will be rendered here -->
                </div>
              </div>
              <!-- Image Viewer with Canvas Watermark -->
              <div
                v-else
                style="
                  position: relative;
                  width: 100%;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  overflow: auto;
                "
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
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { api } from 'src/boot/axios'
import { showErrorNotification } from 'src/utils/notification'
import { useAuthStore } from 'src/stores/auth-store'
import * as pdfjsLib from 'pdfjs-dist'

// Configure PDF.js worker - use local file from public folder
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

const rows = ref([])
const loading = ref(true)
const showViewer = ref(false)
const viewerLoading = ref(false)
const currentDocument = ref(null)
const documentUrl = ref('')
const imageCanvas = ref(null)
const studentData = ref(null)
const authStore = useAuthStore()
const authUser = ref(null)
const pdfLoading = ref(false)
const pdfPages = ref([])
const pdfCanvases = ref([])
const pdfContainer = ref(null)

// Computed properties for summary cards
const totalAvailableViews = computed(() => {
  return rows.value.reduce((sum, doc) => sum + (doc.views_remaining || 0), 0)
})

const pdfCount = computed(() => {
  return rows.value.filter((doc) => doc.file_type === 'pdf').length
})

const imageCount = computed(() => {
  return rows.value.filter((doc) => doc.file_type === 'image').length
})

// Computed watermark text
const watermarkText = computed(() => {
  if (!studentData.value) return ''
  const date = new Date().toLocaleString()
  const email = studentData.value.email || studentData.value.student_id
  return `Confidential – viewed by ${email} on ${date}`
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (e) {
    console.log(e)
    return dateString
  }
}

const loadStudentData = async () => {
  try {
    const res = await authStore.getAuthUserDataUsingAccessToken()
    if (res.status === 200 && res.data?.data) {
      authUser.value = res.data.data
      // Get student data
      const studentsRes = await api.get('/admin/students')
      if (studentsRes.status === 200 && studentsRes.data?.data) {
        const student = studentsRes.data.data.find((s) => s.email === authUser.value?.email)
        if (student) {
          studentData.value = student
        }
      }
    }
  } catch (error) {
    console.error('Error loading student data:', error)
  }
}

onMounted(async () => {
  await loadStudentData()
  await loadDocuments()
  // Add security measures
  addSecurityMeasures()
})

onUnmounted(() => {
  removeSecurityMeasures()
})

const addSecurityMeasures = () => {
  // Disable right-click
  document.addEventListener('contextmenu', preventDefault)
  // Disable text selection
  document.addEventListener('selectstart', preventDefault)
  // Disable drag
  document.addEventListener('dragstart', preventDefault)
  // Disable print screen (F12, Ctrl+P, etc.)
  document.addEventListener('keydown', preventKeys)
  // Disable developer tools shortcuts
  document.addEventListener('keydown', preventDevTools)
}

const removeSecurityMeasures = () => {
  document.removeEventListener('contextmenu', preventDefault)
  document.removeEventListener('selectstart', preventDefault)
  document.removeEventListener('dragstart', preventDefault)
  document.removeEventListener('keydown', preventKeys)
  document.removeEventListener('keydown', preventDevTools)
}

const preventDefault = (e) => {
  if (showViewer.value) {
    e.preventDefault()
    return false
  }
}

const preventKeys = (e) => {
  if (!showViewer.value) return
  // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S, Ctrl+P
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
    (e.ctrlKey && (e.key === 'u' || e.key === 's' || e.key === 'p'))
  ) {
    e.preventDefault()
    return false
  }
}

const preventDevTools = (e) => {
  if (!showViewer.value) return
  // Disable Ctrl+Shift+C (inspect element)
  if (e.ctrlKey && e.shiftKey && e.key === 'C') {
    e.preventDefault()
    return false
  }
}

const loadDocuments = async () => {
  loading.value = true
  try {
    const response = await api.get('/common/student/documents')
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

const renderPdfWithWatermark = async (pdfUrl) => {
  try {
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ url: pdfUrl })
    const pdf = await loadingTask.promise

    pdfPages.value = []
    pdfCanvases.value = []

    // Render each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale: 1.5 })

      // Create canvas element
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      canvas.height = viewport.height
      canvas.width = viewport.width
      // Set responsive styles
      canvas.style.maxWidth = '100%'
      canvas.style.width = viewport.width + 'px'
      canvas.style.height = 'auto'
      canvas.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
      canvas.style.display = 'block'
      canvas.style.margin = '0 auto 20px auto'

      // Render PDF page to canvas
      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
      }

      await page.render(renderContext).promise

      // Add watermark to the rendered page
      const text = watermarkText.value
      const fontSize = Math.max(20, Math.min(viewport.width / 25, 32))
      ctx.font = `bold ${fontSize}px monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      ctx.save()
      ctx.globalAlpha = 0.5
      ctx.fillStyle = '#000000'
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 3

      // Position at center of page
      ctx.translate(viewport.width / 2, viewport.height / 2)
      ctx.rotate(-Math.PI / 4) // 45 degree rotation

      ctx.strokeText(text, 0, 0)
      ctx.fillText(text, 0, 0)
      ctx.restore()

      // Store canvas reference
      pdfPages.value.push({
        pageNum,
        canvas,
        width: viewport.width,
        height: viewport.height,
      })
    }

    // Wait for Vue to update and container to be available
    await nextTick()

    // Wait for container to be rendered in DOM
    let attempts = 0
    while (!pdfContainer.value && attempts < 20) {
      await new Promise((resolve) => setTimeout(resolve, 50))
      await nextTick()
      // Also try to find it directly in DOM
      if (!pdfContainer.value) {
        const containerInDom = document.querySelector('#pdf-container')
        if (containerInDom) {
          pdfContainer.value = containerInDom
          break
        }
      }
      attempts++
    }

    // Append canvases to container
    if (pdfContainer.value) {
      pdfContainer.value.innerHTML = '' // Clear container
      pdfPages.value.forEach((page) => {
        pdfContainer.value.appendChild(page.canvas)
      })
      console.log(`Successfully rendered ${pdfPages.value.length} PDF pages`)
    } else {
      console.error('PDF container not found after', attempts, 'attempts')
      // Try one more time with DOM query
      const containerInDom = document.querySelector('#pdf-container')
      if (containerInDom) {
        containerInDom.innerHTML = ''
        pdfPages.value.forEach((page) => {
          containerInDom.appendChild(page.canvas)
        })
        console.log('PDF pages rendered using DOM query fallback')
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
        // Verify image loaded correctly
        if (!img.width || !img.height || img.naturalWidth === 0 || img.naturalHeight === 0) {
          console.error('Image has invalid dimensions:', {
            width: img.width,
            height: img.height,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
          })
          reject(new Error('Image has invalid dimensions'))
          return
        }

        console.log('Image loaded successfully:', {
          width: img.width,
          height: img.height,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
        })

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

        // Calculate canvas size to fit within viewer while maintaining aspect ratio
        const maxWidth = window.innerWidth * 0.9
        const maxHeight = window.innerHeight * 0.8
        let canvasWidth = img.naturalWidth || img.width
        let canvasHeight = img.naturalHeight || img.height

        if (canvasWidth > maxWidth || canvasHeight > maxHeight) {
          const scale = Math.min(maxWidth / canvasWidth, maxHeight / canvasHeight)
          canvasWidth = canvasWidth * scale
          canvasHeight = canvasHeight * scale
        }

        // Set canvas dimensions (this clears the canvas)
        canvas.width = canvasWidth
        canvas.height = canvasHeight
        canvas.style.width = canvasWidth + 'px'
        canvas.style.height = canvasHeight + 'px'

        // Draw the original image first - this is critical!
        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight)

        console.log('Image drawn to canvas:', {
          canvasWidth,
          canvasHeight,
          imageWidth: img.naturalWidth || img.width,
          imageHeight: img.naturalHeight || img.height,
        })

        // Now add a single watermark text on top of the image
        const text = watermarkText.value
        const fontSize = Math.max(20, Math.min(canvasWidth / 25, 32)) // Responsive font size with limits
        ctx.font = `bold ${fontSize}px monospace`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // Add a single centered watermark, rotated diagonally
        ctx.save()
        ctx.globalAlpha = 0.5 // Semi-transparent watermark
        ctx.fillStyle = '#000000'
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 3

        // Position at center of image
        ctx.translate(canvasWidth / 2, canvasHeight / 2)
        ctx.rotate(-Math.PI / 4) // 45 degree rotation

        // Draw text with stroke for better visibility
        ctx.strokeText(text, 0, 0)
        ctx.fillText(text, 0, 0)

        ctx.restore()

        resolve()
      } catch (error) {
        console.error('Error in onload handler:', error)
        reject(error)
      }
    }

    img.onerror = (error) => {
      console.error('Image load error:', error)
      console.error('Failed to load image from URL:', imageUrl)
      console.error('Image object:', img)
      reject(new Error('Failed to load image from blob URL'))
    }

    // Set the image source - this will trigger onload or onerror
    console.log('Setting image source to blob URL:', imageUrl.substring(0, 50) + '...')
    img.src = imageUrl
  })
}

const viewDocument = async (doc) => {
  if (doc.views_remaining === 0) {
    showErrorNotification('You have reached the maximum number of views for this document')
    return
  }

  currentDocument.value = doc
  viewerLoading.value = true
  showViewer.value = true

  // Wait for dialog to open and render
  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 100))

  try {
    // Get the document view URL - use blob response type
    const response = await api.get(`/common/student/documents/${doc.id}/view`, {
      responseType: 'blob',
    })

    // response.data is already a Blob when responseType is 'blob'
    const blob = response.data
    if (!(blob instanceof Blob)) {
      console.error('Response data is not a Blob:', typeof response.data)
      throw new Error('Invalid response format')
    }

    console.log('Blob created:', {
      size: blob.size,
      type: blob.type,
      fileType: doc.file_type,
    })

    const blobUrl = URL.createObjectURL(blob)
    console.log('Blob URL created:', blobUrl.substring(0, 50) + '...')

    // For images, we need the canvas to be rendered first
    if (doc.file_type !== 'pdf') {
      viewerLoading.value = false
      // Wait for canvas to be rendered in DOM
      await nextTick()
      await new Promise((resolve) => setTimeout(resolve, 150))

      // Function to wait for canvas to be available
      const waitForCanvas = async (maxAttempts = 20) => {
        for (let i = 0; i < maxAttempts; i++) {
          await nextTick()
          await new Promise((resolve) => setTimeout(resolve, 50))

          // Check both ref and DOM element
          if (imageCanvas.value) {
            // Verify it's actually in the DOM
            if (document.contains(imageCanvas.value)) {
              console.log('Canvas is now available via ref')
              return true
            }
          }

          // Try to find canvas in DOM directly
          const canvasInDom = document.querySelector('#document-viewer canvas')
          if (canvasInDom) {
            console.log('Found canvas in DOM directly')
            // Update the ref if needed
            if (!imageCanvas.value) {
              imageCanvas.value = canvasInDom
            }
            return true
          }
        }
        return false
      }

      const canvasAvailable = await waitForCanvas()

      if (!canvasAvailable || !imageCanvas.value) {
        console.error('Canvas ref is still not available after waiting')
        // Try to find it in DOM one more time
        const canvasElement = document.querySelector('#document-viewer canvas')
        if (canvasElement) {
          imageCanvas.value = canvasElement
          console.log('Assigned canvas from DOM to ref')
        } else {
          console.error('Canvas element not found in DOM')
          documentUrl.value = blobUrl
          viewerLoading.value = false
          await loadDocuments()
          return
        }
      }

      try {
        // Convert blob to data URL for more reliable loading
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target.result)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })

        console.log('Data URL created, applying watermark...')
        await addWatermarkToImage(dataUrl)
        console.log('Watermark applied successfully')
      } catch (error) {
        console.error('Error adding watermark to image:', error)
        // Fallback: try with blob URL
        try {
          await addWatermarkToImage(blobUrl)
          console.log('Watermark applied with blob URL as fallback')
        } catch (blobError) {
          console.error('Both data URL and blob URL failed:', blobError)
          documentUrl.value = blobUrl
        }
      }
    } else {
      // For PDFs, render with watermark on canvas
      viewerLoading.value = false
      // Set pdfLoading to false first so container is rendered
      pdfLoading.value = false
      await nextTick()
      await new Promise((resolve) => setTimeout(resolve, 200))

      try {
        await renderPdfWithWatermark(blobUrl)
      } catch (error) {
        console.error('Error rendering PDF:', error)
        // Fallback to iframe if PDF.js fails
        documentUrl.value = blobUrl
        pdfLoading.value = true // Show loading state on error
      }
    }

    // Reload documents to update view count
    await loadDocuments()
  } catch (error) {
    showViewer.value = false
    viewerLoading.value = false
    if (error.response?.status === 403) {
      showErrorNotification(error.response?.data?.message || 'Access denied')
    } else if (error.response?.status === 410) {
      showErrorNotification('Document has expired')
    } else {
      showErrorNotification('Failed to load document')
    }
    console.error(error)
  }
}

// Clean up blob URL when dialog closes
const closeViewer = () => {
  if (documentUrl.value) {
    URL.revokeObjectURL(documentUrl.value)
    documentUrl.value = ''
  }
  // Clean up PDF pages
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

.stat-card-purple {
  border-left-color: #9c27b0;
}

.document-card {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.document-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.document-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.document-disabled:hover {
  transform: none;
  box-shadow: none;
}

/* Additional CSS to prevent text selection and right-click */
#document-viewer {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}

#document-viewer img {
  pointer-events: none;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
}

#document-viewer canvas {
  pointer-events: none;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
}

#pdf-container canvas {
  pointer-events: none;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Disable print screen attempts */
@media print {
  #document-viewer {
    display: none;
  }
}
</style>
