<template>
  <q-page class="q-pa-md">
    <div class="q-pa-md">
      <!-- Page Header -->
      <div class="row items-center q-mb-lg">
        <div class="col">
          <div class="text-h4 text-weight-bold text-grey-8">Manage Payments</div>
          <div class="text-subtitle2 text-grey-6">Mark student payments as paid</div>
        </div>
        <div class="col-auto">
          <q-btn
            no-caps
            color="primary"
            icon="add"
            label="Mark Payment as Paid"
            unelevated
            @click="showMarkPaidDialog = true"
          />
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="row q-col-gutter-md q-mb-md" v-if="payments.length > 0">
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="stat-card stat-card-blue">
            <q-card-section class="q-pa-md">
              <div class="row items-center">
                <div class="col">
                  <div class="text-overline text-grey-7">Total Payments</div>
                  <div class="text-h4 text-weight-bold text-primary q-mt-xs">
                    {{ payments.length }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="56px" color="blue-1" text-color="primary">
                    <q-icon name="payments" size="32px" />
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
                  <div class="text-overline text-grey-7">Paid</div>
                  <div class="text-h4 text-weight-bold text-positive q-mt-xs">
                    {{ paidCount }}
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
                  <div class="text-overline text-grey-7">Pending</div>
                  <div class="text-h4 text-weight-bold text-warning q-mt-xs">
                    {{ pendingCount }}
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
                  <div class="text-overline text-grey-7">Overdue</div>
                  <div class="text-h4 text-weight-bold text-negative q-mt-xs">
                    {{ overdueCount }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="56px" color="red-1" text-color="negative">
                    <q-icon name="warning" size="32px" />
                  </q-avatar>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Filters -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-3">
              <q-select
                v-model="filterStudent"
                label="Filter by Student"
                dense
                outlined
                clearable
                :options="studentOptions"
                option-label="label"
                option-value="value"
                emit-value
                map-options
                use-input
                input-debounce="0"
                @filter="filterStudents"
                @update:model-value="loadPayments"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-select
                v-model="filterClass"
                label="Filter by Class"
                dense
                outlined
                clearable
                :options="classOptions"
                option-label="label"
                option-value="value"
                emit-value
                map-options
                @update:model-value="loadPayments"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-select
                v-model="filterStatus"
                label="Filter by Status"
                dense
                outlined
                clearable
                :options="statusOptions"
                option-label="label"
                option-value="value"
                emit-value
                map-options
                @update:model-value="loadPayments"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input
                v-model="filterMonth"
                label="Filter by Month"
                dense
                outlined
                type="month"
                clearable
                @update:model-value="loadPayments"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Payments Table -->
      <q-card flat bordered>
        <q-card-section>
          <q-table
            :rows="filteredPayments"
            :columns="columns"
            row-key="id"
            flat
            bordered
            :loading="loading"
            :rows-per-page-options="[10, 20, 50, 100]"
            :pagination="{ rowsPerPage: 20 }"
          >
            <template #body-cell-payment_status="props">
              <q-td :props="props">
                <q-chip
                  :color="getStatusColor(props.value)"
                  text-color="white"
                  :icon="getStatusIcon(props.value)"
                  size="sm"
                >
                  {{ getStatusLabel(props.value) }}
                </q-chip>
              </q-td>
            </template>

            <template #body-cell-amount="props">
              <q-td :props="props">
                <div class="column">
                  <div class="text-weight-medium">
                    Rs. {{ formatCurrency(props.row.paid_amount || 0) }} / Rs.
                    {{ formatCurrency(props.row.expected_amount) }}
                  </div>
                  <div
                    v-if="props.row.paid_amount < props.row.expected_amount"
                    class="text-caption text-grey-6"
                  >
                    Remaining: Rs.
                    {{ formatCurrency(props.row.expected_amount - props.row.paid_amount) }}
                  </div>
                </div>
              </q-td>
            </template>

            <template #body-cell-due_date="props">
              <q-td :props="props">
                <div class="column">
                  <div>{{ formatDate(props.value) }}</div>
                  <div
                    v-if="isOverdue(props.value, props.row.payment_status)"
                    class="text-caption text-negative"
                  >
                    Overdue
                  </div>
                </div>
              </q-td>
            </template>

            <template #body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  v-if="props.row.payment_status !== 'paid'"
                  dense
                  flat
                  round
                  icon="edit"
                  color="primary"
                  class="q-mr-xs"
                  @click="editPayment(props.row)"
                  title="Edit Payment"
                />
                <q-chip v-else color="positive" text-color="white" icon="check_circle" size="sm">
                  Paid
                </q-chip>
              </q-td>
            </template>

            <template #no-data>
              <div class="full-width row flex-center text-grey-6 q-gutter-sm q-pa-lg">
                <q-icon name="payments" size="2em" />
                <span>No payments found</span>
              </div>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>

    <!-- Mark Payment as Paid Dialog -->
    <q-dialog v-model="showMarkPaidDialog" persistent @show="resetMarkPaidForm">
      <q-card style="min-width: 600px; max-width: 800px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Mark Payment as Paid</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit.prevent="submitMarkAsPaid">
            <div class="q-gutter-md">
              <q-select
                v-model="selectedClassId"
                label="Select Class *"
                dense
                outlined
                :options="allClasses"
                option-label="label"
                option-value="value"
                emit-value
                map-options
                use-input
                input-debounce="0"
                @filter="filterClasses"
                @update:model-value="onClassSelected"
                :rules="[(v) => !!v || 'Required']"
                clearable
              >
                <template #no-option>
                  <q-item>
                    <q-item-section class="text-grey">No classes found</q-item-section>
                  </q-item>
                </template>
              </q-select>

              <q-select
                v-model="markPaidForm.enrollment_id"
                label="Select Student *"
                dense
                outlined
                :options="allStudentOptionsForClass"
                option-label="label"
                option-value="value"
                emit-value
                map-options
                use-input
                input-debounce="0"
                @filter="filterStudentsForClass"
                @update:model-value="onStudentSelected"
                :rules="[(v) => !!v || 'Required']"
                :disable="!selectedClassId"
                hint="Select a class first"
              >
                <template #no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      {{ selectedClassId ? 'No students found for this class' : 'Select a class first' }}
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <q-input
                v-model="markPaidForm.month_year"
                label="Month *"
                dense
                outlined
                type="month"
                :rules="[(v) => !!v || 'Required']"
                hint="Select the month for this payment (default: current month)"
              />

              <q-input
                v-model.number="markPaidForm.paid_amount"
                label="Paid Amount *"
                dense
                outlined
                type="number"
                :min="0"
                :rules="[
                  (v) => !!v || 'Paid amount is required',
                  (v) => v >= 0 || 'Amount must be positive',
                ]"
                hint="Amount paid (default: class fee)"
              />

              <q-select
                v-model="markPaidForm.payment_method"
                label="Payment Method *"
                dense
                outlined
                :options="paymentMethodOptions"
                option-label="label"
                option-value="value"
                emit-value
                map-options
                :rules="[(v) => !!v || 'Required']"
              />

              <q-input
                v-model="markPaidForm.transaction_reference"
                label="Transaction Reference (Optional)"
                dense
                outlined
                hint="Reference number, receipt number, etc."
              />

              <q-input
                v-model="markPaidForm.notes"
                label="Notes (Optional)"
                dense
                outlined
                type="textarea"
                rows="3"
              />
            </div>
            <div class="row justify-end q-mt-lg q-gutter-sm">
              <q-btn flat no-caps label="Cancel" v-close-popup />
              <q-btn color="primary" no-caps label="Mark as Paid" type="submit" :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Edit Payment Dialog -->
    <q-dialog v-model="showEditPaymentDialog" persistent>
      <q-card style="min-width: 600px; max-width: 800px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Edit Payment</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit.prevent="submitEditPayment">
            <div class="q-gutter-md">
              <div class="q-mb-md">
                <div class="text-body2 text-grey-7">Student:</div>
                <div class="text-body1 text-weight-medium">
                  {{ paymentToEdit?.enrollment?.student?.student_name || 'N/A' }}
                </div>
              </div>
              <div class="q-mb-md">
                <div class="text-body2 text-grey-7">Class:</div>
                <div class="text-body1 text-weight-medium">
                  {{ paymentToEdit?.enrollment?.class?.class_name || 'N/A' }}
                </div>
              </div>
              <div class="q-mb-md">
                <div class="text-body2 text-grey-7">Month:</div>
                <div class="text-body1 text-weight-medium">
                  {{ formatMonthYear(paymentToEdit?.month_year) }}
                </div>
              </div>

              <q-input
                v-model.number="editPaymentForm.paid_amount"
                label="Paid Amount *"
                dense
                outlined
                type="number"
                :min="0"
                :rules="[
                  (v) => !!v || 'Paid amount is required',
                  (v) => v >= 0 || 'Amount must be positive',
                ]"
              />

              <q-input
                v-model="editPaymentForm.payment_status_display"
                label="Payment Status"
                dense
                outlined
                readonly
                hint="Status is automatically calculated based on payment amount and due date"
              />

              <q-select
                v-model="editPaymentForm.payment_method"
                label="Payment Method"
                dense
                outlined
                :options="paymentMethodOptions"
                option-label="label"
                option-value="value"
                emit-value
                map-options
              />

              <q-input
                v-model="editPaymentForm.transaction_reference"
                label="Transaction Reference (Optional)"
                dense
                outlined
              />

              <q-input
                v-model="editPaymentForm.notes"
                label="Notes (Optional)"
                dense
                outlined
                type="textarea"
                rows="3"
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
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from 'src/boot/axios'
import { showSuccessNotification, showErrorNotification } from 'src/utils/notification'

const loading = ref(false)
const saving = ref(false)
const payments = ref([])
const enrollments = ref([])
const allEnrollments = ref([])
const showMarkPaidDialog = ref(false)
const showEditPaymentDialog = ref(false)
const paymentToEdit = ref(null)

const filterStudent = ref(null)
const filterClass = ref(null)
const filterStatus = ref(null)
const filterMonth = ref(null)

const selectedClassId = ref(null)
const allClasses = ref([])
const allStudentOptionsForClass = ref([])

const markPaidForm = ref({
  enrollment_id: null,
  month_year: '',
  paid_amount: null,
  payment_method: 'cash',
  transaction_reference: '',
  notes: '',
})

const editPaymentForm = ref({
  paid_amount: null,
  payment_status_display: '',
  payment_method: null,
  transaction_reference: '',
  notes: '',
})

const statusOptions = [
  { label: 'All Status', value: null },
  { label: 'Paid', value: 'paid' },
  { label: 'Pending', value: 'pending' },
  { label: 'Partial', value: 'partial' },
  { label: 'Overdue', value: 'overdue' },
]

const paymentMethodOptions = [
  { label: 'Cash', value: 'cash' },
  { label: 'Bank Transfer', value: 'bank_transfer' },
  { label: 'Card', value: 'card' },
  { label: 'Online', value: 'online' },
]

const columns = [
  {
    name: 'student',
    label: 'Student',
    field: (row) => row.enrollment?.student?.student_name || 'N/A',
    align: 'left',
    sortable: true,
  },
  {
    name: 'student_id',
    label: 'Student ID',
    field: (row) => row.enrollment?.student?.student_id || 'N/A',
    align: 'left',
  },
  {
    name: 'class',
    label: 'Class',
    field: (row) => row.enrollment?.class?.class_name || 'N/A',
    align: 'left',
    sortable: true,
  },
  {
    name: 'month_year',
    label: 'Month',
    field: 'month_year',
    align: 'left',
    sortable: true,
    format: (val) => formatMonthYear(val),
  },
  {
    name: 'amount',
    label: 'Amount',
    field: 'amount',
    align: 'left',
  },
  {
    name: 'due_date',
    label: 'Due Date',
    field: 'due_date',
    align: 'left',
    sortable: true,
  },
  {
    name: 'payment_status',
    label: 'Status',
    field: 'payment_status',
    align: 'center',
    sortable: true,
  },
  {
    name: 'payment_method',
    label: 'Payment Method',
    field: 'payment_method',
    align: 'left',
    format: (val) => (val ? val.replace('_', ' ').toUpperCase() : 'N/A'),
  },
  {
    name: 'payment_datetime',
    label: 'Paid Date',
    field: 'payment_datetime',
    align: 'left',
    format: (val) => (val ? formatDate(val) : 'N/A'),
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'center',
  },
]

const enrollmentOptions = ref([])

const classOptionsForDialog = computed(() => {
  const classSet = new Set()
  allEnrollments.value.forEach((e) => {
    if (e.class) {
      classSet.add(
        JSON.stringify({
          id: e.class.id,
          name: e.class.class_name,
          code: e.class.class_code,
        }),
      )
    }
  })
  return Array.from(classSet).map((c) => {
    const cls = JSON.parse(c)
    return { label: `${cls.name}${cls.code ? ` (${cls.code})` : ''}`, value: cls.id }
  })
})

const studentOptionsForClass = computed(() => {
  if (!selectedClassId.value) {
    return []
  }
  const students = allEnrollments.value
    .filter((e) => e.class?.id === selectedClassId.value && e.status === 'active')
    .map((e) => ({
      label: `${e.student?.student_name} (${e.student?.student_id || 'N/A'})`,
      value: e.id,
      enrollment: e,
    }))
  return students
})

const studentOptions = computed(() => {
  const studentSet = new Set()
  payments.value.forEach((p) => {
    if (p.enrollment?.student) {
      studentSet.add(
        JSON.stringify({
          id: p.enrollment.student.id,
          name: p.enrollment.student.student_name,
        }),
      )
    }
  })
  return [
    { label: 'All Students', value: null },
    ...Array.from(studentSet).map((s) => {
      const student = JSON.parse(s)
      return { label: student.name, value: student.id }
    }),
  ]
})

const classOptions = computed(() => {
  const classSet = new Set()
  payments.value.forEach((p) => {
    if (p.enrollment?.class) {
      classSet.add(
        JSON.stringify({
          id: p.enrollment.class.id,
          name: p.enrollment.class.class_name,
        }),
      )
    }
  })
  return [
    { label: 'All Classes', value: null },
    ...Array.from(classSet).map((c) => {
      const cls = JSON.parse(c)
      return { label: cls.name, value: cls.id }
    }),
  ]
})

const filteredPayments = computed(() => {
  let filtered = payments.value

  if (filterStudent.value) {
    filtered = filtered.filter((p) => p.enrollment?.student?.id === filterStudent.value)
  }

  if (filterClass.value) {
    filtered = filtered.filter((p) => p.enrollment?.class?.id === filterClass.value)
  }

  if (filterStatus.value) {
    filtered = filtered.filter((p) => p.payment_status === filterStatus.value)
  }

  if (filterMonth.value) {
    filtered = filtered.filter((p) => p.month_year === filterMonth.value)
  }

  return filtered
})

const paidCount = computed(() => {
  return payments.value.filter((p) => p.payment_status === 'paid').length
})

const pendingCount = computed(() => {
  return payments.value.filter((p) => p.payment_status === 'pending').length
})

const overdueCount = computed(() => {
  return payments.value.filter((p) => p.payment_status === 'overdue').length
})

const formatCurrency = (amount) => {
  return parseFloat(amount || 0).toFixed(2)
}

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

const formatMonthYear = (monthYear) => {
  if (!monthYear) return 'N/A'
  try {
    const [year, month] = monthYear.split('-')
    const date = new Date(year, parseInt(month) - 1, 1)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    })
  } catch (e) {
    console.log(e)
    return monthYear
  }
}

const isOverdue = (dueDate, status) => {
  if (status === 'paid') return false
  if (!dueDate) return false
  const due = new Date(dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)
  return due < today
}

const getStatusColor = (status) => {
  switch (status) {
    case 'paid':
      return 'positive'
    case 'pending':
      return 'warning'
    case 'partial':
      return 'info'
    case 'overdue':
      return 'negative'
    default:
      return 'grey'
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'paid':
      return 'check_circle'
    case 'pending':
      return 'schedule'
    case 'partial':
      return 'payment'
    case 'overdue':
      return 'warning'
    default:
      return 'help'
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'paid':
      return 'Paid'
    case 'pending':
      return 'Pending'
    case 'partial':
      return 'Partial'
    case 'overdue':
      return 'Overdue'
    default:
      return status || 'Unknown'
  }
}

const loadEnrollments = async () => {
  try {
    const res = await api.get('/admin/enrollments')
    if (res.status === 200 && res.data?.data) {
      enrollments.value = res.data.data.filter((e) => e.status === 'active')
      allEnrollments.value = enrollments.value
      enrollmentOptions.value = enrollments.value.map((e) => ({
        label: `${e.student?.student_name} (${e.student?.student_id || 'N/A'}) - ${e.class?.class_name}`,
        value: e.id,
        enrollment: e,
      }))
      // Initialize class options
      allClasses.value = classOptionsForDialog.value
    }
  } catch (error) {
    console.error('Failed to load enrollments:', error)
  }
}

const filterClasses = (val, update) => {
  if (val === '') {
    update(() => {
      allClasses.value = classOptionsForDialog.value
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    allClasses.value = classOptionsForDialog.value.filter((c) =>
      c.label.toLowerCase().includes(needle),
    )
  })
}

const onClassSelected = (classId) => {
  selectedClassId.value = classId
  // Reset student selection when class changes
  markPaidForm.value.enrollment_id = null
  markPaidForm.value.paid_amount = null
  // Update student options
  allStudentOptionsForClass.value = studentOptionsForClass.value
}

const filterStudentsForClass = (val, update) => {
  if (val === '') {
    update(() => {
      allStudentOptionsForClass.value = studentOptionsForClass.value
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    allStudentOptionsForClass.value = studentOptionsForClass.value.filter((s) =>
      s.label.toLowerCase().includes(needle),
    )
  })
}

const onStudentSelected = (enrollmentId) => {
  const enrollment = allEnrollments.value.find((e) => e.id === enrollmentId)
  if (enrollment && enrollment.class) {
    // Set default amount based on card type
    let defaultAmount = 0
    
    if (enrollment.custom_fee !== null && enrollment.custom_fee !== undefined) {
      // Custom fee takes priority
      defaultAmount = parseFloat(enrollment.custom_fee || 0)
    } else {
      // Calculate based on card type
      const classFee = parseFloat(enrollment.class.class_fee || 0)
      
      if (enrollment.card_type === 'full_card') {
        defaultAmount = classFee
      } else if (enrollment.card_type === 'half_card') {
        defaultAmount = classFee / 2
      } else if (enrollment.card_type === 'free_card') {
        defaultAmount = 0
      } else {
        // Default to full card if card_type is not set
        defaultAmount = classFee
      }
    }
    
    markPaidForm.value.paid_amount = defaultAmount
  }
}

const loadPayments = async () => {
  loading.value = true
  try {
    const params = {}
    if (filterStudent.value) {
      params.student_id = filterStudent.value
    }
    if (filterClass.value) {
      params.class_id = filterClass.value
    }
    if (filterStatus.value) {
      params.payment_status = filterStatus.value
    }
    if (filterMonth.value) {
      params.month_year = filterMonth.value
    }

    const res = await api.get('/admin/payments', { params })
    if (res.status === 200 && res.data?.data) {
      payments.value = res.data.data
    }
  } catch (error) {
    console.error('Error loading payments:', error)
    showErrorNotification(error.response?.data?.message || 'Failed to load payments')
  } finally {
    loading.value = false
  }
}

const submitMarkAsPaid = async () => {
  saving.value = true
  try {
    // First, check if payment record exists
    const enrollment = allEnrollments.value.find((e) => e.id === markPaidForm.value.enrollment_id)
    if (!enrollment) {
      showErrorNotification('Enrollment not found')
      return
    }

    // Check if payment already exists for this enrollment and month
    const existingPayment = payments.value.find(
      (p) =>
        p.enrollment_id === markPaidForm.value.enrollment_id &&
        p.month_year === markPaidForm.value.month_year,
    )

    if (existingPayment) {
      // Update existing payment
      const payload = {
        paid_amount: markPaidForm.value.paid_amount,
        payment_status: 'paid',
        payment_method: markPaidForm.value.payment_method || null,
        payment_datetime: new Date().toISOString(),
        transaction_reference: markPaidForm.value.transaction_reference || null,
        notes: markPaidForm.value.notes || null,
      }

      const res = await api.put(`/admin/payments/${existingPayment.id}`, payload)
      if (res.status === 200) {
        showSuccessNotification('Payment updated successfully')
        showMarkPaidDialog.value = false
        resetMarkPaidForm()
        await loadPayments()
      }
    } else {
      // Create new payment record with paid status
      const payload = {
        enrollment_id: markPaidForm.value.enrollment_id,
        month_year: markPaidForm.value.month_year,
        expected_amount: enrollment.class?.class_fee || markPaidForm.value.paid_amount,
        paid_amount: markPaidForm.value.paid_amount,
        payment_status: 'paid',
        payment_method: markPaidForm.value.payment_method || null,
        payment_datetime: new Date().toISOString(),
        transaction_reference: markPaidForm.value.transaction_reference || null,
        notes: markPaidForm.value.notes || null,
      }

      const res = await api.post('/admin/payments', payload)
      if (res.status === 201) {
        showSuccessNotification('Payment marked as paid successfully')
        showMarkPaidDialog.value = false
        resetMarkPaidForm()
        await loadPayments()
      }
    }
  } catch (error) {
    console.error('Error marking payment as paid:', error)
    showErrorNotification(error.response?.data?.message || 'Failed to mark payment as paid')
  } finally {
    saving.value = false
  }
}

const getPaymentStatusLabel = (status) => {
  const statusMap = {
    paid: 'Paid',
    pending: 'Pending',
    partial: 'Partial',
    overdue: 'Overdue',
  }
  return statusMap[status] || status || 'Unknown'
}

const editPayment = (payment) => {
  paymentToEdit.value = payment
  editPaymentForm.value = {
    paid_amount: payment.paid_amount || 0,
    payment_status_display: getPaymentStatusLabel(payment.payment_status),
    payment_method: payment.payment_method || null,
    transaction_reference: payment.transaction_reference || '',
    notes: payment.notes || '',
  }
  showEditPaymentDialog.value = true
}

const submitEditPayment = async () => {
  if (!paymentToEdit.value) return

  saving.value = true
  try {
    const payload = {
      paid_amount: editPaymentForm.value.paid_amount,
      // payment_status is automatically calculated by backend based on paid_amount and due_date
      payment_method: editPaymentForm.value.payment_method || null,
      transaction_reference: editPaymentForm.value.transaction_reference || null,
      notes: editPaymentForm.value.notes || null,
    }

    // If paid_amount equals or exceeds expected_amount, set payment_datetime
    if (editPaymentForm.value.paid_amount >= paymentToEdit.value.expected_amount && !paymentToEdit.value.payment_datetime) {
      payload.payment_datetime = new Date().toISOString()
    }

    const res = await api.put(`/admin/payments/${paymentToEdit.value.id}`, payload)
    if (res.status === 200) {
      showSuccessNotification('Payment updated successfully')
      showEditPaymentDialog.value = false
      paymentToEdit.value = null
      await loadPayments()
    }
  } catch (error) {
    console.error('Error updating payment:', error)
    showErrorNotification(error.response?.data?.message || 'Failed to update payment')
  } finally {
    saving.value = false
  }
}

const resetMarkPaidForm = () => {
  const today = new Date()
  const currentMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0')

  selectedClassId.value = null
  allClasses.value = classOptionsForDialog.value
  allStudentOptionsForClass.value = []

  markPaidForm.value = {
    enrollment_id: null,
    month_year: currentMonth,
    paid_amount: null,
    payment_method: 'cash',
    transaction_reference: '',
    notes: '',
  }
}

onMounted(() => {
  loadEnrollments()
  loadPayments()
  resetMarkPaidForm()
})
</script>

<style scoped>
.stat-card {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
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

.stat-card-red {
  border-left: 4px solid #f44336;
}
</style>
