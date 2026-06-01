import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SearchProvider } from "../context/SearchContext";
import { CartProvider } from "../context/CartContext";
import { SettingsProvider } from "../context/SettingsContext";
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
import ProductListPage from "../pages/admin/products/ProductListPage";
import EditProductPage from "../pages/admin/products/EditProductPage";
import CategoryListPage from "../pages/admin/categories/CategoryListPage"
import CategoryEditPage from "../pages/admin/categories/CategoryEditPage";
import OrderListPage from "../pages/admin/orders/OrderListPage";
import OrderDetailsPage from "../pages/admin/orders/OrderDetailsPage";
import UserListPage from "../pages/admin/users/UserListPage";
import UserDetailsPage from "../pages/admin/users/UserDetailsPage";
import ProfilePage from "../pages/profile/ProfilePage";
import SettingsPage from "../pages/settings/SettingsPage";
import ChangePasswordPage from "../pages/profile/ChangePasswordPage";
import ProfileDeletePage from "../pages/profile/ProfileDeletePage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <CartProvider>
          <SearchProvider>
            <Routes>
              {/* public routes — anyone can visit */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/shop-products" element={<ShopPage />} />
              <Route path="/shop-products" element={<ShopPage />} />
              <Route path="/shop-products-details" element={<ProductDetailsPage />} />
              <Route path="/cart-items" element={<CartPage />} />
              <Route path="/orders-post" element={<OrderCreationPage />} />
              <Route path="/orders-post-finish" element={<OrderFinish />} />
              <Route path="/orders" element={<OrderList />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile-change-password" element={<ChangePasswordPage />} />
              <Route path="/profile-delete" element={<ProfileDeletePage />} />
              <Route path="/settings" element={<SettingsPage />} />

              {/* restricted routes - only for user with "admin" role */}
              <Route path="/admin-panel" element={<AdminHomePage />} />

              <Route path="/admin-panel-product-list" element={<ProductListPage />} />
              <Route path="/admin-panel-edit-product" element={<EditProductPage />} />

              <Route path="/admin-panel-category-list" element={<CategoryListPage />} />
              <Route path="/admin-panel-edit-category" element={<CategoryEditPage />} />
              
              <Route path="/admin-panel-order-list" element={<OrderListPage />} />
              <Route path="/admin-panel-edit-order" element={<OrderDetailsPage />} />

              <Route path="/admin-panel-user-list" element={<UserListPage />} />
              <Route path="/admin-panel-edit-user" element={<UserDetailsPage />} />

              {/* if someone visits "/" redirect them */}
              <Route path="/" element={<Navigate to="/login" />} />

              {/* catch any unknown url */}
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </SearchProvider>
        </CartProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
}