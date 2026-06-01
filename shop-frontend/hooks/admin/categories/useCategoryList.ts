import { useState, useEffect, useRef } from "react";
import type { Category } from "../../../types/category";
import { getAllCategoriesApi } from "../../../api/admin/categories/getAllCategoriesApi"
import { getCategoryDetailsApi } from "../../../api/admin/categories/getCategoryDetailsApi";

export function useCategoryList() {
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [filters, setFilters] = useState<{limit: number, offset: number}>({limit: 10, offset: 0});
    const [view, setView] = useState<"table" | "grid">("table");
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{type: "success" | "error", message: string} | null>(null)
    const [query, setQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const alertRef = useRef<number | null>(null);

    const queryRef = useRef<number | null>(null);

    const totalPages =  1;

    useEffect(() => {
        const fetchCategories = async () => await getAllCategories();
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => await getAllCategories();

        if (!query || query === "0") {
            fetchCategories();
            return;
        }

        if (queryRef.current) clearTimeout(queryRef.current);

        queryRef.current = setTimeout(async () => {
            setAlert(null);
            setCurrentPage(1);
            await getCategory(+query);
        }, 1200);

    }, [query]);

    useEffect(() => {
        setQuery("");
        const fetchOrders = async () => await getAllCategories();
        fetchOrders();
    }, [filters]);

    const getAllCategories = async () => {
        try {
            setLoading(true);
            const res = await getAllCategoriesApi();

            if (!res) return;

            if (!Array.isArray(res.data)) return [res.data];

            return setCategories(res.data);
        
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

    const getCategory = async (categoryId: number) => {
        try {
            setLoading(true);
            const res = await getCategoryDetailsApi(categoryId);

            if (!res) {
                showAlert("error", "Category with this ID is not found");
                return setCategories([]);
            }

            setCategories([res.data]);

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

    const getCategoryDetails = async (categoryId: number): Promise<Category | null> => {
        try {
            setLoading(true);
            const res = await getCategoryDetailsApi(categoryId);

            if (!res) {
                showAlert("error", "Something went wrong");
                return null;
            }

            return res.data;

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

    const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;

        if (Number.isNaN(+newQuery)) return showAlert("error", "Input should be a positive number");

        setQuery(newQuery);
    };

    const onViewChange = (view: "table" | "grid") => {
        setView(view);
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

    const removeAlert = () => setAlert(null);

    const onPageChange = (page: number) => {
        setCurrentPage(page);
        setFilters(prev => ({...prev, offset: (page - 1) * filters.limit}))
    };

    return {
        categories,
        view,
        loading,
        alert,
        query,
        currentPage,
        totalPages,
        onQueryChange,
        getCategoryDetails,
        onViewChange,
        removeAlert,
        onPageChange
    };
}