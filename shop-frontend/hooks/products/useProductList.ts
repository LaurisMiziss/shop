import { useState, useEffect, useRef } from "react";
import { getProductsWithFiltersApi } from "../../api/products/getProductsWithFiltersApi";
import { getProductDetailsApi } from "../../api/products/getProductDetailsApi";
import type { Product, ProductDetail } from "../../types/products";
import type { Filter } from "../../types/filter";

const ITEMS_PER_PAGE = 10;

export function useProductList() {
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState(0); // Items in products[]
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const getProductDetails = async (productId: number): Promise<ProductDetail | null>=> {
        setLoading(true);
        setError(null);
        try {
            const res = await getProductDetailsApi(productId);

            if (!res) return null;

            return res;

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong");
            }

            return null;

        } finally {
            setLoading(false);
        }
    };

    const getProductsWithFilters = async (searchQuery: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await getProductsWithFiltersApi(
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

            if (!res) return;

            setProducts(res);

            res.length > 0 ? setTotalCount(Number(res[0].total)) : setTotalCount(0);

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong");
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

    return {
        products,
        loading,
        error,
        filter,
        totalPages,
        currentPage,
        totalCount,
        getProductDetails,
        getProductsWithFilters,
        onFilterPriceChange,
        onCategoryChange,
        onSortChange,
        onSortTypeChange,
        onIsFeaturedChange,
        onPageChange
    };
}