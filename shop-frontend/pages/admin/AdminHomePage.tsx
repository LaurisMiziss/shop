import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GeneralNavCard } from "../../components/admin/card/GeneralNavCard";

export default function AdminHomePage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (!user || user.role !== "admin") onNavigateToHomePage();
    }, []);

    const onNavigateToHomePage = () => navigate("/home-page");
    const onNavigateToEditProducts = () => navigate("/admin-panel-product-list");
    const onNavigateToEditCategories = () => navigate("/admin-panel-category-list");
    const onNavigateToEditOrders = () => navigate("/admin-panel-order-list");
    const onNavigateToEditUsers = () => navigate("/admin-panel-user-list");

    return (
        <div>
            <h2>
                Welcome, {(user && user.full_name.length > 1) ? user.full_name : "worker"}!
                <br />
                Have a nice working day!
            </h2>

            <GeneralNavCard
                name={"Products"}
                onNavigate={onNavigateToEditProducts}
            />

            <GeneralNavCard
                name={"Category"}
                onNavigate={onNavigateToEditCategories}
            />

            <GeneralNavCard
                name={"Orders"}
                onNavigate={onNavigateToEditOrders}
            />

            <GeneralNavCard
                name={"Users"}
                onNavigate={onNavigateToEditUsers}
            />
        </div>
    );
}