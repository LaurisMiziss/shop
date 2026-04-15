import "./Navbar.css";
import { useSearch } from "../../context/SearchContext";

interface NavbarProps {
    onNavigateToHome: () => void;
    onNavigateToShop: () => void;
    onNavigateToCart: () => void;
    onNavigateToOrders: () => void;
    onNavigateToProfile: () => void;
    onNavigateToSettings: () => void;
    onSearchClick: () => void;
    onProductClick: (productId: number) => void;
}

export function Navbar({
    onNavigateToHome,
    onNavigateToShop,
    onNavigateToCart,
    onNavigateToOrders,
    onNavigateToProfile,
    onNavigateToSettings,
    onSearchClick,
    onProductClick
}: NavbarProps) {
    const { searchQuery, showDropdown, products, onSearchChange, closeDropdown } = useSearch();

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

                {/* dropdown */}
                {showDropdown && products && products.length > 0 && (
                    <ul className="search-dropdown">
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
                {/*add reference}
                {/* close dropdown when clicking outside */}
                {showDropdown && (
                    <div
                        className="dropdown-overlay"
                        onClick={closeDropdown}
                    />
                )}
            </div>
        </nav>
    );
}