<template>
  <q-page class="p-6 bg-gray-100">
    <!-- Top Layer - Today's Statistics -->
    <div class="grid md:grid-cols-4 gap-4 mb-6">
      <q-card class="bg-gradient-to-br from-blue-500 to-blue-600">
        <q-card-section>
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm opacity-90">Total Students Present Today</div>
              <div class="text-3xl font-bold mt-1">245</div>
              <div class="text-xs opacity-80 mt-1">📈 +12% from yesterday</div>
            </div>
            <q-icon name="people" size="48px" class="opacity-30" />
          </div>
        </q-card-section>
      </q-card>

      <q-card class="bg-gradient-to-br from-red-500 to-red-600">
        <q-card-section>
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm opacity-90">Total Students Absent</div>
              <div class="text-3xl font-bold mt-1">15</div>
              <div class="text-xs opacity-80 mt-1">📉 5.8% absence rate</div>
            </div>
            <q-icon name="person_off" size="48px" class="opacity-30" />
          </div>
        </q-card-section>
      </q-card>

      <q-card class="bg-gradient-to-br from-green-500 to-green-600">
        <q-card-section>
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm opacity-90">Today's Payment Collection</div>
              <div class="text-3xl font-bold mt-1">Rs 45,500</div>
              <div class="text-xs opacity-80 mt-1">💰 18 payments today</div>
            </div>
            <q-icon name="payments" size="48px" class="opacity-30" />
          </div>
        </q-card-section>
      </q-card>

      <q-card class="bg-gradient-to-br from-yellow-500 to-yellow-600">
        <q-card-section>
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm opacity-90">Pending Payments</div>
              <div class="text-3xl font-bold mt-1">23</div>
              <div class="text-xs opacity-80 mt-1">⚠️ Overdue payments</div>
            </div>
            <q-icon name="warning" size="48px" class="opacity-30" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Quick Numbers -->
    <div class="grid md:grid-cols-2 gap-4 mb-6">
      <q-card class="bg-gradient-to-br from-purple-500 to-purple-600">
        <q-card-section>
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm opacity-90">Total Active Students</div>
              <div class="text-4xl font-bold mt-1">{{ students.total }}</div>
              <div class="text-xs opacity-80 mt-1">
                Active: {{ students.active }} · Inactive: {{ students.inactive }}
              </div>
            </div>
            <q-icon name="school" size="56px" class="opacity-30" />
          </div>
        </q-card-section>
      </q-card>

      <q-card class="bg-gradient-to-br from-indigo-500 to-indigo-600">
        <q-card-section>
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm opacity-90">Total Active Classes</div>
              <div class="text-4xl font-bold mt-1">{{ classes.total }}</div>
              <div class="text-xs opacity-80 mt-1">
                Active: {{ classes.active }} · Inactive: {{ classes.inactive }}
              </div>
            </div>
            <q-icon name="class" size="56px" class="opacity-30" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Middle Section - Important Lists -->
    <div class="grid md:grid-cols-2 gap-4 mb-6">
      <!-- Recent Activity -->
      <q-card>
        <q-card-section>
          <div class="text-lg font-semibold mb-4 flex items-center">
            <q-icon name="history" class="mr-2" color="primary" />
            Recent Activity
          </div>
          <q-list separator>
            <q-item>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white" icon="person" />
              </q-item-section>
              <q-item-section>
                <q-item-label>John Doe checked in</q-item-label>
                <q-item-label caption>Class A · 9:15 AM</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar>
                <q-avatar color="green" text-color="white" icon="payments" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Payment received from Jane Smith</q-item-label>
                <q-item-label caption>Rs 2,500 · Class B · 10:30 AM</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar>
                <q-avatar color="orange" text-color="white" icon="person_add" />
              </q-item-section>
              <q-item-section>
                <q-item-label>New enrollment: Mike Johnson</q-item-label>
                <q-item-label caption>Class C · Yesterday</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar>
                <q-avatar color="blue" text-color="white" icon="person" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Sarah Williams checked in</q-item-label>
                <q-item-label caption>Class A · 8:45 AM</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <!-- Alerts & Notifications -->
      <q-card>
        <q-card-section>
          <div class="text-lg font-semibold mb-4 flex items-center">
            <q-icon name="notifications" class="mr-2" color="warning" />
            Alerts & Notifications
          </div>
          <q-list separator>
            <q-item class="bg-red-50">
              <q-item-section avatar>
                <q-icon name="error" color="red" size="24px" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-red-700 font-medium">Payment Overdue</q-item-label>
                <q-item-label caption>5 students beyond grace period</q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="bg-yellow-50">
              <q-item-section avatar>
                <q-icon name="warning" color="orange" size="24px" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-orange-700 font-medium">Payment Due Soon</q-item-label>
                <q-item-label caption>12 students within 7 days</q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="bg-gray-50">
              <q-item-section avatar>
                <q-icon name="block" color="grey" size="24px" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-grey-700 font-medium">Blocked Students</q-item-label>
                <q-item-label caption>3 students blocked today</q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="bg-blue-50">
              <q-item-section avatar>
                <q-icon name="trending_down" color="blue" size="24px" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-blue-700 font-medium">Low Attendance</q-item-label>
                <q-item-label caption>8 students with 70% attendance</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>

    <!-- Charts Section -->
    <div class="grid md:grid-cols-2 gap-4 mb-6">
      <q-card>
        <q-card-section>
          <div class="text-lg font-semibold mb-4">Attendance Trend</div>
          <div class="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-400">
            📊 Line Chart Placeholder<br />
            <span class="text-sm">Last 7 days attendance</span>
          </div>
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section>
          <div class="text-lg font-semibold mb-4">Payment Collection Trend</div>
          <div class="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-400">
            📊 Bar Chart Placeholder<br />
            <span class="text-sm">Monthly comparison</span>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="grid md:grid-cols-2 gap-4 mb-6">
      <q-card>
        <q-card-section>
          <div class="text-lg font-semibold mb-4">Class-wise Revenue</div>
          <div class="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-400">
            🥧 Pie Chart Placeholder<br />
            <span class="text-sm">Income per class</span>
          </div>
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section>
          <div class="text-lg font-semibold mb-4">Student Growth</div>
          <div class="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-400">
            📈 Line Chart Placeholder<br />
            <span class="text-sm">Enrollment over time</span>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Quick Actions Panel -->
    <q-card>
      <q-card-section>
        <div class="text-lg font-semibold mb-4">Quick Actions</div>
        <div class="grid md:grid-cols-3 lg:grid-cols-6 gap-3">
          <q-btn
            color="primary"
            icon="person_add"
            label="Add Student"
            no-caps
            class="h-20"
            @click="$router.push('/admin/students')"
          />
          <q-btn
            color="green"
            icon="qr_code_scanner"
            label="Mark Attendance"
            no-caps
            class="h-20"
          />
          <q-btn color="orange" icon="payments" label="Record Payment" no-caps class="h-20" />
          <q-btn color="purple" icon="bar_chart" label="View Reports" no-caps class="h-20" />
          <q-btn
            color="indigo"
            icon="groups"
            label="Manage Classes"
            no-caps
            class="h-20"
            @click="$router.push('/admin/classes')"
          />
          <q-btn color="grey" icon="settings" label="Settings" no-caps class="h-20" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'

const students = ref({ total: 0, active: 0, inactive: 0, recent: [] })
const classes = ref({ total: 0, active: 0, inactive: 0, recent: [] })

const loadDashboard = async () => {
  try {
    const res = await api.get('/admin/auth/getDashboardData')
    if (res.status === 200 && res.data?.data) {
      students.value = res.data.data.students
      classes.value = res.data.data.classes
    }
  } catch (e) {
    console.log(e)
  }
}

onMounted(loadDashboard)
</script>
