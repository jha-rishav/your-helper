# 🛠️ Your Helper - Full Stack Website

Your one-stop service platform for college students, office professionals, events, tatkal booking, internships, accommodation and more.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v20.17+
- MongoDB Atlas account (free at mongodb.com/atlas)
- Razorpay account (free at razorpay.com)
- Gmail account (for email notifications)

---

## ⚙️ Setup Instructions

### Step 1 — Configure Backend
Edit `server/.env`:
```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/yourhelper
JWT_SECRET=any_random_secret_string
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:3000
```

### Step 2 — Configure Frontend
Edit `client/.env`:
```
VITE_RAZORPAY_KEY=rzp_test_xxxxxxxxxxxx
```

### Step 3 — Create Admin Account
After starting the server, register normally then run in MongoDB Atlas:
```
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

---

## ▶️ Running the Project

### Backend (Terminal 1)
```bash
cd server
npm run dev
# Runs on http://localhost:5000
```

### Frontend (Terminal 2)
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

---

## 📁 Project Structure

```
your-helper/
├── client/                     # React + Vite + Tailwind Frontend
│   └── src/
│       ├── components/         # Navbar, Footer, ServiceCard, WhatsAppButton
│       ├── context/            # AuthContext (global user state)
│       ├── pages/
│       │   ├── Home.jsx        # Landing page with hero, services, testimonials
│       │   ├── Services.jsx    # All services with search & filter
│       │   ├── ServiceDetail.jsx # Service page + booking form + Razorpay
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx   # User bookings + live tracking timeline
│       │   ├── TrackBooking.jsx # Public booking tracker
│       │   ├── Contact.jsx
│       │   └── admin/
│       │       ├── AdminDashboard.jsx  # Stats + recent bookings
│       │       ├── AdminServices.jsx   # Add/Edit/Delete services
│       │       ├── AdminBookings.jsx   # Manage + update booking status
│       │       └── AdminUsers.jsx      # View/delete users
│       └── utils/api.js        # Axios instance with JWT interceptor
│
└── server/                     # Node.js + Express + MongoDB Backend
    ├── models/                 # User, Service, Booking schemas
    ├── routes/                 # auth, services, bookings, payment, admin
    ├── middleware/             # JWT auth guard, nodemailer
    └── server.js
```

---

## ✅ Features

| Feature | Status |
|---------|--------|
| User Registration & Login (JWT) | ✅ |
| Browse & Search Services | ✅ |
| Book a Service | ✅ |
| Razorpay Payment Integration | ✅ |
| Booking Confirmation Email | ✅ |
| Live Booking Tracking | ✅ |
| User Dashboard | ✅ |
| Admin Dashboard with Stats | ✅ |
| Admin: Add/Edit/Delete Services | ✅ |
| Admin: Manage Bookings & Status | ✅ |
| Admin: Manage Users | ✅ |
| WhatsApp Chat Button | ✅ |
| SEO Meta Tags (React Helmet) | ✅ |
| Fully Responsive (Mobile) | ✅ |

---

## 🌐 Deployment

### Frontend → Vercel
```bash
cd client && npm run build
# Upload dist/ to Vercel or connect GitHub repo
```

### Backend → Render
- Connect GitHub repo to Render
- Set root directory to `server`
- Add all .env variables in Render dashboard
- Start command: `npm start`
