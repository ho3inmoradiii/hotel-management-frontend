import type { Guest } from '~/types'

export function useGuests() {
  const guests = ref<Guest[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  async function fetchGuests() {
   loading.value = true
   error.value = null
   console.log('Fetching guests...')
   try {
     const response = await useApi<{ data: Guest[] }>('/guests')
     console.log('API Response:', response)
     
     if (response.data.value?.data) {
       guests.value = response.data.value.data
       console.log('Updated guests:', guests.value)
     }
   } catch (err) {
     error.value = 'Failed to load guests'
     console.error('Error fetching guests:', err)
   } finally {
     loading.value = false
   }
 }

  async function createGuest(guest: Omit<Guest, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error: createError } = await useApi<{ data: Guest }>('/guests', {
      method: 'POST',
      body: guest
    })
    
    if (createError.value) {
      throw new Error('Failed to create guest')
    }
    
    await fetchGuests()
    return data.value?.data
  }

  async function updateGuest(id: number, guest: Partial<Guest>) {
    const { error: updateError } = await useApi<{ data: Guest }>(`/guests/${id}`, {
      method: 'PUT',
      body: guest
    })
    
    if (updateError.value) {
      throw new Error('Failed to update guest')
    }
    
    await fetchGuests()
  }

  async function deleteGuest(id: number) {
    const { error: deleteError } = await useApi(`/guests/${id}`, {
      method: 'DELETE'
    })
    
    if (deleteError.value) {
      throw new Error('Failed to delete guest')
    }
    
    await fetchGuests()
  }

  return {
    guests,
    loading,
    error,
    fetchGuests,
    createGuest,
    updateGuest,
    deleteGuest
  }
}