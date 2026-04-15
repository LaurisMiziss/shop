import { useState, useRef, useEffect } from "react";
import type { Category } from "../../../types/category";
import type { CategoryEditFieldErrors } from "../../../types/fieldErrors";
import { numberCheck } from "../../../utils/numberCheck";

export function useAdminCategoryDetails() {
    const [oldCategory, setOldCategory] = useState<Category | null>(null);
    const [category, setCategory] = useState<Category | null>(null);
    const [imageUrl, setImageUrl] = useState("");
    const [alert, setAlert] = useState<{type: "success" | "error", message: string} | null>(null);
    const [fieldErrors, setFieldErrors] = useState<CategoryEditFieldErrors>({
        name: "",
        description: "",
        image_url: "",
        display_order: "",
        is_active: "",
    });
    const [loading, setLoading] = useState(false);

    const alertRef = useRef<number | null>(null);

    const handleCategoryChange = (category: Category | null, action: "update" | "create" | null) => {
        if (!category && action === "create") {
            const blankCategory = {id: 0, name: "", description: "", image_url: null, display_order: 0, is_active: false, created_at: ""};
            setOldCategory(blankCategory);
            return setCategory(blankCategory);
        }

        if (category && action === "update") {
            setOldCategory(category);
            return setCategory(category);
        }

        if (!category && action === "update") return showAlert("error", "Product wasn't found");

        if (category && action === "create") return showAlert("error", "Product shouldn't be defined in this action");
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
        oldCategory,
        category,
        imageUrl,
        alert,
        fieldErrors,
        loading,
        handleCategoryChange,
        removeAlert
    };
}