# King Trading Co. — Complete Setup & Deployment Guide

## 📁 Project Structure
```
king-trading/
├── index.html          ← Customer store page
├── cart.html           ← Cart & checkout
├── admin.html          ← Admin dashboard
├── login.html          ← Admin login
├── manifest.json       ← PWA manifest
├── service-worker.js   ← Offline caching
├── vercel.json         ← Vercel config
├── css/
│   └── style.css
├── js/
│   ├── firebase.js     ← ⚠️ Edit this with YOUR Firebase keys
│   ├── app.js          ← Customer page logic
│   ├── cart.js         ← Cart logic
│   └── admin.js        ← Admin logic
└── images/
    ├── icon-192.png    ← Create/add PWA icons
    └── icon-512.png
```

---

## 🔥 STEP 1: Firebase Project Setup

### Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click **"Add project"**
3. Name it: `king-trading-co`
4. Enable/disable Google Analytics (your choice)
5. Click **Create project**

### Enable Firestore Database
1. In Firebase Console → **Firestore Database**
2. Click **Create database**
3. Choose **Production mode** (start in production)
4. Select region: **asia-south1 (Mumbai)** for best performance in India
5. Click **Done**

### Set Firestore Security Rules
Go to **Firestore → Rules** and paste:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Anyone can READ products
    match /products/{productId} {
      allow read: if true;
      // Only authenticated admins can write
      allow write: if request.auth != null;
    }
  }
}
```

### Enable Firebase Storage
1. Firebase Console → **Storage**
2. Click **Get started**
3. Choose Production mode
4. Select same region as Firestore

### Set Storage Security Rules
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Enable Authentication
1. Firebase Console → **Authentication**
2. Click **Get started**
3. Under **Sign-in method**, enable **Email/Password**
4. Click Save

### Create Admin User
1. Authentication → **Users tab**
2. Click **Add user**
3. Enter your email (e.g. `admin@kingtrading.com`)
4. Enter a strong password
5. Click **Add user**
6. 🔐 **Save these credentials! You'll use them to log into admin.html**

---

## 🔑 STEP 2: Add Firebase Config to the Project

1. Firebase Console → ⚙️ **Project Settings** (gear icon)
2. Scroll to **"Your apps"** → Click **</>** (Web icon)
3. Register app name: `king-trading-web`
4. Copy the `firebaseConfig` object
5. Open `js/firebase.js` and replace the placeholder config:

```javascript
const firebaseConfig = {
  apiKey:            "AIzaSy...",          // ← your key
  authDomain:        "king-trading-co.firebaseapp.com",
  projectId:         "king-trading-co",
  storageBucket:     "king-trading-co.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abc123"
};
```

---

## 🌱 STEP 3: Seed Initial Products (Optional)

The app will show the built-in seed data (all 70+ products) automatically
when Firestore is empty. To add prices, log in to admin.html and edit each product.

To bulk-import via Firebase Console:
1. Firestore → **products** collection
2. Add documents with fields: `productName`, `price`, `category`, `imageUrl`, `available`, `createdAt`

---

## 🚀 STEP 4: Deploy to Vercel

### Method A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Go to project folder
cd king-trading

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: king-trading-co
# - Directory: ./
# - Override settings? No

# For production deployment:
vercel --prod
```

### Method B: Vercel Website (Drag & Drop)
1. Go to https://vercel.com
2. Sign up / Log in with GitHub
3. Click **"Add New Project"**
4. Drag your project folder into the upload area
5. Click **Deploy**

### Method C: GitHub Integration
1. Push your code to a GitHub repository
2. On Vercel, click **Import Git Repository**
3. Select your repo
4. Vercel auto-deploys on every push ✨

---

## 📱 STEP 5: PWA Icons

Create two PNG icons and place in the `images/` folder:
- `icon-192.png` — 192×192 pixels
- `icon-512.png` — 512×512 pixels

You can use: https://www.canva.com or https://favicon.io to create icons with a rice/grain logo.

---

## 🔐 Admin Login Guide

1. Visit: `https://your-site.vercel.app/login.html`
2. Enter the email and password you created in Firebase Auth
3. You'll be redirected to the Admin Dashboard
4. From the dashboard you can:
   - ➕ Add new products (with image upload)
   - ✏️ Edit existing products
   - 🗑 Delete products
   - Toggle availability on/off

---

## 💬 WhatsApp Order Flow

1. Customer browses products on `index.html`
2. Adds items to cart
3. Goes to `cart.html`
4. Clicks **"Place Order via WhatsApp"**
5. A pre-filled WhatsApp message with the order list opens
6. Customer sends it to your number: **90803 48568**

---

## 🛠 Local Development (Testing)

Since Firebase requires HTTPS for some features, use a local server:

```bash
# Option 1: Python
cd king-trading
python3 -m http.server 3000
# Visit: http://localhost:3000

# Option 2: Node http-server
npx http-server . -p 3000
# Visit: http://localhost:3000

# Option 3: VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

---

## 🔧 Customization

### Change WhatsApp Number
In `js/cart.js`, update:
```javascript
const WA_NUMBER = "919080348568"; // Format: country code + number
```

In `index.html` and `cart.html`, update the `wa-btn` href.

### Change Store Name
Search and replace `King Trading Co.` across all HTML files.

### Add/Remove Categories
In `js/app.js`, edit the `CAT_EMOJI` object and add buttons in `index.html`.

---

## ❓ Troubleshooting

| Issue | Fix |
|-------|-----|
| Products not loading | Check Firebase config in `firebase.js` |
| Admin login fails | Verify user exists in Firebase Auth console |
| Images not uploading | Check Storage security rules allow auth writes |
| WhatsApp not opening | Check browser popup blocker settings |
| Cart not persisting | localStorage must be enabled in browser |

---

## 📞 Support

King Trading Co. · 90803 48568 · Chennai, Tamil Nadu
