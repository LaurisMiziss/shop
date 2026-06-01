import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ProductDetail } from "../../types/products";
import { useProductList } from "../../hooks/products/useProductList";
import { useSearch } from "../../context/SearchContext";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../hooks/profile/useProfile";
import { EditProfile } from "../../components/general/profile/EditProfile";
import { Navbar } from "../../components/general/Navbar";
import { Profile } from "../../components/general/profile/Profile";

export default function ProfilePage() {
    const navigate = useNavigate();
    const { searchQuery, clearSearch } = useSearch();
    const { user, onLoginByToken } = useAuth();
    const { getProductDetails } = useProductList(); 
    const {
        oldUser, editUser, fieldErrors, editing, loading,
        alert, onUserChange, onUsernameChange, onEmailChange, onPhoneChange, onFullnameChange,
        onAddressLineChange, onCityChange, onPostalCodeChange, onCountryChange, updateUser, onUndoButtonClick, removeAlert, onEditProfileClick
    } = useProfile();

    useEffect(() => {
        if (user) {
            onUserChange(user);
        } else {
            navigate("/login");

        }
    }, []);

    const onSaveButtonClick = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await updateUser();

        if (res) onLoginByToken();
    };

    const onNavigateToProductDetails = (product: ProductDetail | null) => navigate("/shop-products-details", {state: { product: product }});
    

    const handleSearchClick = async () => {
        navigate("/shop-products", { state: { query: searchQuery }});
        clearSearch();
    };

    const handleProductClick = async (productId: number) => {
        const product = await getProductDetails(productId);
        onNavigateToProductDetails(product);
        clearSearch();
    };


    return (
        <div className="profile-page-layout">

            <Navbar
                onSearchClick={handleSearchClick}
                onProductClick={handleProductClick}
            />

            <div>

                {/* change later */}
                {editing ? (
                    <EditProfile
                        editUser={editUser}
                        fieldErrors={fieldErrors}
                        loading={loading}
                        alert={alert}
                        onUsernameChange={onUsernameChange}
                        onEmailChange={onEmailChange}
                        onPhoneChange={onPhoneChange}
                        onFullnameChange={onFullnameChange}
                        onAddressLineChange={onAddressLineChange}
                        onCityChange={onCityChange}
                        onPostalCodeChange={onPostalCodeChange}
                        onCountryChange={onCountryChange}
                        onSaveButtonClick={onSaveButtonClick}
                        onUndoButtonClick={onUndoButtonClick}
                        removeAlert={removeAlert}
                        onEditProfileClick={onEditProfileClick}
                    />
                ) : (
                    <Profile
                        user={oldUser}
                        loading={loading}
                        alert={alert}
                        removeAlert={removeAlert}
                        onEditProfileClick={onEditProfileClick}
                        onNavigateToDeletePage={() => navigate("/profile-delete")}
                        onNavigateToChangePassPage={() => navigate("/profile-change-password")}
                    />
                )}

            </div>

        </div>
    );
}