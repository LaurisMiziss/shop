import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SearchProvider } from "../context/SearchContext";
import { CartProvider } from "../context/CartContext";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import HomePage from "../pages/HomePage";
import ShopPage from "../pages/shop/ShopPage"
import ProductDetailsPage from "../pages/shop/Product/ProductDetailsPage";
import CartPage from "../pages/cart/CartPage";
import OrderCreationPage from "../pages/orders/OrderCreationPage";
import OrderFinish from "../pages/orders/OrdersFinish";
import OrderList from "../pages/orders/OrderList";
import AdminHomePage from "../pages/admin/AdminHomePage";
import AdminProductList from "../pages/admin/products/AdminProductList";
import AdminEditProduct from "../pages/admin/products/AdminEditProduct";
import AdminCategoryListPage from "../pages/admin/categories/AdminCategoryListPage"
import AdminCategoryEditPage from "../pages/admin/categories/AdminCategoryEditPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <SearchProvider>
          <Routes>
            {/* public routes — anyone can visit */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/shop-products" element={<ShopPage />} />
            <Route path="/shop-products-details" element={<ProductDetailsPage />} />
            <Route path="/cart-items" element={<CartPage />} />
            <Route path="/orders-post" element={<OrderCreationPage />} />
            <Route path="/orders-post-finish" element={<OrderFinish />} />
            <Route path="/orders" element={<OrderList />} />

            <Route path="/admin-panel" element={<AdminHomePage />} />
            <Route path="/admin-panel-product-list" element={<AdminProductList />} />
            <Route path="/admin-panel-edit-product" element={<AdminEditProduct />} />
            <Route path="/admin-panel-category-list" element={<AdminCategoryListPage />} />
            <Route path="/admin-panel-edit-category" element={<AdminCategoryEditPage />} />

            {/* if someone visits "/" redirect them */}
            <Route path="/" element={<Navigate to="/login" />} />

            {/* catch any unknown url */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </SearchProvider>
      </CartProvider>
    </BrowserRouter>
  );
}