import "../../components/products/ProductPage.css";
import { useState, useEffect, useRef } from "react";
import { getProductsWithFiltersApi } from "../../api/products/getProductsWithFiltersApi";
import { getProductDetailsApi } from "../../api/products/getProductDetailsApi";
import type { Product, ProductDetail } from "../../types/products";
import type { Filter } from "../../types/filter";

const ITEMS_PER_PAGE = 10;

export function useProductList() {
    const [products, setProducts] = useState<Product[] | null>(null);
    const [view, setView] = useState<"table" | "grid">("grid");
    const [filter, setFilter] = useState<Filter>({
        passedQuery: "",
        categoryId: undefined,
        sort: "name",
        sortType: "DESC",
        priceMin: 0,
        priceMax: 10000,
        isFeatured: "",
        limit: 10,
        offset: 0
    });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{type: "success" | "error", message: string} | null>(null);
    const [query, setQuery] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const alertRef = useRef<number | null>(null);

    const queryRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const fetchOrders = async () => await getProductsWithFilters(filter.passedQuery, true);

        if (!query || query === "0") {
            fetchOrders();
            return;
        }

        if (queryRef.current) clearTimeout(queryRef.current);

        queryRef.current = setTimeout(async () => {
            setAlert(null);
            setCurrentPage(1);
            await getProduct(+query);
        }, 1200);

    }, [query]);

    useEffect(() => {
        setQuery("");
        const fetchData = async () => getProductsWithFilters(filter.passedQuery, false);
        fetchData();
    }, [filter]);

    useEffect(() => {
        setFilter(prev => {
            return { ...prev, offset: 0};
        });
    }, [totalCount]);

    const getProductDetails = async (productId: number): Promise<ProductDetail | null>=> {
        try {
            setLoading(true);
            const res = await getProductDetailsApi(productId);

            if (!res) {
                showAlert("error", "Something went wrong");
                return null;
            }

            return res;

        } catch (err) {
            if (err instanceof Error) {
                showAlert("error", err.message);

            } else {
                showAlert("error", "Something went wrong");

            }

            return null;

        } finally {
            setLoading(false);
        }
    };

    const getProduct = async (productId: number) => {
        try {
            setLoading(true);
            const res = await getProductDetailsApi(productId);

            if (!res) {
                showAlert("error", "Product with this ID is not found");
                return setProducts([]);
            }

            if (!Array.isArray(res)) return setProducts([res]);

            setProducts(res);

        } catch (err) {
            if (err instanceof Error) {
                showAlert("error", err.message);

            } else {
                showAlert("error", "Something went wrong");

            }

            return null;

        } finally {
            setLoading(false);
        }
    };

    const getProductsWithFilters = async (searchQuery: string, searching: boolean | undefined) => {
        try {
            setLoading(true);

            const res = await getProductsWithFiltersApi(
                searchQuery,
                filter.categoryId,
                filter.sort,
                filter.sortType,
                filter.priceMin,
                filter.priceMax,
                filter.isFeatured,
                filter.limit,
                searching ? 0 : filter.offset
            );

            if (!res) return showAlert("error", "Something went wrong");

            setProducts(res);

            res.length > 0 ? setTotalCount(Number(res[0].total)) : setTotalCount(0);

        } catch (err) {
            if (err instanceof Error) {
                showAlert("error", err.message);

            } else {
                showAlert("error", "Something went wrong");

            }
            
        } finally {
            setLoading(false);
        }
    };

    const onFilterPriceChange = (scale: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const newPrice = Number(e.target.value);

        if (Number.isNaN(newPrice)) return;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setFilter(prev => {
                if (scale === "min") {
                    if (newPrice > prev.priceMax) return prev;
                    return { ...prev, priceMin: newPrice };
                } else {
                    if (newPrice < prev.priceMin) return prev;
                    return { ...prev, priceMax: newPrice };
                }
            });
        }, 100);
    };

    const onCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCategoryId = Number(e.target.value);
        if (Number.isNaN(newCategoryId)) return;
        setFilter(prev => ({ ...prev, categoryId: newCategoryId }));
    };

    const onSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSort = e.target.value;
        const allowed = ["name", "price", "stock"];
        if (!allowed.includes(newSort)) return;
        setFilter(prev => ({ ...prev, sort: newSort }));
    };

    const onSortTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSortType = e.target.value;
        const allowed = ["ASC", "DESC"];
        if (!allowed.includes(newSortType)) return;
        setFilter(prev => ({ ...prev, sortType: newSortType }));
    };

    const onIsFeaturedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(prev => ({ ...prev, isFeatured: e.target.value || "" }));
    };

    const onViewChange = (view: "table" | "grid") => {
        setView(view);
    };

    const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;

        if (Number.isNaN(+newQuery)) return showAlert("error", "Input should be a positive number");

        setQuery(newQuery);
    };

    const showAlert = (type: "success" | "error", message: string) => {
        setAlert({type: type, message: message});

        if (alertRef.current) {
            clearTimeout(alertRef.current);
        }

        alertRef.current = setTimeout(() => {
            removeAlert();
        }, 5000);
    };

    const removeAlert = () => setAlert(null);

    const onPageChange = (page: number) => {
        setCurrentPage(page);
        setFilter(prev => ({...prev, offset: (page - 1) * ITEMS_PER_PAGE}))
    };

    const onPassedQueryChange = (query: string | null) => {
        setFilter(prev => {
            return { ...prev, passedQuery: query ? query : ""};
        });
    };

    return {
        products,
        view,
        loading,
        alert,
        query,
        filter,
        totalPages,
        currentPage,
        totalCount,
        onQueryChange,
        showAlert,
        removeAlert,
        getProductDetails,
        getProductsWithFilters,
        onFilterPriceChange,
        onCategoryChange,
        onSortChange,
        onSortTypeChange,
        onIsFeaturedChange,
        onViewChange,
        onPassedQueryChange,
        onPageChange
    };
}