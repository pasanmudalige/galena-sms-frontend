<template>
  <q-page class="p-6">
    <div class="grid md:grid-cols-3 gap-4">
      <q-card>
        <q-card-section>
          <div class="text-sm text-gray-500">Students</div>
          <div class="text-3xl font-semibold">{{ students.total }}</div>
          <div class="text-xs text-gray-500">Active: {{ students.active }} · Inactive: {{ students.inactive }}</div>
        </q-card-section>
      </q-card>
      <q-card>
        <q-card-section>
          <div class="text-sm text-gray-500">Classes</div>
          <div class="text-3xl font-semibold">{{ classes.total }}</div>
          <div class="text-xs text-gray-500">Active: {{ classes.active }} · Inactive: {{ classes.inactive }}</div>
        </q-card-section>
      </q-card>
      <q-card>
        <q-card-section>
          <div class="text-sm text-gray-500">Quick Actions</div>
          <div class="flex gap-2 mt-2">
            <q-btn no-caps color="primary" outline label="Students" @click="$router.push('/admin/users')" />
            <q-btn no-caps color="primary" outline label="Classes" @click="$router.push('/admin/bible-verse/english')" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="grid md:grid-cols-2 gap-4 mt-4">
      <q-card>
        <q-card-section>
          <div class="text-base font-medium mb-2">Recent Students</div>
          <q-list bordered separator>
            <q-item v-for="s in students.recent" :key="s.id">
              <q-item-section>{{ s.student_name }}</q-item-section>
              <q-item-section side>{{ s.status }}</q-item-section>
            </q-item>
            <q-item v-if="!students.recent.length"><q-item-section>No data</q-item-section></q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section>
          <div class="text-base font-medium mb-2">Recent Classes</div>
          <q-list bordered separator>
            <q-item v-for="c in classes.recent" :key="c.id">
              <q-item-section>{{ c.class_name }}</q-item-section>
              <q-item-section side>{{ c.status }}</q-item-section>
            </q-item>
            <q-item v-if="!classes.recent.length"><q-item-section>No data</q-item-section></q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'

const students = ref({ total: 0, active: 0, inactive: 0, recent: [] })
const classes = ref({ total: 0, active: 0, inactive: 0, recent: [] })

const loadDashboard = async () => {
  try {
    const res = await api.get('/v1/api/admin/auth/getDashboardData')
    if (res.status === 200 && res.data?.data) {
      students.value = res.data.data.students
      classes.value = res.data.data.classes
    }
  } catch (e) {
   console.log(e);
  }
}

onMounted(loadDashboard)
</script>
