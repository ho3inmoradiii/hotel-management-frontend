<template>
  <div>
    <v-card class="mb-4">
      <v-card-title class="d-flex align-center">
        Reservations
        <v-spacer />
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="dialog = true"
        >
          Add Reservation
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-table>
          <thead>
            <tr>
              <th>Guest</th>
              <th>Room</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="reservation in reservations" :key="reservation.id">
              <td>{{ reservation.guest?.first_name }} {{ reservation.guest?.last_name }}</td>
              <td>{{ reservation.room?.room_number }}</td>
              <td>{{ formatDate(reservation.check_in_date) }}</td>
              <td>{{ formatDate(reservation.check_out_date) }}</td>
              <td>{{ formatDate(reservation.updated_at) }}</td>
              <td>
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  @click="editReservation(reservation)"
                />
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  @click="confirmDelete(reservation)"
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
          {{ editedId ? 'Edit Reservation' : 'New Reservation' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" @submit.prevent="save">
            <v-select
              v-model="editedItem.guest_id"
              :items="guests"
              item-title="full_name"
              item-value="id"
              label="Guest"
              required
            />
            <v-select
              v-model="editedItem.room_id"
              :items="availableRooms"
              item-title="room_number"
              item-value="id"
              label="Room"
              required
            />
            <v-text-field
              v-model="editedItem.check_in_date"
              label="Check In Date"
              type="date"
              required
            />
            <v-text-field
              v-model="editedItem.check_out_date"
              label="Check Out Date"
              type="date"
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
        <v-card-title>Delete Reservation</v-card-title>
        <v-card-text>
          Are you sure you want to delete this reservation?
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
import type { Reservation, Guest, Room } from '~/types'

const { reservations, loading, error, fetchReservations, createReservation, updateReservation, deleteReservation } = useReservations()
const { guests, fetchGuests } = useGuests()
const { rooms: availableRooms, fetchRooms } = useRooms()

const dialog = ref(false)
const deleteDialog = ref(false)
const editedId = ref<number | null>(null)
const editedItem = ref<Partial<Reservation>>({
  guest_id: undefined,
  room_id: undefined,
  check_in_date: '',
  check_out_date: ''
})
const reservationToDelete = ref<number | null>(null)

onMounted(async () => {
  await Promise.all([
    fetchReservations(),
    fetchGuests(),
    fetchRooms()
  ])
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

function editReservation(reservation: Reservation) {
  editedId.value = reservation.id
  editedItem.value = {
    guest_id: reservation.guest_id,
    room_id: reservation.room_id,
    check_in_date: reservation.check_in_date,
    check_out_date: reservation.check_out_date
  }
  dialog.value = true
}

function confirmDelete(reservation: Reservation) {
  reservationToDelete.value = reservation.id
  deleteDialog.value = true
}

async function deleteConfirmed() {
  if (reservationToDelete.value) {
    await deleteReservation(reservationToDelete.value)
    deleteDialog.value = false
    reservationToDelete.value = null
  }
}

async function save() {
  try {
    if (editedId.value) {
      await updateReservation(editedId.value, editedItem.value)
    } else {
      await createReservation(editedItem.value as Omit<Reservation, 'id' | 'created_at' | 'updated_at'>)
    }
    dialog.value = false
    editedId.value = null
    editedItem.value = {
      guest_id: undefined,
      room_id: undefined,
      check_in_date: '',
      check_out_date: ''
    }
  } catch (e) {
    console.error(e)
  }
}
</script> 