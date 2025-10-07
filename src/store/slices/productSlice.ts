import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface ProductVariant {
  id: string
  name: string
  battery_capacity: string
  range_km: number
  top_speed_kmh: number
  acceleration_sec: number
  price: number
  is_new: boolean
  is_active: boolean
}

export interface ProductColor {
  id: string
  name: string
  color_code: string
  css_filter: string
}

export interface ProductImage {
  id: string
  image_url: string
  alt_text: string
  display_order: number
  is_primary: boolean
}

export interface ProductSpecification {
  id: string
  spec_name: string
  spec_value: string
  spec_unit?: string
  display_order: number
}

export interface ProductFeature {
  id: string
  feature_name: string
  feature_description?: string
  display_order: number
}

export interface Accessory {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  is_active: boolean
  type?: 'addon' | 'insurance' | 'accessory'
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  category: 'scooter' | 'bike' | 'accessory'
  base_price: number
  original_price?: number
  is_active: boolean
  is_featured: boolean
  rating: number
  review_count: number
  variants: ProductVariant[]
  colors: ProductColor[]
  images: ProductImage[]
  specifications: ProductSpecification[]
  features: ProductFeature[]
  created_at: string
  updated_at: string
}

export interface ProductState {
  products: Product[]
  filteredProducts: Product[]
  categories: string[]
  isLoading: boolean
  error: string | null
  selectedProduct: Product | null
  accessories: Accessory[]
  filters: {
    category: string
    priceRange: [number, number]
    inStock: boolean
    rating: number
  }
}

const initialState: ProductState = {
  products: [],
  filteredProducts: [],
  categories: ['scooter', 'bike', 'accessory'],
  isLoading: false,
  error: null,
  selectedProduct: null,
  accessories: [],
  filters: {
    category: '',
    priceRange: [0, 100000],
    inStock: false,
    rating: 0,
  },
}

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const API_BASE_URL = process.env.NODE_ENV === 'production' 
        ? 'https://riqueza-backend.vercel.app/api'
        : 'http://localhost:5000/api'
      const response = await fetch(`${API_BASE_URL}/products`)
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      return data.data
    } catch (error) {
      return rejectWithValue('Failed to fetch products')
    }
  }
)

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: string, { rejectWithValue }) => {
    try {
      const API_BASE_URL = process.env.NODE_ENV === 'production' 
        ? 'https://riqueza-backend.vercel.app/api'
        : 'http://localhost:5000/api'
      const response = await fetch(`${API_BASE_URL}/products/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch product')
      }
      const data = await response.json()
      return data.data
    } catch (error) {
      return rejectWithValue('Failed to fetch product')
    }
  }
)

export const fetchProductBySlug = createAsyncThunk(
  'products/fetchProductBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      const API_BASE_URL = process.env.NODE_ENV === 'production' 
        ? 'https://riqueza-backend.vercel.app/api'
        : 'http://localhost:5000/api'
      const response = await fetch(`${API_BASE_URL}/products/slug/${slug}`)
      if (!response.ok) {
        throw new Error('Failed to fetch product')
      }
      const data = await response.json()
      return data.data
    } catch (error) {
      return rejectWithValue('Failed to fetch product')
    }
  }
)

export const fetchAccessories = createAsyncThunk(
  'products/fetchAccessories',
  async (_, { rejectWithValue }) => {
    try {
      const API_BASE_URL = process.env.NODE_ENV === 'production' 
        ? 'https://riqueza-backend.vercel.app/api'
        : 'http://localhost:5000/api'
      const response = await fetch(`${API_BASE_URL}/products/accessories/all`)
      if (!response.ok) {
        throw new Error('Failed to fetch accessories')
      }
      const data = await response.json()
      return data.data
    } catch (error) {
      return rejectWithValue('Failed to fetch accessories')
    }
  }
)

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<ProductState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
    filterProducts: (state) => {
      let filtered = state.products
      
      if (state.filters.category) {
        filtered = filtered.filter(product => product.category === state.filters.category)
      }
      
      if (state.filters.inStock) {
        filtered = filtered.filter(product => product.is_active)
      }
      
      if (state.filters.rating > 0) {
        filtered = filtered.filter(product => product.rating >= state.filters.rating)
      }
      
      filtered = filtered.filter(product => 
        product.base_price >= state.filters.priceRange[0] && 
        product.base_price <= state.filters.priceRange[1]
      )
      
      state.filteredProducts = filtered
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.products = action.payload
        state.filteredProducts = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedProduct = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchProductBySlug.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedProduct = action.payload
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchAccessories.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAccessories.fulfilled, (state, action) => {
        state.isLoading = false
        state.accessories = action.payload
      })
      .addCase(fetchAccessories.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setSelectedProduct, setFilters, clearFilters, filterProducts } = productSlice.actions
export default productSlice.reducer
