export interface Guest {
    id: number
    first_name: string
    last_name: string
    created_at: string
    updated_at: string
  }
  
  export interface Room {
    id: number
    room_number: string
    status: 'ready' | 'pending_cleanup' | 'reserved'
    created_at: string
    updated_at: string
  }
  
  export interface Reservation {
    id: number
    guest_id: number
    room_id: number
    guest?: Guest
    room?: Room
    check_in_date: string
    check_out_date: string
    created_at: string
    updated_at: string
  }