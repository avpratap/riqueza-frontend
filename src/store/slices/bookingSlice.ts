import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface Booking {
  id: string
  type: 'test-ride' | 'service' | 'consultation'
  productId?: string
  customerName: string
  customerEmail: string
  customerPhone: string
  preferredDate: string
  preferredTime: string
  location: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface BookingState {
  bookings: Booking[]
  currentBooking: Booking | null
  isLoading: boolean
  error: string | null
  availableSlots: Array<{
    date: string
    slots: string[]
  }>
}

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,
  availableSlots: [],
}

export const createBooking = createAsyncThunk(
  'booking/create',
  async (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      // Simulate API call
      const newBooking: Booking = {
        ...bookingData,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      return newBooking
    } catch (error) {
      return rejectWithValue('Failed to create booking')
    }
  }
)

export const fetchBookings = createAsyncThunk(
  'booking/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call
      const mockBookings: Booking[] = [
        {
          id: '1',
          type: 'test-ride',
          productId: '1',
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          customerPhone: '+91 98765 43210',
          preferredDate: '2024-01-15',
          preferredTime: '10:00 AM',
          location: 'Mumbai, Maharashtra',
          status: 'confirmed',
          notes: 'Interested in Ola S1 Pro',
          createdAt: '2024-01-10T10:00:00Z',
          updatedAt: '2024-01-10T10:00:00Z',
        },
      ]
      
      await new Promise(resolve => setTimeout(resolve, 800))
      return mockBookings
    } catch (error) {
      return rejectWithValue('Failed to fetch bookings')
    }
  }
)

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setCurrentBooking: (state, action: PayloadAction<Booking | null>) => {
      state.currentBooking = action.payload
    },
    
    updateBookingStatus: (state, action: PayloadAction<{ id: string; status: Booking['status'] }>) => {
      const booking = state.bookings.find(b => b.id === action.payload.id)
      if (booking) {
        booking.status = action.payload.status
        booking.updatedAt = new Date().toISOString()
      }
    },
    
    setAvailableSlots: (state, action: PayloadAction<BookingState['availableSlots']>) => {
      state.availableSlots = action.payload
    },
    
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false
        state.bookings.push(action.payload)
        state.currentBooking = action.payload
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchBookings.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.isLoading = false
        state.bookings = action.payload
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { 
  setCurrentBooking, 
  updateBookingStatus, 
  setAvailableSlots, 
  clearError 
} = bookingSlice.actions

export default bookingSlice.reducer
