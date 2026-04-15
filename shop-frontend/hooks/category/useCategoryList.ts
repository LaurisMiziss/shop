import { useEffect, useState } from "react";
import { getCategoriesApi } from "../../api/categories/getCategoriesApi"
import type { Category } from "../../types/category";

export function useCategoryList() {
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getCategories = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await getCategoriesApi();

            if (!res) return setError("Something went wrong");

            return setCategories(res);
        
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

    useEffect(() => {
        getCategories();
    }, []);

    return {
        categories,
        loading, 
        error, 
        getCategories
    };
}