// Common types used across the application
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Form types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'tel' | 'textarea' | 'select' | 'date' | 'time'
  placeholder?: string
  required?: boolean
  options?: Array<{ value: string; label: string }>
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    custom?: (value: any) => string | undefined
  }
}

// Navigation types
export interface NavigationItem {
  id: string
  label: string
  href: string
  icon?: string
  children?: NavigationItem[]
  external?: boolean
}

// SEO types
export interface SeoData {
  title: string
  description: string
  keywords: string[]
  ogImage?: string
  canonical?: string
}

// Animation types
export interface AnimationProps {
  initial?: any
  animate?: any
  exit?: any
  transition?: any
  variants?: any
}

// Theme types
export interface Theme {
  name: 'light' | 'dark'
  colors: {
    primary: string
    secondary: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    error: string
    success: string
    warning: string
  }
}

// Breakpoint types
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

// Responsive types
export interface ResponsiveValue<T> {
  xs?: T
  sm?: T
  md?: T
  lg?: T
  xl?: T
  '2xl'?: T
}

// Event types
export interface AppEvent {
  type: string
  payload: any
  timestamp: number
}

// Error types
export interface AppError {
  code: string
  message: string
  details?: any
  stack?: string
}

// Loading states
export interface LoadingState {
  isLoading: boolean
  error: string | null
  retry?: () => void
}

// Filter types
export interface FilterOption {
  value: string
  label: string
  count?: number
  disabled?: boolean
}

export interface FilterGroup {
  name: string
  label: string
  type: 'checkbox' | 'radio' | 'range' | 'select'
  options?: FilterOption[]
  min?: number
  max?: number
  step?: number
}

// Sort types
export interface SortOption {
  value: string
  label: string
  direction: 'asc' | 'desc'
}

// Search types
export interface SearchResult<T> {
  item: T
  score: number
  highlights: Array<{
    field: string
    snippet: string
  }>
}

export interface SearchParams {
  query: string
  filters?: Record<string, any>
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}
