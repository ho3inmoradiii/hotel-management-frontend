<template>
  <div>
    <v-card class="mb-4">
      <v-card-title class="d-flex align-center">
        Guests
        <v-spacer />
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="dialog = true"
        >
          Add Guest
        </v-btn>
      </v-card-title>


      <v-card-text>
        <v-table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="guest in guests" :key="guest.id">
              <td>{{ guest.first_name }}</td>
              <td>{{ guest.last_name }}</td>
              <td>
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  @click="editGuest(guest)"
                />
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  @click="confirmDelete(guest)"
                />
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
          {{ editedId ? 'Edit Guest' : 'New Guest' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" @submit.prevent="save">
            <v-text-field
              v-model="editedItem.first_name"
              label="First Name"
              required
            />
            <v-text-field
              v-model="editedItem.last_name"
              label="Last Name"
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
        <v-card-title>Delete Guest</v-card-title>
        <v-card-text>
          Are you sure you want to delete this guest?
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
import type { Guest } from '~/types'

const { guests, loading, error, fetchGuests, createGuest, updateGuest, deleteGuest } = useGuests()

const dialog = ref(false)
const deleteDialog = ref(false)
const editedId = ref<number | null>(null)
const editedItem = ref<Partial<Guest>>({
  first_name: '',
  last_name: ''
})
const guestToDelete = ref<number | null>(null)

onMounted(async   () => {
  console.log('Component mounted')
  await fetchGuests()
  console.log('Guests after fetch:', guests.value)
})

function editGuest(guest: Guest) {
  editedId.value = guest.id
  editedItem.value = { ...guest }
  dialog.value = true
}

function confirmDelete(guest: Guest) {
  guestToDelete.value = guest.id
  deleteDialog.value = true
}

async function deleteConfirmed() {
  if (guestToDelete.value) {
    await deleteGuest(guestToDelete.value)
    deleteDialog.value = false
    guestToDelete.value = null
  }
}

async function save() {
  try {
    if (editedId.value) {
      await updateGuest(editedId.value, editedItem.value)
    } else {
      await createGuest(editedItem.value as Omit<Guest, 'id' | 'created_at' | 'updated_at'>)
    }
    dialog.value = false
    editedId.value = null
    editedItem.value = { first_name: '', last_name: '' }
  } catch (e) {
    // Handle error (could add a snackbar here)
    console.error(e)
  }
}
</script> 

<style scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>