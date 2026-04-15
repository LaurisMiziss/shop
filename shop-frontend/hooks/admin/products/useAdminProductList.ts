import { useState, useEffect, useRef } from "react";
import { getAdminProductsWithFiltersApi } from "../../../api/products/getAdminProductsWithFiltersApi";
import { getProductDetailsApi } from "../../../api/products/getProductDetailsApi";
import type { Product, ProductDetail } from "../../../types/products";
import type { Filter } from "../../../types/filter";

const ITEMS_PER_PAGE = 10;

export function useAdminProductList() {
    const [products, setProducts] = useState<Product[] | null>(null);
    const [filter, setFilter] = useState<Filter>({
        categoryId: undefined,
        sort: "name",
        sortType: "DESC",
        priceMin: 0,
        priceMax: 10000,
        isFeatured: "",
        limit: 10,
        offset: 0
    });
    const [tableView, setTableView] = useState(true);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{type: "success" | "error", message: string} | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const alertRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

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

    const getAdminProductsWithFilters = async (searchQuery: string) => {
        try {
            setLoading(true);

            const res = await getAdminProductsWithFiltersApi(
                searchQuery,
                filter.categoryId,
                filter.sort,
                filter.sortType,
                filter.priceMin,
                filter.priceMax,
                filter.isFeatured,
                filter.limit,
                filter.offset
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

    const onPageChange = (page: number) => {
        setCurrentPage(page);
        setFilter(prev => ({...prev, offset: (page - 1) * ITEMS_PER_PAGE}))
    };

    const onViewChange = (view: string) => {
        if (view === "table") {
            setTableView(true);
        } else {
            setTableView(false);
        }
    };

    const showAlert = (type: "success" | "error", message: string) => {
        setAlert({type: type, message: message});

        if (alertRef.current) {
            clearTimeout(alertRef.current);
        }

        alertRef.current = setTimeout(() => {
            setAlert(null);
        }, 5000);
    };

    return {
        products,
        tableView,
        loading,
        alert,
        filter,
        totalPages,
        currentPage,
        totalCount,
        getProductDetails,
        getAdminProductsWithFilters,
        onFilterPriceChange,
        onCategoryChange,
        onSortChange,
        onSortTypeChange,
        onIsFeaturedChange,
        onViewChange,
        onPageChange
    };
}