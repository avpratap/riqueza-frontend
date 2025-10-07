// Simple user storage system (in production, use a database)
interface User {
  id: string
  name: string
  phone: string
  email?: string
  role: 'user' | 'admin'
  isVerified: boolean
  createdAt: string
}

// In-memory storage (in production, use Redis or database)
const userStorage = new Map<string, User>()

// Generate unique user ID
const generateUserId = (): string => {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

// Create a new user
export const createUser = (phone: string, name: string, email?: string): User => {
  const user: User = {
    id: generateUserId(),
    name,
    phone,
    email,
    role: 'user',
    isVerified: true,
    createdAt: new Date().toISOString()
  }
  
  userStorage.set(phone, user)
  return user
}

// Find user by phone number
export const findUserByPhone = (phone: string): User | null => {
  return userStorage.get(phone) || null
}

// Check if user exists
export const userExists = (phone: string): boolean => {
  return userStorage.has(phone)
}

// Get all users (for debugging)
export const getAllUsers = (): User[] => {
  return Array.from(userStorage.values())
}

// Update user
export const updateUser = (phone: string, updates: Partial<User>): User | null => {
  const user = userStorage.get(phone)
  if (!user) return null
  
  const updatedUser = { ...user, ...updates }
  userStorage.set(phone, updatedUser)
  return updatedUser
}
