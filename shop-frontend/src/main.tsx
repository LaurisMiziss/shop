import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { AuthProvider } from '../context/AuthContext.tsx';
import App from './App.tsx';


// online-shop-frontend/
// ├── src/
// │   ├── App.jsx
// │   ├── pages/
// │   │   ├── Home.jsx
// │   │   ├── Products.jsx
// │   │   ├── ProductDetail.jsx
// │   │   ├── Cart.jsx
// │   │   ├── Checkout.jsx
// │   │   ├── Orders.jsx
// │   │   └── Admin/
// │   ├── components/
// │   │   ├── Navbar.jsx
// │   │   ├── ProductCard.jsx
// │   │   ├── CartItem.jsx
// │   │   └── ...
// │   └── api/
// │       └── api.js (all fetch functions)

// ### **4. Products table features:**
// - `stock` - inventory management
// - `is_active` - hide without deleting
// - `is_featured` - show on homepage
// - `sku` - barcode/product code
// - `unit` - kg, piece, liter

// ### **5. Orders table - why so many fields:**
// - **Snapshot shipping address** - customer might move!
// - `status` - track order lifecycle
// - `payment_status` - separate from order status
// - `customer_notes` - "Please ring doorbell"
// - `admin_notes` - internal notes

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
