<template>
  <q-page class="q-pa-md">
    <div class="q-pa-md">
      <!-- Page Header -->
      <div class="row items-center q-mb-lg">
        <div class="col">
          <div class="text-subtitle2 text-grey-6">View and manage all classes</div>
        </div>
        <div class="col-auto">
          <q-btn
            no-caps
            color="primary"
            icon="add"
            label="Add Class"
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
                  <div class="text-overline text-grey-7">Total Classes</div>
                  <div class="text-h4 text-weight-bold text-primary q-mt-xs">
                    {{ rows.length }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="56px" color="blue-1" text-color="primary">
                    <q-icon name="school" size="32px" />
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
                  <div class="text-overline text-grey-7">Active Classes</div>
                  <div class="text-h4 text-weight-bold text-positive q-mt-xs">
                    {{ activeClassesCount }}
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
                  <div class="text-overline text-grey-7">Inactive Classes</div>
                  <div class="text-h4 text-weight-bold text-warning q-mt-xs">
                    {{ inactiveClassesCount }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="56px" color="orange-1" text-color="warning">
                    <q-icon name="block" size="32px" />
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
                  <div class="text-overline text-grey-7">Total Capacity</div>
                  <div class="text-h4 text-weight-bold text-purple q-mt-xs">
                    {{ totalCapacity }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="56px" color="purple-1" text-color="purple">
                    <q-icon name="people" size="32px" />
                  </q-avatar>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Classes Table -->
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
            class="classes-table"
          >
            <template #top>
              <div class="text-h6 text-weight-bold text-grey-8">Classes List</div>
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

            <template #body-cell-class_fee="props">
              <q-td :props="props">
                <span class="text-weight-medium">
                  {{ props.value ? `Rs ${props.value.toLocaleString()}` : '-' }}
                </span>
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
                  @click="onEdit(props.row)"
                  title="Edit Class"
                />
                <q-btn
                  dense
                  flat
                  round
                  icon="delete"
                  color="negative"
                  @click="onDelete(props.row)"
                  title="Delete Class"
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>

      <!-- Add Class Dialog -->
      <q-dialog v-model="showAdd" persistent>
        <q-card class="rounded-xl shadow-lg" style="min-width: 540px; max-width: 600px">
          <q-card-section
            class="bg-primary text-white text-lg font-semibold flex items-center justify-between rounded-t-xl"
          >
            <div>Add Class</div>
            <q-btn flat dense round icon="close" color="white" v-close-popup />
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-lg bg-grey-1">
            <q-form @submit.prevent="submitAdd" class="q-gutter-md">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.class_name"
                    label="Class Name *"
                    dense
                    outlined
                    :rules="[(v) => !!v || 'Required']"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model="form.class_code" label="Class Code" dense outlined />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model="form.teacher_name" label="Teacher Name" dense outlined />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model.number="form.class_fee"
                    label="Class Fee"
                    dense
                    outlined
                    type="number"
                    step="0.01"
                    prefix="Rs "
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model.number="form.max_capacity"
                    label="Max Capacity"
                    dense
                    outlined
                    type="number"
                  />
                </div>
                <div class="col-12">
                  <q-input
                    v-model="form.description"
                    label="Description"
                    dense
                    outlined
                    type="textarea"
                    autogrow
                  />
                </div>
              </div>
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

      <!-- Edit Class Dialog -->
      <q-dialog v-model="showEdit" persistent>
        <q-card class="rounded-xl shadow-lg" style="min-width: 540px; max-width: 600px">
          <q-card-section
            class="bg-primary text-white text-lg font-semibold flex items-center justify-between rounded-t-xl"
          >
            <div>Edit Class</div>
            <q-btn flat dense round icon="close" color="white" v-close-popup />
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-lg bg-grey-1">
            <q-form @submit.prevent="submitEdit" class="q-gutter-md">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="editForm.class_name"
                    label="Class Name *"
                    dense
                    outlined
                    :rules="[(v) => !!v || 'Required']"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model="editForm.class_code" label="Class Code" dense outlined />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model="editForm.teacher_name" label="Teacher Name" dense outlined />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model.number="editForm.class_fee"
                    label="Class Fee"
                    dense
                    outlined
                    type="number"
                    step="0.01"
                    prefix="Rs "
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model.number="editForm.max_capacity"
                    label="Max Capacity"
                    dense
                    outlined
                    type="number"
                  />
                </div>
                <div class="col-12 col-md-6">
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
                    v-model="editForm.description"
                    label="Description"
                    dense
                    outlined
                    type="textarea"
                    autogrow
                  />
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
          </q-card-section>
          <q-card-actions align="center" class="q-pb-lg">
            <q-btn color="primary" no-caps label="OK" unelevated @click="closeSuccess" />
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
import { useQuasar } from 'quasar'

const $q = useQuasar()
const rows = ref([])
const loading = ref(false)
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
const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]
const columns = [
  { name: 'class_name', label: 'Class Name', field: 'class_name', align: 'left', sortable: true },
  { name: 'class_code', label: 'Code', field: 'class_code', align: 'left' },
  { name: 'teacher_name', label: 'Teacher', field: 'teacher_name', align: 'left' },
  {
    name: 'class_fee',
    label: 'Fee',
    field: 'class_fee',
    align: 'left',
    format: (val) => (val ? `Rs ${val.toLocaleString()}` : '-'),
  },
  { name: 'max_capacity', label: 'Capacity', field: 'max_capacity', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'createdAt', label: 'Created', field: 'createdAt', align: 'left', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' },
]

const activeClassesCount = computed(() => {
  return rows.value.filter((r) => r.status === 'active').length
})

const inactiveClassesCount = computed(() => {
  return rows.value.filter((r) => r.status === 'inactive').length
})

const totalCapacity = computed(() => {
  return rows.value.reduce((sum, r) => sum + (r.max_capacity || 0), 0)
})

const load = async () => {
  loading.value = true
  try {
    const res = await api.get('/admin/classes')
    if (res.status === 200 && res.data?.data) {
      rows.value = res.data.data
    }
  } catch (error) {
    showErrorNotification('Failed to load classes')
    console.error(error)
  } finally {
    loading.value = false
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
      showSuccessNotification('Class added successfully')
    }
  } catch (error) {
    showErrorNotification('Failed to add class')
    console.error(error)
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
      showSuccessNotification('Class updated successfully')
    }
  } catch (error) {
    showErrorNotification('Failed to update class')
    console.error(error)
  } finally {
    saving.value = false
  }
}

const onDelete = async (row) => {
  $q.dialog({
    title: 'Confirm Delete',
    message: `Are you sure you want to delete ${row.class_name}?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await api.delete(`/admin/classes/${row.id}`)
      await load()
      showSuccessNotification('Class deleted successfully')
    } catch (error) {
      showErrorNotification('Failed to delete class')
      console.error(error)
    }
  })
}

const closeSuccess = () => {
  showSuccess.value = false
  successMessage.value = ''
}

onMounted(load)
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

.classes-table :deep(.q-table__top) {
  padding: 16px;
}

.classes-table :deep(.q-table thead tr th) {
  background-color: #f5f5f5;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.5px;
}

.classes-table :deep(.q-table tbody tr:hover) {
  background-color: #f9f9f9;
}
</style>
