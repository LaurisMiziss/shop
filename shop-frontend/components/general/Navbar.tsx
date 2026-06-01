import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import { useAuth } from "../../context/AuthContext";

interface NavbarProps {
    onSearchClick: () => void;
    onProductClick: (productId: number) => void;
}

export function Navbar({ onSearchClick, onProductClick }: NavbarProps) {
    const { searchQuery, showDropdown, products, onSearchChange, openDropdown, closeDropdown } = useSearch();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const onExit = () => {
        localStorage.removeItem("token");
        navigate("login");
    };

    return (
        <nav>
            <ul>
                <img src="https://cdn-icons-png.flaticon.com/512/4215/4215714.png" width={`45px`} />
                
                <li className="nav-item">
                    <button className={`nav-link ${location.pathname.includes("/shop-products") ? "active" : ""}`} onClick={() => navigate("/shop-products")}>Shop</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${location.pathname === "/cart-items" ? "active" : ""}`} onClick={() => navigate("/cart-items")}>Cart</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${location.pathname.includes("/orders") ? "active" : ""}`} onClick={() => navigate("/orders")}>Orders</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${location.pathname.includes("/profile") ? "active" : ""}`} onClick={() => navigate("/profile")}>Profile</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${location.pathname === "/settings" ? "active" : ""}`} onClick={() => navigate("/settings")}>Settings</button>
                </li>
                {user && user.role === "admin" && (
                    <li className="nav-item admin-item">
                        <span
                            className={`nav-link ${location.pathname.includes("/admin-panel") ? "active" : ""}`}
                            onClick={() => navigate("/admin-panel")}
                        >
                            Admin Panel
                        </span>

                        <ul className="admin-submenu">

                            <li>
                                <button className="nav-link" onClick={() => navigate("/admin-panel-user-list")}>Users</button>
                            </li>

                            <li>
                                <button className="nav-link" onClick={() => navigate("/admin-panel-product-list")}>Products</button>
                            </li>

                            <li>
                                <button className="nav-link" onClick={() => navigate("/admin-panel-category-list")}>Categories</button>
                            </li>

                            <li>
                                <button className="nav-link" onClick={() => navigate("/admin-panel-order-list")}>Orders</button>
                            </li>

                        </ul>
                    </li>
                )}
            </ul>
            
            <div className="nav-right">
                <input
                    className="nav-input"
                    type="text"
                    value={searchQuery}
                    placeholder="Search products..."
                    onChange={onSearchChange}
                />

                <button
                    className="nav-button"
                    type="button"
                    onClick={onSearchClick}
                >
                    Search
                </button>

                <button
                    className="exit-btn"
                    type="button"
                    onClick={onExit}
                >
                    ➜]
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