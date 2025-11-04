<template>
  <q-page class="q-pa-md">
    <div class="q-pa-md">
      <!-- Page Header -->
      <div class="row items-center q-mb-lg">
        <div class="col">
          <div class="text-h4 text-weight-bold text-grey-8">Dashboard</div>
          <div class="text-subtitle2 text-grey-6">Welcome back! Here's what's happening today.</div>
        </div>
        <div class="col-auto">
          <q-btn
            color="primary"
            icon="refresh"
            label="Refresh"
            flat
            @click="loadDashboard"
            :loading="loading"
          />
        </div>
      </div>

      <!-- Top Stats Cards -->
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="stat-card stat-card-blue">
            <q-card-section class="q-pa-md">
              <div class="row items-center">
                <div class="col">
                  <div class="text-overline text-grey-7">Students Present</div>
                  <div class="text-h4 text-weight-bold text-primary q-mt-xs">245</div>
                  <div class="text-caption text-positive q-mt-xs">
                    <q-icon name="trending_up" size="14px" />
                    +12% from yesterday
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
          <q-card flat bordered class="stat-card stat-card-red">
            <q-card-section class="q-pa-md">
              <div class="row items-center">
                <div class="col">
                  <div class="text-overline text-grey-7">Students Absent</div>
                  <div class="text-h4 text-weight-bold text-negative q-mt-xs">15</div>
                  <div class="text-caption text-grey-6 q-mt-xs">
                    <q-icon name="info" size="14px" />
                    5.8% absence rate
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="56px" color="red-1" text-color="negative">
                    <q-icon name="person_off" size="32px" />
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
                  <div class="text-overline text-grey-7">Today's Collection</div>
                  <div class="text-h4 text-weight-bold text-positive q-mt-xs">Rs 45,500</div>
                  <div class="text-caption text-grey-6 q-mt-xs">
                    <q-icon name="payments" size="14px" />
                    18 payments received
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="56px" color="green-1" text-color="positive">
                    <q-icon name="account_balance_wallet" size="32px" />
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
                  <div class="text-overline text-grey-7">Pending Payments</div>
                  <div class="text-h4 text-weight-bold text-warning q-mt-xs">23</div>
                  <div class="text-caption text-warning q-mt-xs">
                    <q-icon name="warning" size="14px" />
                    Require attention
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
      </div>

      <!-- Overview Cards -->
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-md-6">
          <q-card flat bordered>
            <q-card-section class="q-pa-md">
              <div class="row items-center">
                <div class="col">
                  <div class="text-overline text-grey-7">Total Active Students</div>
                  <div class="text-h3 text-weight-bold text-grey-8 q-mt-xs">
                    {{ students.total }}
                  </div>
                  <div class="q-mt-sm">
                    <q-chip size="sm" color="positive" text-color="white" icon="check_circle">
                      Active: {{ students.active }}
                    </q-chip>
                    <q-chip size="sm" color="grey-5" text-color="white" icon="cancel">
                      Inactive: {{ students.inactive }}
                    </q-chip>
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="72px" color="purple-1" text-color="purple">
                    <q-icon name="school" size="40px" />
                  </q-avatar>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-6">
          <q-card flat bordered>
            <q-card-section class="q-pa-md">
              <div class="row items-center">
                <div class="col">
                  <div class="text-overline text-grey-7">Total Active Classes</div>
                  <div class="text-h3 text-weight-bold text-grey-8 q-mt-xs">
                    {{ classes.total }}
                  </div>
                  <div class="q-mt-sm">
                    <q-chip size="sm" color="positive" text-color="white" icon="check_circle">
                      Active: {{ classes.active }}
                    </q-chip>
                    <q-chip size="sm" color="grey-5" text-color="white" icon="cancel">
                      Inactive: {{ classes.inactive }}
                    </q-chip>
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="72px" color="indigo-1" text-color="indigo">
                    <q-icon name="class" size="40px" />
                  </q-avatar>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Activity and Alerts -->
      <div class="row q-col-gutter-md q-mb-md">
        <!-- Recent Activity -->
        <div class="col-12 col-md-6">
          <q-card flat bordered>
            <q-card-section class="q-pa-md">
              <div class="row items-center q-mb-md">
                <div class="col">
                  <div class="text-h6 text-weight-bold text-grey-8">
                    <q-icon name="history" color="primary" size="24px" class="q-mr-xs" />
                    Recent Activity
                  </div>
                </div>
                <div class="col-auto">
                  <q-btn flat dense color="primary" label="View All" size="sm" />
                </div>
              </div>

              <q-list separator>
                <q-item class="q-px-none">
                  <q-item-section avatar>
                    <q-avatar color="primary" text-color="white" size="40px">
                      <q-icon name="login" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">John Doe checked in</q-item-label>
                    <q-item-label caption class="text-grey-6">
                      <q-icon name="class" size="14px" />
                      Class A · 9:15 AM
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item class="q-px-none">
                  <q-item-section avatar>
                    <q-avatar color="positive" text-color="white" size="40px">
                      <q-icon name="payments" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">
                      Payment received from Jane Smith
                    </q-item-label>
                    <q-item-label caption class="text-grey-6">
                      <q-icon name="account_balance_wallet" size="14px" />
                      Rs 2,500 · Class B · 10:30 AM
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item class="q-px-none">
                  <q-item-section avatar>
                    <q-avatar color="orange" text-color="white" size="40px">
                      <q-icon name="person_add" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">
                      New enrollment: Mike Johnson
                    </q-item-label>
                    <q-item-label caption class="text-grey-6">
                      <q-icon name="class" size="14px" />
                      Class C · Yesterday
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item class="q-px-none">
                  <q-item-section avatar>
                    <q-avatar color="blue" text-color="white" size="40px">
                      <q-icon name="login" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">
                      Sarah Williams checked in
                    </q-item-label>
                    <q-item-label caption class="text-grey-6">
                      <q-icon name="class" size="14px" />
                      Class A · 8:45 AM
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>

        <!-- Alerts & Notifications -->
        <div class="col-12 col-md-6">
          <q-card flat bordered>
            <q-card-section class="q-pa-md">
              <div class="row items-center q-mb-md">
                <div class="col">
                  <div class="text-h6 text-weight-bold text-grey-8">
                    <q-icon
                      name="notifications_active"
                      color="warning"
                      size="24px"
                      class="q-mr-xs"
                    />
                    Alerts & Notifications
                  </div>
                </div>
                <div class="col-auto">
                  <q-badge color="negative" floating>4</q-badge>
                </div>
              </div>

              <q-list separator>
                <q-item clickable class="q-px-none alert-item alert-danger">
                  <q-item-section avatar>
                    <q-avatar color="negative" text-color="white" size="40px">
                      <q-icon name="error" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold text-negative">
                      Payment Overdue
                    </q-item-label>
                    <q-item-label caption class="text-grey-7">
                      5 students beyond grace period
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon name="chevron_right" color="grey-5" />
                  </q-item-section>
                </q-item>

                <q-item clickable class="q-px-none alert-item alert-warning">
                  <q-item-section avatar>
                    <q-avatar color="warning" text-color="white" size="40px">
                      <q-icon name="warning" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold text-warning">
                      Payment Due Soon
                    </q-item-label>
                    <q-item-label caption class="text-grey-7">
                      12 students within 7 days
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon name="chevron_right" color="grey-5" />
                  </q-item-section>
                </q-item>

                <q-item clickable class="q-px-none alert-item">
                  <q-item-section avatar>
                    <q-avatar color="grey-6" text-color="white" size="40px">
                      <q-icon name="block" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold text-grey-8">
                      Blocked Students
                    </q-item-label>
                    <q-item-label caption class="text-grey-7">
                      3 students blocked today
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon name="chevron_right" color="grey-5" />
                  </q-item-section>
                </q-item>

                <q-item clickable class="q-px-none alert-item">
                  <q-item-section avatar>
                    <q-avatar color="info" text-color="white" size="40px">
                      <q-icon name="trending_down" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold text-info"> Low Attendance </q-item-label>
                    <q-item-label caption class="text-grey-7">
                      8 students with &lt;70% attendance
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon name="chevron_right" color="grey-5" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-md-6">
          <q-card flat bordered>
            <q-card-section class="q-pa-md">
              <div class="text-h6 text-weight-bold text-grey-8 q-mb-md">
                <q-icon name="trending_up" color="primary" size="24px" class="q-mr-xs" />
                Attendance Trend
              </div>
              <div class="chart-placeholder">
                <q-icon name="show_chart" size="64px" color="grey-4" />
                <div class="text-grey-6 q-mt-sm">Last 7 days attendance</div>
                <q-btn
                  flat
                  color="primary"
                  label="View Detailed Report"
                  size="sm"
                  class="q-mt-md"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-6">
          <q-card flat bordered>
            <q-card-section class="q-pa-md">
              <div class="text-h6 text-weight-bold text-grey-8 q-mb-md">
                <q-icon name="bar_chart" color="positive" size="24px" class="q-mr-xs" />
                Payment Collection Trend
              </div>
              <div class="chart-placeholder">
                <q-icon name="insert_chart" size="64px" color="grey-4" />
                <div class="text-grey-6 q-mt-sm">Monthly comparison</div>
                <q-btn
                  flat
                  color="primary"
                  label="View Detailed Report"
                  size="sm"
                  class="q-mt-md"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Quick Actions -->
      <q-card flat bordered>
        <q-card-section class="q-pa-md">
          <div class="text-h6 text-weight-bold text-grey-8 q-mb-md">Quick Actions</div>
          <div class="row q-col-gutter-sm">
            <div class="col-6 col-sm-4 col-md-2">
              <q-btn
                unelevated
                color="primary"
                icon="person_add"
                label="Add Student"
                class="full-width action-btn"
                @click="$router.push('/admin/students')"
              />
            </div>
            <div class="col-6 col-sm-4 col-md-2">
              <q-btn
                unelevated
                color="positive"
                icon="qr_code_scanner"
                label="Attendance"
                class="full-width action-btn"
              />
            </div>
            <div class="col-6 col-sm-4 col-md-2">
              <q-btn
                unelevated
                color="orange"
                icon="payments"
                label="Payment"
                class="full-width action-btn"
              />
            </div>
            <div class="col-6 col-sm-4 col-md-2">
              <q-btn
                unelevated
                color="purple"
                icon="assessment"
                label="Reports"
                class="full-width action-btn"
              />
            </div>
            <div class="col-6 col-sm-4 col-md-2">
              <q-btn
                unelevated
                color="indigo"
                icon="class"
                label="Classes"
                class="full-width action-btn"
                @click="$router.push('/admin/classes')"
              />
            </div>
            <div class="col-6 col-sm-4 col-md-2">
              <q-btn
                unelevated
                color="grey-7"
                icon="settings"
                label="Settings"
                class="full-width action-btn"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'

const students = ref({ total: 0, active: 0, inactive: 0 })
const classes = ref({ total: 0, active: 0, inactive: 0 })
const loading = ref(false)

const loadDashboard = async () => {
  loading.value = true
  try {
    const res = await api.get('/admin/auth/getDashboardData')
    if (res.status === 200 && res.data?.data) {
      students.value = res.data.data.students
      classes.value = res.data.data.classes
    }
  } catch (e) {
    console.error('Dashboard load error:', e)
  } finally {
    loading.value = false
  }
}

onMounted(loadDashboard)
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

.stat-card-red {
  border-left-color: #c10015;
}

.stat-card-green {
  border-left-color: #21ba45;
}

.stat-card-orange {
  border-left-color: #f2c037;
}

.alert-item {
  border-radius: 8px;
  transition: background-color 0.2s;
}

.alert-item:hover {
  background-color: #f5f5f5;
}

.alert-danger {
  background-color: #ffebee;
}

.alert-warning {
  background-color: #fff8e1;
}

.chart-placeholder {
  height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
  text-align: center;
}

.action-btn {
  height: 80px;
  flex-direction: column;
  font-size: 12px;
}

.action-btn :deep(.q-btn__content) {
  flex-direction: column;
  gap: 8px;
}

.action-btn :deep(.q-icon) {
  font-size: 28px;
}
</style>
