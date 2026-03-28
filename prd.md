# PRD: Flipkart Clone — SDE Intern Assignment (Scaler AI Labs)

## Project Overview
Build a functional full-stack e-commerce web application replicating Flipkart's design and UX.
**Deadline:** Sunday, 29th March (hardstop)
**Submission:** GitHub (public repo) + Deployed link

---

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React.js (Vite) |
| Backend | Node.js + Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Styling | Tailwind CSS |
| Language | JavaScript (no TypeScript) |
| Deploy | Vercel (frontend) + Render (backend) |

---

## Database Schema

### Tables

```sql
-- Categories
categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
)

-- Products
products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),        -- for showing discount
  discount_percent INT DEFAULT 0,
  stock INT DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  rating_count INT DEFAULT 0,
  category_id INT REFERENCES categories(id),
  brand VARCHAR(100),
  images TEXT[],                        -- array of image URLs
  specifications JSONB,                 -- key-value specs
  created_at TIMESTAMP DEFAULT NOW()
)

-- Cart Items (session-based, no auth required)
cart_items (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,    -- random UUID stored in localStorage
  product_id INT REFERENCES products(id),
  quantity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
)

-- Orders
orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,  -- e.g. "OD123456789"
  session_id VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_charge DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'placed',
  created_at TIMESTAMP DEFAULT NOW()
)

-- Order Items
order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id),
  product_id INT REFERENCES products(id),
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,         -- price snapshot at order time
  created_at TIMESTAMP DEFAULT NOW()
)
```

---

## Folder Structure

```
flipkart-clone/
├── frontend/                        (React + Vite)
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx                  (routes setup)
│   │   ├── pages/
│   │   │   ├── Home.jsx             (Product Listing)
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   └── OrderSuccess.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── ImageCarousel.jsx
│   │   │   ├── CartItem.jsx
│   │   │   ├── CartSummary.jsx
│   │   │   ├── CategoryFilter.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── context/
│   │   │   └── CartContext.jsx      (global cart count state)
│   │   └── lib/
│   │       ├── api.js               (axios instance)
│   │       └── session.js           (UUID session helper)
│   ├── index.html
│   └── vite.config.js
│
├── backend/                         (Node + Express)
│   ├── src/
│   │   ├── index.js                 (entry point)
│   │   ├── routes/
│   │   │   ├── products.js
│   │   │   ├── categories.js
│   │   │   ├── cart.js
│   │   │   └── orders.js
│   │   ├── controllers/
│   │   │   ├── products.controller.js
│   │   │   ├── cart.controller.js
│   │   │   └── orders.controller.js
│   │   └── middleware/
│   │       └── errorHandler.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   └── .env
│
└── README.md
```

---

## API Endpoints

### Products
```
GET  /api/products                   - All products (?search=&category=&page=)
GET  /api/products/:id               - Single product
GET  /api/categories                 - All categories
```

### Cart
```
GET    /api/cart/:sessionId          - Get cart for session
POST   /api/cart                     - Add item { sessionId, productId, quantity }
PATCH  /api/cart/:id                 - Update quantity { quantity }
DELETE /api/cart/:id                 - Remove single item
DELETE /api/cart/clear/:sessionId    - Clear entire cart
```

### Orders
```
POST /api/orders                     - Place order
GET  /api/orders/:orderNumber        - Get order details
```

---

## Step-by-Step Build Order

---

### PHASE 1 — Backend: Setup + Database
**Step 1:** Create `backend/` folder
```bash
mkdir backend && cd backend
npm init -y
npm install express prisma @prisma/client cors dotenv
npx prisma init
```

**Step 2:** Write `prisma/schema.prisma` with all 5 models  
(Category, Product, CartItem, Order, OrderItem)

**Step 3:** Add `DATABASE_URL` in `.env`
```
DATABASE_URL="postgresql://user:password@localhost:5432/flipkart"
```

**Step 4:** Run migration
```bash
npx prisma migrate dev --name init
```

**Step 5:** Write `prisma/seed.js` — 5 categories + 30 products  
Run: `node prisma/seed.js`

**Step 6:** Setup `src/index.js` — Express server with CORS + JSON middleware  

✅ **TEST:** `node src/index.js` → server starts on port 5000  
✅ **TEST:** `npx prisma studio` → check data in browser

---

### PHASE 2 — Backend: Products + Categories API
**Step 7:** Build `routes/products.js` + `controllers/products.controller.js`
- GET all products with search (WHERE name ILIKE) + category filter
- GET single product by ID

**Step 8:** Build `routes/categories.js`
- GET all categories

**Step 9:** Register routes in `index.js`

✅ **TEST (use Thunder Client / Postman):**
- `GET /api/products` → returns array
- `GET /api/products?search=phone` → filtered
- `GET /api/products?category=1` → filtered
- `GET /api/products/1` → single product
- `GET /api/categories` → all categories

---

### PHASE 3 — Backend: Cart API
**Step 10:** Build `routes/cart.js` + `controllers/cart.controller.js`
- GET cart by sessionId (include product details)
- POST add to cart (check if already exists → update qty, else create)
- PATCH update quantity
- DELETE single item
- DELETE clear cart

✅ **TEST:**
- POST add item → check DB
- POST same item again → quantity increases
- PATCH update qty
- DELETE item
- DELETE clear all

---

### PHASE 4 — Backend: Orders API
**Step 11:** Build `routes/orders.js` + `controllers/orders.controller.js`
- POST place order:
  1. Generate order number: `"OD" + Date.now()`
  2. Create order record
  3. Create order_items for each cart item (store price snapshot)
  4. Clear cart for that sessionId
- GET order by orderNumber

✅ **TEST:**
- POST /api/orders with sessionId + address → order created
- GET /api/orders/OD... → order details returned
- Check cart is cleared after order

---

### PHASE 5 — Frontend: Setup
**Step 12:** Create React app with Vite
```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install axios react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Step 13:** Setup Tailwind in `index.css`

**Step 14:** Write `src/lib/session.js`
```js
// Generate UUID and store in localStorage
export function getSessionId() {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
}
```

**Step 15:** Write `src/lib/api.js`
```js
import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });
export default api;
```

**Step 16:** Setup React Router in `App.jsx` with routes:
- `/` → Home
- `/product/:id` → ProductDetail
- `/cart` → Cart
- `/checkout` → Checkout
- `/order-success` → OrderSuccess

**Step 17:** Create `CartContext.jsx` — stores cart count globally, functions to refresh count

✅ **TEST:** App loads, routes work, no errors in console

---

### PHASE 6 — Frontend: Navbar
**Step 18:** Build `Navbar.jsx`
- Blue background (#2874f0)
- "Flipkart" logo text (white, bold) on left
- Search bar in center (controlled input → updates URL param on Enter)
- Cart icon on right with red badge showing item count
- Links: Home, Cart

✅ **TEST:** Navbar renders, search input works, cart badge shows 0

---

### PHASE 7 — Frontend: Home Page (Product Listing)
**Step 19:** Build `CategoryFilter.jsx`
- Horizontal scrollable tabs
- "All" + one tab per category
- Active tab highlighted in blue

**Step 20:** Build `ProductCard.jsx` — Flipkart card style:
- Product image (fixed height)
- Product name (truncated to 2 lines)
- Yellow star rating + count
- Price (bold, black)
- Original price (grey, strikethrough)
- Discount % (green)
- "Free delivery" text (green, small)
- Clicking card → navigate to /product/:id

**Step 21:** Build `ProductGrid.jsx`
- 4-column grid on desktop, 2-column on mobile
- Maps over products array → renders ProductCard

**Step 22:** Build `Home.jsx`
- On mount: fetch categories + fetch products
- State: products, categories, selectedCategory, searchQuery, loading
- Pass search param from URL query string
- On category change → refetch products with category filter
- On search → refetch products with search filter

✅ **TEST:**
- Products load on page open
- Clicking category filters correctly
- Typing in search and pressing Enter filters
- Each card navigates to product page

---

### PHASE 8 — Frontend: Product Detail Page
**Step 23:** Build `ImageCarousel.jsx`
- Main large image display
- Row of thumbnail images below
- Clicking thumbnail → updates main image

**Step 24:** Build `ProductDetail.jsx`
- Fetch product by ID on mount
- Left side: ImageCarousel
- Right side:
  - Brand (grey, small)
  - Product name (large)
  - Rating badge + count
  - Price (large, bold)
  - Original price (strikethrough) + Discount % (green)
  - Stock status: "In Stock" (green) or "Out of Stock" (red)
  - Quantity selector (+ / - with number)
  - "ADD TO CART" button (yellow/orange)
  - "BUY NOW" button (orange)
  - Specifications table (loop through JSONB)

**Step 25:** Add to Cart logic
- POST /api/cart with { sessionId, productId, quantity }
- On success: update CartContext count
- Show success toast

**Step 26:** Buy Now logic
- Same as add to cart, then navigate to /cart

✅ **TEST:**
- Product details load correctly
- Image carousel works
- Add to cart → cart count in navbar updates
- Buy Now → goes to cart

---

### PHASE 9 — Frontend: Cart Page
**Step 27:** Build `CartItem.jsx`
- Product image (small)
- Name + brand
- Price
- Quantity stepper (+ / -) → PATCH API on change
- Remove button (trash icon) → DELETE API
- Subtotal for that item

**Step 28:** Build `CartSummary.jsx`
- Price details box (like Flipkart)
- List: Price (N items), Discount, Delivery charges, Total
- "Place Order" button → navigate to /checkout

**Step 29:** Build `Cart.jsx`
- Fetch cart on mount using sessionId
- If empty → show empty cart illustration + "Shop Now" button
- Map CartItems on left, CartSummary on right

✅ **TEST:**
- Items show correctly
- Qty update works + price recalculates
- Remove item works
- Empty state shows if no items
- Total calculates correctly

---

### PHASE 10 — Frontend: Checkout + Order Success
**Step 30:** Build `Checkout.jsx`
- Left: Delivery Address form
  - Full Name, Phone (10 digits), Address Line 1, Address Line 2 (optional)
  - City, State, Pincode
  - Basic validation (required fields)
- Right: Order Summary (items + total)
- "Place Order" button → POST /api/orders
- On success → navigate to `/order-success?order=OD123456`

**Step 31:** Build `OrderSuccess.jsx`
- Read order number from URL params
- Fetch order details
- Show: ✅ Order Placed Successfully
- Order Number (highlighted)
- Items ordered
- Delivery address
- Estimated delivery (fake: 5-7 days from today)
- "Continue Shopping" button → Home

✅ **TEST (Full E2E Flow):**
1. Open home page
2. Click a product
3. Add to cart
4. Go to cart
5. Click Place Order
6. Fill address form
7. Submit
8. See order confirmation with correct order number
9. Check DB — order exists, cart cleared

---

### PHASE 11 — Polish (If Time Permits)
**Step 32:** Loading skeletons for product grid (grey animated boxes while loading)
**Step 33:** Toast notifications (react-hot-toast) — "Added to cart!", "Order placed!"
**Step 34:** Responsive navbar (hamburger on mobile)
**Step 35:** Wishlist — heart icon on ProductCard, toggle saved in localStorage

---

### PHASE 12 — Deploy + Submit
**Step 36:** Deploy backend to Render
- Connect GitHub repo
- Set environment variable: `DATABASE_URL`
- Build command: `npm install && npx prisma generate`
- Start command: `node src/index.js`

**Step 37:** Deploy frontend to Vercel
- Connect GitHub repo, set root to `/frontend`
- Set env variable: `VITE_API_URL=https://your-render-url.com`

**Step 38:** Test deployed app end-to-end (not localhost)

**Step 39:** Write README.md

**Step 40:** Push everything to public GitHub repo

**Step 41:** Submit GitHub + deployed links via Google Form

---

## UI Design Rules (Evaluators Will Compare with Flipkart)

| Element | Rule |
|---|---|
| Primary color | #2874f0 (Flipkart blue) |
| Navbar | Blue bg, white text, search bar center |
| Add to Cart button | #ff9f00 (orange/yellow) |
| Buy Now button | #fb641b (orange) |
| Price color | #212121 (dark) |
| Original price | #878787 (grey, line-through) |
| Discount | #388e3c (green) |
| Rating badge | Green bg, white text |
| Star rating | #ff9f00 (orange stars) |
| Font | Sans-serif (system font is fine) |
| Card shadow | subtle box-shadow |

---

## Seed Data Plan
5 Categories:
- Electronics, Fashion, Home & Kitchen, Books, Sports

30 Products (6 per category):
- Realistic names (e.g., "Samsung Galaxy M34 5G", "Nike Air Max")
- Price: ₹299 – ₹89,999
- original_price always higher than price
- 3 image URLs per product (use picsum.photos or unsplash)
- Specifications as JSON (e.g., RAM, Storage, Battery for phones)

---

## Git Rules (IMPORTANT)
- ❌ DO NOT commit broken code
- ✅ Only commit when the phase is tested and working
- Commit after each phase

### Commit Messages:
```
feat: Phase 1 - database setup and seed data
feat: Phase 2 - products and categories API
feat: Phase 3 - cart API
feat: Phase 4 - orders API
feat: Phase 5 - frontend setup and routing
feat: Phase 6 - navbar
feat: Phase 7 - home page and product listing
feat: Phase 8 - product detail page
feat: Phase 9 - cart page
feat: Phase 10 - checkout and order success
feat: Phase 11 - polish and responsive
chore: deploy config and README
```

---

## README Template

```markdown
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
cd backend
npm install
# Create .env with DATABASE_URL
npx prisma migrate dev
node prisma/seed.js
node src/index.js
# Runs on http://localhost:5000

### Frontend
cd frontend
npm install
# Create .env with VITE_API_URL=http://localhost:5000
npm run dev
# Runs on http://localhost:5173

## Deployed Links
- Frontend: [link]
- Backend: [link]

## Database Schema
- categories: product categories
- products: all product data with specs
- cart_items: session-based cart (no login needed)
- orders: placed orders with address
- order_items: individual items per order

## Assumptions
- No login required — using localStorage UUID as session ID
- Default logged in user assumed as per assignment spec
- Free delivery on orders above ₹499
- Images from public placeholder APIs
```

---

## Interview Questions You Must Be Ready For

1. **Why Vite instead of Create React App?**
   → Faster dev server, modern build tool

2. **How does cart work without login?**
   → UUID generated on first visit, stored in localStorage, sent with every cart API call

3. **Why separate order_items table?**
   → To store price at order time (prices can change later), and to query items per order

4. **What is JSONB in PostgreSQL?**
   → Binary JSON — faster querying than TEXT, used for product specifications

5. **How does search work?**
   → Backend uses `WHERE name ILIKE '%query%'` — case insensitive partial match

6. **What is Prisma?**
   → ORM — lets you write JS to query DB instead of raw SQL, auto-generates types from schema

7. **How does React Context work?**
   → Global state without props drilling — CartContext stores count, any component can read it

8. **Explain the order placement flow step by step**
   → Cart items fetched → form filled → POST /api/orders → order + order_items created → cart cleared → redirect to success page
```