# 🍽️ HomeFood — Home Based Food Ordering System

A complete full-stack web application connecting **Home Chefs** and **Home Bakers** with customers.

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB Atlas (permanent) |
| Auth | JWT (role-based) |
| Images | Cloudinary (permanent storage) |
| Payments | Razorpay + Cash on Delivery |
| AI | OpenAI GPT-3.5 / Rule-based fallback |
| Deploy | Render (backend) + Vercel (frontend) |

---

## 📁 Project Structure

```
homefood/
├── backend/
│   ├── server.js              # Express app entry point
│   ├── .env.example           # Environment variables template
│   ├── config/
│   │   └── cloudinary.js      # Cloudinary configuration
│   ├── middleware/
│   │   └── auth.js            # JWT auth + role guards
│   ├── models/
│   │   ├── User.js            # Customer model
│   │   ├── Seller.js          # Chef/Baker model
│   │   ├── FoodItem.js        # Food/bakery item model
│   │   ├── Order.js           # Order model
│   │   └── ReviewCart.js      # Review + Cart models
│   └── routes/
│       ├── auth.js            # Login/Register APIs
│       ├── seller.js          # Seller management APIs
│       ├── foods.js           # Food listing APIs
│       ├── cart.js            # Cart APIs
│       ├── orders.js          # Order APIs
│       ├── admin.js           # Admin APIs
│       ├── payment.js         # Razorpay payment APIs
│       ├── ai.js              # AI recommendation API
│       └── reviews.js         # Review APIs
└── frontend/
    ├── public/
    │   └── index.html         # HTML template with Razorpay script
    └── src/
        ├── App.js             # Routes + providers
        ├── index.js           # React entry point
        ├── index.css          # Global styles
        ├── context/
        │   ├── AuthContext.js # Auth state management
        │   └── CartContext.js # Cart state management
        ├── components/
        │   ├── Navbar.js      # Navigation bar
        │   └── FoodCard.js    # Food item card
        └── pages/
            ├── HomePage.js        # Landing page
            ├── LoginPage.js       # Login (user + seller tabs)
            ├── RegisterPage.js    # User + Seller registration
            ├── FoodsPage.js       # Browse + filter all foods
            ├── FoodDetailPage.js  # Food detail + reviews
            ├── CartPage.js        # Shopping cart
            ├── CheckoutPage.js    # Checkout + payment
            ├── OrdersPage.js      # Order history & tracking
            ├── AIChat.js          # AI food assistant chat
            ├── UserDashboard.js   # Customer dashboard
            ├── SellerDashboard.js # Chef/Baker dashboard
            └── AdminDashboard.js  # Admin control panel
```

---

## ⚙️ External Services Setup

### 1. MongoDB Atlas (Free)
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → Create free account
2. Create a new cluster (M0 Free tier)
3. Create database user: Security → Database Access → Add User
4. Allow all IPs: Security → Network Access → Add IP Address → 0.0.0.0/0
5. Get connection string: Clusters → Connect → Connect your application
6. Copy URI like: `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/homefood`

### 2. Cloudinary (Free)
1. Go to [cloudinary.com](https://cloudinary.com) → Sign up free
2. Go to Dashboard → copy `Cloud Name`, `API Key`, `API Secret`

### 3. Razorpay (Test Mode)
1. Go to [razorpay.com](https://razorpay.com) → Sign up
2. Go to Settings → API Keys → Generate Test Key
3. Copy `Key ID` and `Key Secret`
4. For test payments use: Card 4111 1111 1111 1111, Expiry: any future date, CVV: any 3 digits

### 4. OpenAI (Optional)
1. Go to [platform.openai.com](https://platform.openai.com) → Sign up
2. API Keys → Create new key → copy it
3. **Note**: If you skip this, the AI will use rule-based responses (still works!)

---

## 🚀 Local Development Setup

### Step 1: Clone/Download the Project
```bash
# If using git
git clone https://github.com/yourusername/homefood.git
cd homefood

# Or extract the downloaded ZIP
```

### Step 2: Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your credentials (see below)
nano .env  # or open in any text editor
```

**Edit `backend/.env`:**
```env
PORT=5000
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASS@cluster0.xxxxx.mongodb.net/homefood
JWT_SECRET=mysupersecretjwtkey123456789change_this_now
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_api_secret_here
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxx...  (optional)
ADMIN_EMAIL=admin@homefood.com
ADMIN_PASSWORD=Admin@123
FRONTEND_URL=http://localhost:3000
```

```bash
# Start backend server
npm run dev
# Server runs at http://localhost:5000
```

### Step 3: Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env
```

**Edit `frontend/.env`:**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

```bash
# Start React development server
npm start
# App runs at http://localhost:3000
```

### ✅ That's it! Open http://localhost:3000

---

## 👤 Default Accounts

### Admin Login
```
URL: http://localhost:3000/login (use Customer tab)
Email: admin@homefood.com
Password: Admin@123
```
*(These are set in backend .env as ADMIN_EMAIL and ADMIN_PASSWORD)*

### Test Seller Flow
1. Go to `/seller/register` → Fill form → Submit
2. Login as Admin → Admin Dashboard → Sellers tab → Approve the seller
3. Now seller can login at `/login` (Seller tab)

### Test User Flow
1. Go to `/register` → Create account → Login
2. Browse foods at `/foods`
3. Add to cart → Checkout → Pay (COD or Razorpay test)

---

## 🌐 Deployment (Free Hosting)

### Deploy Backend to Render

1. Push your `backend/` folder to GitHub
2. Go to [render.com](https://render.com) → Sign up with GitHub
3. Click **New +** → **Web Service**
4. Connect your GitHub repo
5. Configure:
   - **Name**: homefood-backend
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
6. Add **Environment Variables** (all from your .env file)
7. Click **Create Web Service**
8. Wait ~3 minutes → Get URL like: `https://homefood-backend.onrender.com`

### Deploy Frontend to Vercel

1. Push your `frontend/` folder to GitHub
2. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
3. Click **New Project** → Import your frontend repo
4. Configure:
   - **Framework**: Create React App
   - **Root Directory**: frontend (if in monorepo)
5. Add **Environment Variables**:
   - `REACT_APP_API_URL` = `https://homefood-backend.onrender.com`
   - `REACT_APP_RAZORPAY_KEY_ID` = your razorpay key
6. Click **Deploy**
7. Get URL like: `https://homefood.vercel.app`

### Final Step: Update Backend CORS
In Render dashboard → Environment Variables:
```
FRONTEND_URL=https://homefood.vercel.app
```

---

## 📡 API Reference

### Auth
```
POST /api/auth/register          - Register user
POST /api/auth/login             - Login user/admin
POST /api/auth/seller/register   - Register seller
POST /api/auth/seller/login      - Login seller
```

### Foods (Public)
```
GET  /api/foods                  - List foods (with filters)
GET  /api/foods/:id              - Single food item
GET  /api/foods/sellers/chefs    - All home chefs
GET  /api/foods/sellers/bakers   - All home bakers
GET  /api/foods/meta/categories  - Get categories
```

### Cart (User)
```
GET    /api/cart                 - Get user cart
POST   /api/cart/add             - Add to cart
PUT    /api/cart/update          - Update quantity
DELETE /api/cart/remove/:id      - Remove item
DELETE /api/cart/clear           - Clear cart
```

### Orders (User)
```
POST /api/orders/create          - Create order
GET  /api/orders/my-orders       - User's orders
GET  /api/orders/:id             - Single order
```

### Seller (Seller only)
```
POST   /api/seller/add-item         - Add food item
GET    /api/seller/items            - My items
PUT    /api/seller/update-item/:id  - Update item
DELETE /api/seller/delete-item/:id  - Delete item
GET    /api/seller/orders           - My orders
PUT    /api/seller/orders/:id/status - Update order status
GET    /api/seller/dashboard        - Dashboard stats
```

### Admin (Admin only)
```
GET    /api/admin/dashboard              - Stats
GET    /api/admin/users                  - All users
GET    /api/admin/sellers                - All sellers
PUT    /api/admin/sellers/:id/approve    - Approve seller
PUT    /api/admin/sellers/:id/toggle     - Activate/deactivate
DELETE /api/admin/sellers/:id            - Delete seller
PUT    /api/admin/users/:id/toggle       - Activate/deactivate user
DELETE /api/admin/users/:id              - Delete user
GET    /api/admin/orders                 - All orders
GET    /api/admin/food-items             - All food items
DELETE /api/admin/food-items/:id         - Delete food item
```

### Payment (User)
```
POST /api/payment/create-order   - Create Razorpay order
POST /api/payment/verify         - Verify payment signature
```

### AI
```
GET /api/ai/suggestions?query=   - AI food recommendations
```

### Reviews (User)
```
POST /api/reviews/add            - Add review
GET  /api/reviews/food/:id       - Get food reviews
```

---

## 🔒 Security Notes

- JWT tokens expire in 30 days
- Passwords are hashed with bcrypt (salt rounds: 12)
- Admin credentials are in environment variables (not in DB)
- All seller/admin routes are protected by middleware
- Razorpay payment is verified server-side using HMAC signature

---

## 🐛 Troubleshooting

**"Cannot connect to MongoDB"**
- Check MONGO_URI is correct
- Make sure IP 0.0.0.0/0 is whitelisted in MongoDB Atlas Network Access

**"Image upload failed"**
- Check Cloudinary credentials in .env
- Make sure cloud name, API key and secret are correct

**"Razorpay not loaded"**
- Check internet connection
- The Razorpay script is loaded in public/index.html

**"Seller can't login"**
- Seller must be approved by admin first
- Login as admin → Dashboard → Sellers tab → Click Approve

**Backend 404 on Render**
- Make sure Root Directory is set to `backend/`
- Check start command is `node server.js`

**CORS errors**
- Set FRONTEND_URL in backend .env to your Vercel URL
- Redeploy backend after updating env vars

---

## 🎨 Color Scheme

The app uses a rich **dark amber/orange** theme:
- Background: `#0f0500` (deep brown-black)
- Cards: `#1e0a00` (dark warm brown)
- Primary: `#ff6b00` → `#ff9500` (orange gradient)
- Text: `#fff5e6` (warm white) / `#ffcca0` (warm cream)
- Success: `#22c55e` | Error: `#ef4444` | Info: `#3b82f6`

---

## 📝 License

MIT License — Free to use for personal and commercial projects.

---

Built with ❤️ for home food entrepreneurs everywhere.
