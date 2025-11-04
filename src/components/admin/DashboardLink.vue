<template>
  <q-item clickable v-ripple @click="onClick">
    <q-item-section avatar>
      <q-icon :name="icon || 'chevron_right'" />
    </q-item-section>
    <q-item-section>{{ title }}</q-item-section>
  </q-item>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  icon: { type: String, default: 'chevron_right' },
  route: { type: String, required: true },
})

const emit = defineEmits(['dashboardLinkClicked'])

const onClick = () => {
  emit('dashboardLinkClicked', { route: props.route, title: props.title })
}
</script>


