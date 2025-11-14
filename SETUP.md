# E-commerce Setup and Testing Guide

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

## Quick Setup

### 1. Backend Setup
```bash
cd backend

# Install dependencies (already done)
npm install

# Setup environment variables
cp .env.example .env
# Edit .env file with your MongoDB URI and other settings

# Start MongoDB (if using local installation)
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Seed the database with sample data
node src/seedData.js

# Start the backend server
npm run dev
```

The backend will start on http://localhost:5000

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies (already done)
npm install

# Start the frontend development server
npm run dev
```

The frontend will start on http://localhost:3000

## Testing the Application

### 1. API Health Check
Visit: http://localhost:5000/api/health

Expected response:
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2025-11-15T..."
}
```

### 2. Test Authentication
```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User", 
    "email": "test@example.com",
    "password": "Test123456"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ecommerce.com",
    "password": "admin123"
  }'
```

### 3. Test Product Endpoints
```bash
# Get all products
curl http://localhost:5000/api/products

# Get categories
curl http://localhost:5000/api/categories

# Get featured products
curl http://localhost:5000/api/products/featured
```

## Pre-seeded Data

After running the seed script, you'll have:

### Users
- **Admin**: admin@ecommerce.com / admin123
- **User**: user@ecommerce.com / user123

### Categories
- Men
- Women  
- Kids
- Accessories

### Products
- Classic Cotton T-Shirt (Men)
- Denim Jeans (Men)
- Summer Dress (Women)
- Kids Rainbow T-Shirt (Kids)
- Leather Watch (Accessories)

## Available API Endpoints

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- GET `/api/auth/me` - Get current user
- PUT `/api/auth/profile` - Update profile
- POST `/api/auth/logout` - Logout

### Products
- GET `/api/products` - Get all products (with filtering)
- GET `/api/products/featured` - Get featured products
- GET `/api/products/:id` - Get single product
- POST `/api/products` - Create product (Admin only)
- PUT `/api/products/:id` - Update product (Admin only)
- DELETE `/api/products/:id` - Delete product (Admin only)
- POST `/api/products/:id/reviews` - Add review

### Categories
- GET `/api/categories` - Get all categories
- GET `/api/categories/:id` - Get single category
- POST `/api/categories` - Create category (Admin only)
- PUT `/api/categories/:id` - Update category (Admin only)
- DELETE `/api/categories/:id` - Delete category (Admin only)

### Shopping Cart
- GET `/api/cart` - Get user cart
- POST `/api/cart/add` - Add item to cart
- PUT `/api/cart/update` - Update cart item
- DELETE `/api/cart/remove` - Remove item from cart
- DELETE `/api/cart/clear` - Clear cart

### Orders
- POST `/api/orders` - Create new order
- GET `/api/orders` - Get user orders
- GET `/api/orders/:id` - Get single order
- PUT `/api/orders/:id/status` - Update order status (Admin)
- PUT `/api/orders/:id/pay` - Mark order as paid
- PUT `/api/orders/:id/cancel` - Cancel order

### Payment
- GET `/api/payment/config` - Get Stripe config
- POST `/api/payment/create-intent` - Create payment intent
- POST `/api/payment/confirm` - Confirm payment

### Users (Admin)
- GET `/api/users` - Get all users
- GET `/api/users/:id` - Get user by ID
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user
- GET `/api/users/admin/stats` - Get dashboard statistics

## Frontend Routes

- `/` - Home page
- `/products` - Product listing
- `/products/[id]` - Product details
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/orders` - Order history
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/profile` - User profile
- `/admin` - Admin dashboard (Admin only)

## Key Features Implemented

✅ **Backend Complete**:
- Express.js server with MongoDB
- JWT authentication with role-based access
- Complete product management system
- Shopping cart functionality
- Order processing system
- Payment integration ready (Stripe)
- File upload for product images
- Input validation and error handling
- Admin dashboard APIs

✅ **Frontend Foundation**:
- Next.js 14 with TypeScript
- Tailwind CSS for styling
- Zustand for state management
- Axios for API calls
- Authentication store setup

🔧 **To Complete** (Additional Features):
- Complete frontend components and pages
- Payment integration frontend
- Admin dashboard UI
- Product search and filters
- User profile management
- Order tracking
- Email notifications
- Product reviews interface

## Development Commands

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `node src/seedData.js` - Seed database

### Frontend  
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Next Steps

1. **Start MongoDB** and run the seed script
2. **Start both servers** (backend and frontend)
3. **Test API endpoints** using curl or Postman
4. **Access the frontend** and verify the homepage loads
5. **Continue building** frontend components and pages

The foundation is complete and ready for further development!