import { createContext, useContext, useState , useEffect} from "react";
import type { Product } from "../types/products";
import { getProductsWithFiltersApi } from "../api/products/getProductsWithFiltersApi";

interface SearchContextType {
    searchQuery: string;
    savedQuery: string;
    showDropdown: boolean;
    products: Product[] | null;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    saveQuery: () => void;
    closeDropdown: () => void;
    clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [savedQuery, setSavedQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [products, setProducts] = useState<Product[] | null>(null);

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setShowDropdown(true);
    };

    useEffect(() => {
        if (searchQuery.length < 2) {
            setProducts(null);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                const res = await getProductsWithFiltersApi(
                    searchQuery, undefined, undefined, 
                    "DESC", undefined, undefined, undefined, 10, 0
                );
                if (!res) return;
                setProducts(res);
            } catch (err) {
                console.error(err);
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchQuery]);

    const saveQuery = () => setSavedQuery(searchQuery);

    const closeDropdown = () => {
        setShowDropdown(false);
        setProducts(null);
    };

    const clearSearch = () => setSearchQuery("");

    return (
        <SearchContext.Provider value={{
            searchQuery,
            savedQuery,
            products,
            saveQuery,
            showDropdown,
            onSearchChange, 
            closeDropdown,

            clearSearch 
        }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    const ctx = useContext(SearchContext);
    if (!ctx) throw new Error("useSearch must be inside SearchProvider");
    return ctx;
}