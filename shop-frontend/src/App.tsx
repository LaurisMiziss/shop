import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import HomePage from "../pages/HomePage";
import ShopPage from "../pages/shop/ShopPage"
import ProductDetailsPage from "..//pages/shop/Product/ProductDetailsPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public routes — anyone can visit */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/shop-products" element={<ShopPage />} />
        <Route path="/shop-products-details" element={<ProductDetailsPage />} />

        {/* if someone visits "/" redirect them */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* catch any unknown url */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}