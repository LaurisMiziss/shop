import { createContext, useContext, useState , useEffect} from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { Product } from "../types/products";
import { chooseApiFunction } from "../utils/chooseApiFunction";

interface SearchContextType {
    searchQuery: string;
    savedQuery: string;
    showDropdown: boolean;
    products: Product[] | null;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    saveQuery: () => void;
    openDropdown: () => void;
    closeDropdown: () => void;
    clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [savedQuery, setSavedQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [products, setProducts] = useState<Product[] | null>(null);

    const { user } = useAuth();
    const location = useLocation();

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
                setProducts(null);

                const apiFunc = chooseApiFunction(user, location.pathname);
                console.log(apiFunc)
                const res = await apiFunc(
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

    const openDropdown = () => setShowDropdown(true);

    const closeDropdown = () => {
        setShowDropdown(false);
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
            openDropdown, 
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