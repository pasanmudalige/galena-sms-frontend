<template>
  <q-page class="q-pa-md">
    <div class="q-pa-md">
      <!-- Coming Soon Card -->
      <div class="flex flex-center" style="min-height: 70vh">
        <q-card flat bordered class="coming-soon-card" style="max-width: 600px; width: 100%">
          <q-card-section class="q-pa-xl text-center">
            <div class="q-mb-lg">
              <q-icon name="event_available" size="80px" color="primary" />
            </div>
            <div class="text-h4 text-weight-bold text-grey-8 q-mb-md">My Attendance</div>
            <div class="text-h6 text-weight-medium text-primary q-mb-sm">Coming Soon</div>
            <div class="text-body1 text-grey-7 q-mb-lg">
              We're working hard to bring you a comprehensive attendance tracking system. This
              feature will allow you to view your attendance records, track your attendance rate,
              and see detailed attendance history for all your classes.
            </div>
            <div class="row q-col-gutter-sm justify-center q-mt-lg">
              <q-chip color="primary" text-color="white" icon="check_circle" size="sm">
                View Attendance Records
              </q-chip>
              <q-chip color="positive" text-color="white" icon="trending_up" size="sm">
                Track Attendance Rate
              </q-chip>
              <q-chip color="info" text-color="white" icon="history" size="sm">
                Attendance History
              </q-chip>
            </div>
            <q-btn
              unelevated
              color="primary"
              label="Back to Dashboard"
              icon="home"
              class="q-mt-lg"
              @click="$router.push('/student/dashboard')"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
defineOptions({
  name: 'StudentAttendance',
})
</script>

<style scoped>
.coming-soon-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 16px;
}

.coming-soon-card :deep(.q-card__section) {
  border-radius: 16px;
}
</style>
