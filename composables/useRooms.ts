import type { Room } from '~/types'
import { useLocalStorage } from '@vueuse/core'

interface RoomResponse {
  success: boolean
  data: {
    data: Room[]
    meta: {
      total: number
      current_page: number
      last_page: number
      per_page: number
    }
    statistics: {
      ready_rooms: number
      reserved_rooms: number
      pending_cleanup: number
    }
  }
  message: string
}

export function useRooms() {
  const rooms = ref<Room[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const statusFilter = useLocalStorage('roomStatusFilter', 'all')

  const filteredRooms = computed(() => {
    if (statusFilter.value === 'all') return rooms.value
    return rooms.value.filter(room => room.status === statusFilter.value)
  })

  async function fetchRooms() {
    loading.value = true
    error.value = null
    try {
      const response = await useApi<RoomResponse>('/rooms')
      if (response.data.value?.success) {
        rooms.value = response.data.value.data.data
      }
    } catch (err) {
      error.value = 'Failed to load rooms'
      console.error('Error fetching rooms:', err)
    } finally {
      loading.value = false
    }
  }

  async function createRoom(room: Omit<Room, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error: createError } = await useApi<Room>('/rooms', {
      method: 'POST',
      body: room
    })
    
    if (createError.value) {
      throw new Error('Failed to create room')
    }
    
    await fetchRooms()
    return data.value
  }

  async function updateRoom(id: number, room: Partial<Room>) {
    const { error: updateError } = await useApi<Room>(`/rooms/${id}`, {
      method: 'PUT',
      body: room
    })
    
    if (updateError.value) {
      throw new Error('Failed to update room')
    }
    
    await fetchRooms()
  }

  async function updateRoomStatus(id: number, status: Room['status']) {
    const { error: updateError } = await useApi<Room>(`/rooms/${id}/status`, {
      method: 'PATCH',
      body: { status }
    })
    
    if (updateError.value) {
      throw new Error('Failed to update room status')
    }
    
    await fetchRooms()
  }

  async function deleteRoom(id: number) {
    const { error: deleteError } = await useApi(`/rooms/${id}`, {
      method: 'DELETE'
    })
    
    if (deleteError.value) {
      throw new Error('Failed to delete room')
    }
    
    await fetchRooms()
  }

  return {
    rooms: filteredRooms,
    loading,
    error,
    statusFilter,
    fetchRooms,
    createRoom,
    updateRoom,
    updateRoomStatus,
    deleteRoom
  }
} 