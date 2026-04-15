import { useState, useEffect, useRef } from "react";
import type { Category } from "../../../types/category";
import { getAllCategoriesApi } from "../../../api/admin/categories/getAllCategoriesApi"
import { getCategoryDetailsApi } from "../../../api/admin/categories/getCategoryDetailsApi";

export function useAdminCategoryList() {
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [view, setView] = useState<"table" | "grid">("table");
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{type: "success" | "error", message: string} | null>(null)

    const alertRef = useRef<number | null>(null);

    useEffect(() => {
        const fetchCategories = async () => await getAllCategories();
        fetchCategories();
    }, []);

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

    return {
        categories,
        view,
        loading,
        alert,
        getCategoryDetails,
        onViewChange,
        removeAlert
    };
}