<template>
  <q-page class="q-pa-md">
    <div class="q-pa-md">
      <!-- Coming Soon Card -->
      <div class="flex flex-center" style="min-height: 70vh">
        <q-card flat bordered class="coming-soon-card" style="max-width: 600px; width: 100%">
          <q-card-section class="q-pa-xl text-center">
            <div class="q-mb-lg">
              <q-icon name="payments" size="80px" color="orange" />
            </div>
            <div class="text-h4 text-weight-bold text-grey-8 q-mb-md">My Payments</div>
            <div class="text-h6 text-weight-medium text-orange q-mb-sm">Coming Soon</div>
            <div class="text-body1 text-grey-7 q-mb-lg">
              We're developing a comprehensive payment management system for you. This feature will
              allow you to view your payment history, track pending payments, make online payments,
              and download payment receipts.
            </div>
            <div class="row q-col-gutter-sm justify-center q-mt-lg">
              <q-chip color="orange" text-color="white" icon="history" size="sm">
                Payment History
              </q-chip>
              <q-chip color="warning" text-color="white" icon="schedule" size="sm">
                Pending Payments
              </q-chip>
              <q-chip color="positive" text-color="white" icon="payment" size="sm">
                Online Payments
              </q-chip>
              <q-chip color="info" text-color="white" icon="receipt" size="sm">
                Payment Receipts
              </q-chip>
            </div>
            <q-btn
              unelevated
              color="orange"
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
  name: 'StudentPayments',
})
</script>

<style scoped>
.coming-soon-card {
  background: linear-gradient(135deg, #fff5e6 0%, #ffe0b2 100%);
  border-radius: 16px;
}

.coming-soon-card :deep(.q-card__section) {
  border-radius: 16px;
}
</style>
