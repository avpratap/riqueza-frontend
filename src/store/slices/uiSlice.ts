import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UIState {
  isMobileMenuOpen: boolean
  isSearchOpen: boolean
  isFilterOpen: boolean
  isLoading: boolean
  activeModal: string | null
  isAuthModalOpen: boolean
  authModalMode: 'login' | 'signup'
  isBuyNowModalOpen: boolean
  isCartOpen: boolean
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    duration?: number
  }>
  scrollPosition: number
  theme: 'light' | 'dark'
}

const initialState: UIState = {
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isFilterOpen: false,
  isLoading: false,
  activeModal: null,
  isAuthModalOpen: false,
  authModalMode: 'login',
  isBuyNowModalOpen: false,
  isCartOpen: false,
  notifications: [],
  scrollPosition: 0,
  theme: 'light',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen
    },
    
    closeMobileMenu: (state) => {
      state.isMobileMenuOpen = false
    },
    
    toggleSearch: (state) => {
      state.isSearchOpen = !state.isSearchOpen
    },
    
    closeSearch: (state) => {
      state.isSearchOpen = false
    },
    
    toggleFilter: (state) => {
      state.isFilterOpen = !state.isFilterOpen
    },
    
    closeFilter: (state) => {
      state.isFilterOpen = false
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    
    openModal: (state, action: PayloadAction<string>) => {
      state.activeModal = action.payload
    },
    
    closeModal: (state) => {
      state.activeModal = null
    },
    
    setAuthModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAuthModalOpen = action.payload
    },
    
    setAuthModalMode: (state, action: PayloadAction<'login' | 'signup'>) => {
      state.authModalMode = action.payload
    },
    
    addNotification: (state, action: PayloadAction<Omit<UIState['notifications'][0], 'id'>>) => {
      const id = Date.now().toString()
      state.notifications.push({ ...action.payload, id })
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(notification => notification.id !== action.payload)
    },
    
    setScrollPosition: (state, action: PayloadAction<number>) => {
      state.scrollPosition = action.payload
    },
    
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
    
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
    },
    
    openBuyNowModal: (state) => {
      state.isBuyNowModalOpen = true
    },
    
    closeBuyNowModal: (state) => {
      state.isBuyNowModalOpen = false
    },
    
    openCart: (state) => {
      state.isCartOpen = true
    },
    
    closeCart: (state) => {
      state.isCartOpen = false
    },
    
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen
    },
  },
})

export const {
  toggleMobileMenu,
  closeMobileMenu,
  toggleSearch,
  closeSearch,
  toggleFilter,
  closeFilter,
  setLoading,
  openModal,
  closeModal,
  setAuthModalOpen,
  setAuthModalMode,
  addNotification,
  removeNotification,
  setScrollPosition,
  toggleTheme,
  setTheme,
  openBuyNowModal,
  closeBuyNowModal,
  openCart,
  closeCart,
  toggleCart,
} = uiSlice.actions

export default uiSlice.reducer
