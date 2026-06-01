import { useNavigate } from "react-router-dom";
import type { ProductDetail } from "../../types/products";
import { useSettings } from "../../context/SettingsContext";
import { useSearch } from "../../context/SearchContext";
import { useProductList } from "../../hooks/products/useProductList";
import { Settings } from "../../components/settings/Settings";
import { Navbar } from "../../components/general/Navbar";
import { Spinner} from "../../components/general/spinner/Spinner";

export default function SettingsPage() {
    const navigate = useNavigate();
    const { searchQuery, clearSearch } = useSearch();
    const { theme, language, alert, onThemeChange, onLanguageChange, removeAlert } = useSettings();
    const { getProductDetails } = useProductList();


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
        <div className="settings-page-layout" data-theme={theme}>

            <Navbar
                onSearchClick={handleSearchClick}
                onProductClick={handleProductClick}
            />

            <div>
                
                <Settings
                    theme={theme}
                    language={language}
                    alert={alert}
                    onThemeChange={onThemeChange}
                    onLanguageChange={onLanguageChange}
                    removeAlert={removeAlert}
                />

            </div>

        </div>
    );
}