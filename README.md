# Riqueza Electric - Frontend Application

A modern, responsive frontend application for Riqueza Electric using React, Next.js, TypeScript, Tailwind CSS, and Redux Toolkit.

## 🚀 Features

- **Modern Tech Stack**: Built with React 18, Next.js 14, TypeScript, and Tailwind CSS
- **State Management**: Redux Toolkit for efficient state management
- **Responsive Design**: Mobile-first responsive design with Tailwind CSS
- **Animations**: Smooth animations using Framer Motion
- **Performance**: Optimized for performance with Next.js features
- **Type Safety**: Full TypeScript support for better development experience
- **Component Library**: Reusable UI components with consistent design system

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Redux Toolkit + React Redux
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Build Tool**: Next.js built-in bundler
- **Package Manager**: npm

## 📁 Project Structure

```
ola-electric-clone/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css        # Global styles and Tailwind imports
│   │   ├── layout.tsx         # Root layout with Redux provider
│   │   └── page.tsx           # Homepage component
│   ├── components/             # Reusable UI components
│   │   ├── layout/            # Layout components
│   │   │   ├── Header.tsx     # Main navigation header
│   │   │   └── Footer.tsx     # Site footer
│   │   └── sections/          # Page sections
│   │       ├── Hero.tsx       # Hero section with carousel
│   │       ├── Features.tsx   # Features showcase
│   │       ├── Products.tsx   # Product grid with filtering
│   │       ├── Testimonials.tsx # Customer testimonials
│   │       └── Contact.tsx    # Contact form and info
│   ├── store/                 # Redux store configuration
│   │   ├── provider.tsx       # Redux provider component
│   │   ├── store.ts           # Main store configuration
│   │   └── slices/            # Redux slices
│   │       ├── authSlice.ts   # Authentication state
│   │       ├── productSlice.ts # Product management
│   │       ├── cartSlice.ts   # Shopping cart
│   │       ├── uiSlice.ts     # UI state management
│   │       └── bookingSlice.ts # Booking management
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts           # Common interfaces and types
│   ├── utils/                 # Utility functions
│   │   └── index.ts           # Helper functions and formatters
│   └── hooks/                 # Custom React hooks
│       └── useLocalStorage.ts # Local storage hook
├── public/                    # Static assets
├── package.json               # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── next.config.js            # Next.js configuration
└── README.md                 # Project documentation
```

## 🎨 Design System

### Colors
- **Primary**: Blue shades (#0ea5e9 to #0c4a6e)
- **Secondary**: Gray shades (#f8fafc to #0f172a)
- **Accent**: Yellow/Orange shades (#fefce8 to #713f12)
- **Success**: Green shades (#f0fdf4 to #14532d)
- **Error**: Red shades (#fef2f2 to #7f1d1d)

### Typography
- **Primary Font**: Inter (body text)
- **Display Font**: Poppins (headings)

### Components
- **Buttons**: Primary, Secondary, Outline variants
- **Cards**: Consistent card design with hover effects
- **Forms**: Styled form inputs with focus states
- **Navigation**: Responsive navigation with mobile menu

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ola-electric-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 📱 Features Overview

### 🏠 Homepage
- **Hero Section**: Animated carousel with compelling messaging
- **Features**: Key benefits and features showcase
- **Products**: Featured products with filtering
- **Testimonials**: Customer reviews and ratings
- **Contact**: Contact form and company information

### 🛍️ Product Management
- Product catalog with categories
- Advanced filtering and search
- Product details and specifications
- Shopping cart functionality
- Wishlist management

### 🔐 Authentication
- User registration and login
- Profile management
- Order history
- Saved preferences

### 📅 Booking System
- Test ride bookings
- Service appointments
- Consultation scheduling
- Booking management

### 🛒 Shopping Cart
- Add/remove products
- Quantity management
- Price calculations
- Checkout process

## 🎯 Key Components

### Header Component
- Responsive navigation
- User authentication status
- Shopping cart indicator
- Mobile menu toggle

### Hero Section
- Auto-rotating carousel
- Call-to-action buttons
- Animated statistics
- Responsive design

### Product Grid
- Category filtering
- Product cards with hover effects
- Quick actions (view, add to cart)
- Responsive grid layout

### Contact Form
- Multi-field contact form
- Form validation
- Submission handling
- Success/error states

## 🔧 Configuration

### Tailwind CSS
Custom configuration with:
- Extended color palette
- Custom animations
- Responsive breakpoints
- Component utilities

### Redux Store
Organized into slices:
- **Auth**: User authentication state
- **Products**: Product catalog and filtering
- **Cart**: Shopping cart management
- **UI**: Interface state (modals, loading, etc.)
- **Booking**: Appointment and test ride bookings

### TypeScript
- Strict type checking
- Path aliases for clean imports
- Comprehensive type definitions
- Interface-driven development

## 📱 Responsive Design

- **Mobile First**: Designed for mobile devices first
- **Breakpoints**: Tailwind's responsive breakpoints
- **Touch Friendly**: Optimized for touch interactions
- **Performance**: Optimized images and animations

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for theme changes
- Update `src/app/globals.css` for global styles
- Component-specific styles in individual components

### Content
- Update product data in Redux slices
- Modify testimonials and features
- Customize contact information
- Update navigation links

### Branding
- Replace logo and brand colors
- Update typography preferences
- Customize component styles
- Modify color schemes

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically on push

### Deploy to Other Platforms
- **Netlify**: Use `npm run build` and deploy `out` folder
- **AWS S3**: Build and upload to S3 bucket
- **Custom Server**: Use `npm run start` for Node.js server

## 🔍 Performance Optimization

- **Image Optimization**: Next.js built-in image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components load when needed
- **Bundle Analysis**: Analyze bundle size with `@next/bundle-analyzer`

## 🧪 Testing

### Unit Testing
- Component testing with React Testing Library
- Redux slice testing
- Utility function testing

### Integration Testing
- User flow testing
- API integration testing
- Form submission testing

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Electric vehicle industry for inspiration
- Next.js team for the amazing framework
- Tailwind CSS team for the utility-first CSS framework
- Redux team for state management solutions

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ using modern web technologies**
