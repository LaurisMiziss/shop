import "./Navbar.css";
import { useSearch } from "../../context/SearchContext";
import { useAuth } from "../../context/AuthContext";

interface NavbarProps {
    onNavigateToHome: () => void;
    onNavigateToShop: () => void;
    onNavigateToCart: () => void;
    onNavigateToOrders: () => void;
    onNavigateToProfile: () => void;
    onNavigateToSettings: () => void;
    onSearchClick: () => void;
    onProductClick: (productId: number) => void;
    onNavigateToAdminPanel: () => void;
}

export function Navbar({
    onNavigateToHome,
    onNavigateToShop,
    onNavigateToCart,
    onNavigateToOrders,
    onNavigateToProfile,
    onNavigateToSettings,
    onSearchClick,
    onProductClick,
    onNavigateToAdminPanel
}: NavbarProps) {
    const { searchQuery, showDropdown, products, onSearchChange, openDropdown, closeDropdown } = useSearch();
    const { user } = useAuth();

    return (
        <nav>
            <li className="nav-item">
                <a className="nav-link active" aria-current="page" onClick={onNavigateToHome}>Home</a>
            </li>
            <li className="nav-item">
                <a className="nav-link" onClick={onNavigateToShop}>Shop</a>
            </li>
            <li className="nav-item">
                <a className="nav-link" onClick={onNavigateToCart}>Cart</a>
            </li>
            <li className="nav-item">
                <a className="nav-link" onClick={onNavigateToOrders}>Orders</a>
            </li>
            <li className="nav-item">
                <a className="nav-link" onClick={onNavigateToProfile}>Profile</a>
            </li>
            <li className="nav-item">
                <a className="nav-link" onClick={onNavigateToSettings}>Settings</a>
            </li>
            {user && user.role === "admin" && (
                <li className="nav-item">
                    <a className="nav-link" onClick={onNavigateToAdminPanel}>Admin Panel</a>
                </li>
            )}
            
            <div style={{ position: "relative" }}>
                <input
                    type="text"
                    value={searchQuery}
                    placeholder="Search products..."
                    onChange={onSearchChange}
                />

                <button
                    type="button"
                    onClick={onSearchClick}
                >
                    Search
                </button>

                {/* invisible box to trigger search list, if mouse enters */}
                {!showDropdown && products && products.length > 0 && (
                    <div className="search-dropdown-invisible" onMouseEnter={openDropdown} />
                )}

                {/* dropdown */}
                {showDropdown && products && products.length > 0 && (
                    <ul className="search-dropdown" onMouseLeave={closeDropdown}>
                        {products.map(product => (
                            <li
                                key={product.id}
                                onClick={() => onProductClick(product.id)}
                                className="search-dropdown-item"
                            >
                                <img src={product.image_url} alt={product.name} />
                                <div>
                                    <p>{product.name}</p>
                                    <p>{product.price}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </nav>
    );
}