import type { Reservation } from '~/types'
import { useLocalStorage } from '@vueuse/core'

interface ReservationResponse {
  success: boolean
  data: {
    data: Reservation[]
    meta: {
      total: number
      current_page: number
      last_page: number
      per_page: number
    }
  }
  message: string
}

export function useReservations() {
  const reservations = ref<Reservation[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const sortedReservations = computed(() => {
    return [...reservations.value].sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
  })

  async function fetchReservations() {
    loading.value = true
    error.value = null
    try {
      const response = await useApi<ReservationResponse>('/reservations')
      if (response.data.value?.success) {
        reservations.value = response.data.value.data.data
      }
    } catch (err) {
      error.value = 'Failed to load reservations'
      console.error('Error fetching reservations:', err)
    } finally {
      loading.value = false
    }
  }

  async function createReservation(reservation: Omit<Reservation, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error: createError } = await useApi<{ data: Reservation }>('/reservations', {
        method: 'POST',
        body: {
            guest_id: reservation.guest_id,
            room_id: reservation.room_id,
            check_in: reservation.check_in_date,     // Map to DB column name
            check_out: reservation.check_out_date    // Map to DB column name
        }
    })
    
    if (createError.value) {
        throw new Error('Failed to create reservation')
    }
    
    await fetchReservations()
    return data.value?.data
  }

  async function updateReservation(id: number, reservation: Partial<Reservation>) {
    const { error: updateError } = await useApi<Reservation>(`/reservations/${id}`, {
      method: 'PUT',
      body: reservation
    })
    
    if (updateError.value) {
      throw new Error('Failed to update reservation')
    }
    
    await fetchReservations()
  }

  async function deleteReservation(id: number) {
    const { error: deleteError } = await useApi(`/reservations/${id}`, {
      method: 'DELETE'
    })
    
    if (deleteError.value) {
      throw new Error('Failed to delete reservation')
    }
    
    await fetchReservations()
  }

  return {
    reservations: sortedReservations,
    loading,
    error,
    fetchReservations,
    createReservation,
    updateReservation,
    deleteReservation
  }
} 