# Electric Vehicle Project - Complete Overview

## 🚀 Project Architecture

This is a full-stack electric vehicle e-commerce platform with the following components:

### Frontend (Next.js 14)
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Authentication**: Firebase + Custom JWT
- **UI Components**: Custom components with Framer Motion animations
- **Port**: 3000

### Backend (Node.js/Express)
- **Framework**: Express.js with Node.js
- **Database**: PostgreSQL (Render Cloud)
- **Authentication**: JWT + OTP SMS (Twilio)
- **Port**: 5000

## 📊 Database Schema (Render PostgreSQL)

### Core Tables Created:

#### 1. **users** table
```sql
- id (UUID, Primary Key)
- phone (VARCHAR, Unique)
- name (VARCHAR)
- email (VARCHAR)
- role (VARCHAR, Default: 'user')
- is_verified (BOOLEAN, Default: true)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 2. **otps** table
```sql
- id (SERIAL, Primary Key)
- phone_number (VARCHAR)
- otp (VARCHAR)
- verification_id (VARCHAR, Unique)
- expires_at (TIMESTAMP)
- is_used (BOOLEAN, Default: false)
- created_at (TIMESTAMP)
```

#### 3. **products** table
```sql
- id (UUID, Primary Key)
- name (VARCHAR)
- slug (VARCHAR, Unique)
- description (TEXT)
- category (VARCHAR, Default: 'scooter')
- base_price (DECIMAL)
- original_price (DECIMAL)
- is_active (BOOLEAN, Default: true)
- is_featured (BOOLEAN, Default: false)
- rating (DECIMAL)
- review_count (INTEGER)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 4. **product_variants** table
```sql
- id (UUID, Primary Key)
- product_id (UUID, Foreign Key)
- name (VARCHAR)
- battery_capacity (VARCHAR)
- range_km (INTEGER)
- top_speed_kmh (INTEGER)
- acceleration_sec (DECIMAL)
- price (DECIMAL)
- is_new (BOOLEAN, Default: false)
- is_active (BOOLEAN, Default: true)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 5. **product_colors** table
```sql
- id (UUID, Primary Key)
- product_id (UUID, Foreign Key)
- name (VARCHAR)
- color_code (VARCHAR)
- css_filter (VARCHAR)
- is_active (BOOLEAN, Default: true)
- created_at (TIMESTAMP)
```

#### 6. **product_images** table
```sql
- id (UUID, Primary Key)
- product_id (UUID, Foreign Key)
- variant_id (UUID, Foreign Key)
- color_id (UUID, Foreign Key)
- image_url (TEXT)
- alt_text (VARCHAR)
- display_order (INTEGER, Default: 0)
- is_primary (BOOLEAN, Default: false)
- created_at (TIMESTAMP)
```

#### 7. **product_specifications** table
```sql
- id (UUID, Primary Key)
- product_id (UUID, Foreign Key)
- variant_id (UUID, Foreign Key)
- spec_name (VARCHAR)
- spec_value (VARCHAR)
- spec_unit (VARCHAR)
- display_order (INTEGER, Default: 0)
- created_at (TIMESTAMP)
```

#### 8. **product_features** table
```sql
- id (UUID, Primary Key)
- product_id (UUID, Foreign Key)
- feature_name (VARCHAR)
- feature_description (TEXT)
- display_order (INTEGER, Default: 0)
- created_at (TIMESTAMP)
```

#### 9. **accessories** table
```sql
- id (UUID, Primary Key)
- name (VARCHAR)
- description (TEXT)
- price (DECIMAL)
- image_url (TEXT)
- is_active (BOOLEAN, Default: true)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🔧 Backend API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /send-otp` - Send OTP to phone number
- `POST /verify-otp` - Verify OTP and login/register
- `GET /profile` - Get user profile (Protected)
- `PUT /profile` - Update user profile (Protected)

### Product Routes (`/api/products`)
- `GET /` - Get all products with variants, colors, images
- `GET /:id` - Get product by ID
- `GET /slug/:slug` - Get product by slug
- `GET /featured` - Get featured products
- `GET /category/:category` - Get products by category

### Accessories Routes (`/api/accessories`)
- `GET /` - Get all accessories

## 🎨 Frontend Components Structure

### Layout Components
- **Header**: Navigation with auth modal trigger
- **Footer**: Company information and links
- **AuthModal**: Login/signup modal with OTP verification

### Section Components
- **Hero**: Main banner with CTA
- **Products**: Product showcase with filtering
- **Features**: Key features highlight
- **EVCalculator**: Cost savings calculator
- **Testimonials**: Customer reviews
- **Contact**: Contact form

### Product Components
- **ProductCard**: Individual product display
- **ProductHero**: Product detail banner
- **ProductSpecs**: Technical specifications
- **ProductCustomization**: Variant/color selection
- **ComparisonTable**: Product comparison

### Modal Components
- **BuyNowModal**: Purchase flow
- **CartModal**: Shopping cart
- **ComparisonModal**: Product comparison
- **DeliveryModal**: Delivery options
- **InsuranceModal**: Insurance options
- **AddOnsModal**: Accessories selection

## 🔐 Authentication Flow

1. **User enters phone number** → Frontend calls `/api/auth/send-otp`
2. **Backend sends SMS via Twilio** → OTP stored in database
3. **User enters OTP** → Frontend calls `/api/auth/verify-otp`
4. **Backend verifies OTP** → Returns JWT token
5. **Frontend stores token** → User authenticated

## 🛒 Shopping Flow

1. **Browse Products** → Product listing with filters
2. **Product Details** → Detailed view with variants/colors
3. **Add to Cart** → Cart state management
4. **Checkout** → Purchase flow with add-ons
5. **Order Confirmation** → Success page

## 📱 State Management (Redux)

### Slices:
- **authSlice**: User authentication state
- **productSlice**: Product data and filters
- **cartSlice**: Shopping cart state
- **uiSlice**: Modal states and UI controls
- **bookingSlice**: Booking/order state

## 🎯 Key Features

### Frontend Features:
- ✅ Responsive design (mobile-first)
- ✅ Product catalog with filtering
- ✅ Shopping cart functionality
- ✅ User authentication (OTP-based)
- ✅ Product comparison
- ✅ Cost calculator
- ✅ Modern UI with animations
- ✅ SEO optimized

### Backend Features:
- ✅ RESTful API design
- ✅ JWT authentication
- ✅ SMS OTP verification
- ✅ Database relationships
- ✅ Error handling
- ✅ CORS configuration
- ✅ Environment configuration

## 🚀 Deployment Status

### Database (Render PostgreSQL):
- ✅ Connected to Render PostgreSQL
- ✅ All tables created successfully
- ✅ Sample data inserted
- ✅ Indexes created for performance
- ✅ Foreign key relationships established

### Backend Server:
- ✅ Running on port 5000
- ✅ Database connection verified
- ✅ API endpoints functional
- ✅ CORS configured for frontend

### Frontend Server:
- ✅ Running on port 3000
- ✅ Connected to backend API
- ✅ Redux store configured
- ✅ Authentication flow ready

## 🔧 Environment Configuration

### Backend (.env):
```env
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=your_database_host
DB_PORT=5432
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

## 📊 Sample Data

The database includes:
- **2 Products**: Riqueza S1 Pro+ and S1 Pro
- **8 Variants**: Different battery capacities (2kWh, 3kWh, 4kWh, 5.2kWh)
- **8 Colors**: Silver, Passion Red, Stellar Blue, Midnight Blue
- **12 Images**: Product photos with proper ordering
- **4 Accessories**: Floor mats, covers, and combos

## 🎉 Project Status: READY FOR DEVELOPMENT

Both frontend and backend are fully configured and running with:
- ✅ Database schema created in Render PostgreSQL
- ✅ Sample data populated
- ✅ API endpoints functional
- ✅ Frontend connected to backend
- ✅ Authentication system ready
- ✅ Complete e-commerce functionality

The project is now ready for further development and feature additions!
