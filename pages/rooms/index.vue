<template>
  <div>
    <v-card class="mb-4">
      <v-card-title class="d-flex align-center">
        Rooms
        <v-spacer />
        <v-select
          v-model="statusFilter"
          :items="statusOptions"
          density="compact"
          class="mx-4"
          style="max-width: 200px"
        />
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="dialog = true"
        >
          Add Room
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-table>
          <thead>
            <tr>
              <th>Room Number</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="room in rooms" :key="room.id">
              <td>{{ room.room_number }}</td>
              <td>
                <v-chip
                  :color="getStatusColor(room.status)"
                  size="small"
                >
                  {{ room.status }}
                </v-chip>
              </td>
              <td>
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  @click="editRoom(room)"
                />
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn
                      icon="mdi-dots-vertical"
                      size="small"
                      variant="text"
                      v-bind="props"
                    />
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="status in availableStatuses"
                      :key="status"
                      :disabled="room.status === status"
                      @click="updateStatus(room, status)"
                    >
                      <v-list-item-title>
                        Mark as {{ status }}
                      </v-list-item-title>
                    </v-list-item>
                    <v-divider />
                    <v-list-item
                      color="error"
                      @click="confirmDelete(room)"
                    >
                      <v-list-item-title>
                        Delete
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          {{ editedId ? 'Edit Room' : 'New Room' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" @submit.prevent="save">
            <v-text-field
              v-model="editedItem.room_number"
              label="Room Number"
              :rules="[v => !!v || 'Required', v => /^\d{6}$/.test(v) || 'Must be 6 digits']"
              required
            />
            <v-select
              v-model="editedItem.status"
              :items="availableStatuses"
              label="Status"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="error" variant="text" @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" variant="text" @click="save">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title>Delete Room</v-card-title>
        <v-card-text>
          Are you sure you want to delete this room?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="error" variant="text" @click="deleteDialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" variant="text" @click="deleteConfirmed">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import type { Room } from '~/types'

const { rooms, loading, error, statusFilter, fetchRooms, createRoom, updateRoom, updateRoomStatus, deleteRoom } = useRooms()

// Add loading indicator
watch(loading, (newValue) => {
  console.log('Loading state:', newValue)
})

// Add data watcher
watch(rooms, (newValue) => {
  console.log('Rooms updated:', newValue)
}, { deep: true })

const dialog = ref(false)
const deleteDialog = ref(false)
const editedId = ref<number | null>(null)
const editedItem = ref<Partial<Room>>({
  room_number: '',
  status: 'ready'
})
const roomToDelete = ref<number | null>(null)

const availableStatuses = ['ready', 'pending_cleanup', 'reserved'] as const
const statusOptions = [
  { title: 'All Rooms', value: 'all' },
  { title: 'Ready', value: 'ready' },
  { title: 'Pending Cleanup', value: 'pending_cleanup' },
  { title: 'Reserved', value: 'reserved' }
]

onMounted(async () => {
  console.log('Component mounted')
  await fetchRooms()
  console.log('Rooms after fetch:', rooms.value)
})

function getStatusColor(status: Room['status']) {
  switch (status) {
    case 'ready': return 'success'
    case 'pending_cleanup': return 'warning'
    case 'reserved': return 'info'
    default: return 'grey'
  }
}

function editRoom(room: Room) {
  editedId.value = room.id
  editedItem.value = { ...room }
  dialog.value = true
}

function confirmDelete(room: Room) {
  roomToDelete.value = room.id
  deleteDialog.value = true
}

async function updateStatus(room: Room, status: Room['status']) {
  try {
    await updateRoomStatus(room.id, status)
  } catch (e) {
    console.error(e)
  }
}

async function deleteConfirmed() {
  if (roomToDelete.value) {
    await deleteRoom(roomToDelete.value)
    deleteDialog.value = false
    roomToDelete.value = null
  }
}

async function save() {
  try {
    if (editedId.value) {
      await updateRoom(editedId.value, editedItem.value)
    } else {
      await createRoom(editedItem.value as Omit<Room, 'id' | 'created_at' | 'updated_at'>)
    }
    dialog.value = false
    editedId.value = null
    editedItem.value = { room_number: '', status: 'ready' }
  } catch (e) {
    console.error(e)
  }
}
</script> 