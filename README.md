# 🛒 Flipkart Clone - E-Commerce Web Application

## 📌 Overview

A fully functional e-commerce web application replicating Flipkart's design and user experience. Features include product browsing, cart management, checkout, and order placement with persistent data storage.

---

## 🚀 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React.js (SPA) + TypeScript + Vite  |
| Styling    | Tailwind CSS + shadcn/ui            |
| Backend    | Node.js with Express.js (REST API)  |
| Database   | PostgreSQL (custom schema)          |
| ORM        | Supabase JS Client                  |

---

## 🗄️ Database Schema Design

The PostgreSQL database uses the following relational schema:

### `orders` Table

| Column        | Type                     | Constraints              |
|---------------|--------------------------|--------------------------|
| id            | UUID                     | PRIMARY KEY, auto-generated |
| order_id      | TEXT                     | NOT NULL, UNIQUE         |
| items         | JSONB                    | NOT NULL                 |
| total         | NUMERIC                  | NOT NULL                 |
| full_name     | TEXT                     | NOT NULL                 |
| phone         | TEXT                     | NOT NULL                 |
| address_line1 | TEXT                     | NOT NULL                 |
| address_line2 | TEXT                     | NULLABLE                 |
| city          | TEXT                     | NOT NULL                 |
| state         | TEXT                     | NOT NULL                 |
| pincode       | TEXT                     | NOT NULL                 |
| status        | TEXT                     | NOT NULL, DEFAULT 'Confirmed' |
| created_at    | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT now()  |

### Schema Relationships (Future Scope)

- **Users** → stores registered user details
- **Products** → product catalog with categories
- **Cart & Cart Items** → temporary storage before checkout
- **Payments** → transaction tracking
- **Reviews** → user feedback and ratings

---

## 🧩 Features

- 🔍 Product listing with search and category filtering
- 📱 Responsive UI matching Flipkart's design patterns
- 🛒 Add to Cart with quantity management
- 📦 Checkout with shipping address form
- ✅ Order confirmation with unique Order ID
- 📋 Order history page
- 💾 Persistent order storage in PostgreSQL

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js (v18+)
- npm or bun
- PostgreSQL database

### 1. Clone Repository

```bash
git clone https://github.com/your-username/flipkart-clone.git
cd flipkart-clone
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

Create a PostgreSQL database and run the schema:

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL UNIQUE,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 4. Configure Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_database_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_api_key
```

### 5. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 6. Start Backend Server (Express.js)

```bash
cd server
npm install
npm start
```

Backend runs at `http://localhost:3000`

---

## ⚠️ Assumptions Made

- Single vendor system (not multi-seller marketplace)
- No real payment gateway integration (mock order placement)
- Product data is static (loaded from local data file)
- No real-time inventory synchronization
- Orders are publicly accessible (no user authentication required for MVP)
- Cart data stored in localStorage for session persistence

---

## 📈 Future Improvements

- User authentication (JWT-based login/signup)
- Multi-vendor/seller support
- Razorpay/Stripe payment integration
- Admin dashboard for order management
- Product recommendation engine
- Real-time inventory tracking
- Wishlist functionality

---

## 📌 Conclusion

This project demonstrates the core architecture of an e-commerce platform including product browsing, cart management, checkout flow, and order processing with persistent PostgreSQL storage — essential components for scalable online marketplaces.
