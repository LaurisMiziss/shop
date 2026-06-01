import "../../../components/admin/general/PageDetails.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import type { User } from "../../../types/user";
import { useSearch } from "../../../context/SearchContext";
import { useUserDetails } from "../../../hooks/admin/users/useUserDetails";
import { useProductList } from "../../../hooks/products/useProductList";
import { UserDetails } from "../../../components/admin/user/UserDetails";
import { Navbar } from "../../../components/general/Navbar";
import { ReturnButton } from "../../../components/general/ReturnButton";

export default function UserDetailsPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { searchQuery, saveQuery, clearSearch } = useSearch();
    const passedUser = location.state?.user as User | null;
    const {
        user,
        alert,
        loading,
        onUndoClick,
        updateUser,
        onRoleChange,
        handleUserChange,
        removeAlert
    } = useUserDetails();
    const { getProductDetails, getProductsWithFilters } = useProductList();

    useEffect(() => {
        if (!passedUser) {
            return;

        } else {
            handleUserChange(passedUser);
            
        }
    }, [passedUser]);

    const onUpdateUserClick = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateUser(false);
    };

    const onNavigateToProductDetails = async (productId: number | null) => {
        const product = productId ? await getProductDetails(productId) : null;
        navigate("/shop-products-details", {state: { product: product }});
    };
    
    const onNavigateToUserList = () => navigate("/admin-panel-user-list");

    const handleSearchClick = async () => {
        saveQuery();
        await getProductsWithFilters(searchQuery);
        navigate("/shop-products");
        clearSearch();
    };

    const handleProductClick = async (productId: number) => {
        onNavigateToProductDetails(productId);
        clearSearch();
    };

    return (
        <div className="page-layout">

            <Navbar
                onSearchClick={handleSearchClick}
                onProductClick={handleProductClick}
            />

            <div className="page-content">

                <div className="details-container">
                    
                    <ReturnButton onNavigateBack={onNavigateToUserList} />

                    <UserDetails
                        user={user}
                        alert={alert}
                        loading={loading}
                        onUndoClick={onUndoClick}
                        onUpdateUserClick={onUpdateUserClick}
                        onRoleChange={onRoleChange}
                        removeAlert={removeAlert}
                    />
                </div>

            </div>

        </div>
    );
}