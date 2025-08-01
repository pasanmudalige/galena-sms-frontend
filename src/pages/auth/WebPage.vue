<template>
  <q-page class="flex flex-center bg-grey-1">
    <div class="column items-center">
      <div class="text-center q-pa-md">
        <h1 class="text-primary text-h2 font-weight-bold q-mb-md">Coming Soon</h1>
        <p class="text-h6 q-mb-lg text-grey-8">We're working hard to bring you something amazing!</p>
            <q-btn
              no-caps
              unelevated
              color="primary"
              label="Click here to log in"
              to="/admin"
              class="q-mt-md"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>

defineOptions({
  name: 'ComingSoonPage'
})
</script>
