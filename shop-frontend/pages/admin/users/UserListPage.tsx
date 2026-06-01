import "../../../components/admin/general/PageList.css";
import { useNavigate } from "react-router-dom";
import type { User } from "../../../types/user";
import { useSearch } from "../../../context/SearchContext";
import { useUserList } from "../../../hooks/admin/users/useUserList";
import { useProductList } from "../../../hooks/products/useProductList";
import { Navbar } from "../../../components/general/Navbar";
import { UserList } from "../../../components/admin/user/UserList";
import { Pagination } from "../../../components/general/Pagination";

export default function UserListPage() {
    const navigate = useNavigate();
    const { searchQuery, saveQuery, clearSearch } = useSearch();
    const {
        users,
        query,
        view,
        loading,
        alert,
        currentPage,
        totalPages,
        getUser,
        onQueryChange,
        onViewChange,
        onPageChange,
        removeAlert
    } = useUserList();
    const { getProductDetails, getProductsWithFilters } = useProductList();

    const onUserClick = async (userId: number) => {
        const res = await getUser(userId);

        if (res) return onNavigateToUserDetails(res);
    };

    const onNavigateToProductDetails = async (productId: number | null) => {
        const product = productId ? await getProductDetails(productId) : null;
        navigate("/shop-products-details", {state: { product: product }});
    };
    const onNavigateToUserDetails = (user: User | null) => navigate("/admin-panel-edit-user", { state: { user: user }});

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

                <UserList
                    users={users}
                    view={view}
                    loading={loading}
                    alert={alert}
                    query={query}
                    onQueryChange={onQueryChange}
                    onUserClick={onUserClick}
                    onViewChange={onViewChange}
                    removeAlert={removeAlert}
                />

                {!loading && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                )}

            </div>

        </div>
    );
}