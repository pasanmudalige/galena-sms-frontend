<template>
  <q-page class="p-6">
    <div class="flex justify-between items-center mb-4">
      <div class="text-xl font-semibold">Manage Classes</div>
      <q-btn no-caps color="primary" icon="add" label="Add Class" />
    </div>
    <q-table :rows="rows" :columns="columns" row-key="id" flat bordered>
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            dense
            flat
            round
            icon="edit"
            color="primary"
            class="mr-1"
            @click="onEdit(props.row)"
          />
          <q-btn dense flat round icon="delete" color="negative" @click="onDelete(props.row)" />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { api } from 'src/boot/axios'

const rows = ref([])
const columns = [
  { name: 'class_name', label: 'Class Name', field: 'class_name', align: 'left', sortable: true },
  { name: 'class_code', label: 'Code', field: 'class_code', align: 'left' },
  { name: 'teacher_name', label: 'Teacher', field: 'teacher_name', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'createdAt', label: 'Created', field: 'createdAt', align: 'left', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' },
]

const load = async () => {
  const res = await api.get('/v1/api/admin/classes')
  if (res.status === 200) rows.value = res.data
}

// const onEdit = (row) => {
//   // TODO: open edit dialog
// }

const onDelete = async (row) => {
  await api.delete(`/v1/api/admin/classes/${row.id}`)
  await load()
}

onMounted(load)
</script>
