# Flipkart Clone

A full-stack e-commerce web application replicating Flipkart's design and functionality.

## Tech Stack
- Frontend: React.js (Vite), Tailwind CSS
- Backend: Node.js, Express.js
- Database: PostgreSQL with Prisma ORM
- Language: JavaScript

## Features
- Product listing with search and category filter
- Product detail page with image carousel
- Shopping cart (add, update quantity, remove)
- Checkout with address form
- Order placement and confirmation

## Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL running locally

### Backend
```bash
cd backend
npm install
# Create .env with DATABASE_URL
npx prisma migrate dev --name init
node prisma/seed.js
node src/index.js
# Runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
# Create .env with VITE_API_URL=http://localhost:5000
npm run dev
# Runs on http://localhost:5173
```

## Live Link
- Link: https://flipkart.princedev.in/

## Database Schema
- categories: product categories
- products: all product data with specs
- cart_items: session-based cart (no login needed)
- orders: placed orders with address
- order_items: individual items per order

## Assumptions
- Guest checkout is enabled and uses localStorage UUID as session ID
- Login/signup, wishlist, and order history are available as bonus features
- Free delivery on orders above ₹499
- Product images use public URLs with category-based fallback images for broken links
