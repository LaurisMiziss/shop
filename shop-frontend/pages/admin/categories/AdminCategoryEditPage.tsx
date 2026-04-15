import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { Category } from "../../../types/category";
import { useAdminCategoryDetails } from "../../../hooks/admin/categories/useAdminCategoryDetails";
import { CategoryDetails } from "../../../components/admin/category/CategoryDetails";

export default function AdminCategoryEditPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const passedCategory = location.state?.category as Category | null;
    const passedAction = location.state?.action as "update" | "create" | null;
    const {
        oldCategory,
        category,
        imageUrl,
        alert,
        fieldErrors,
        loading,
        handleCategoryChange,
        removeAlert
    } = useAdminCategoryDetails();

    useEffect(() => {
        handleCategoryChange(passedCategory, passedAction);
    }, []);
    // aaaaaaaaaaaaaaaaaa
    console.log("aaaaaaaa")
    return (
        <div>
            
            <CategoryDetails
                action={passedAction}
                oldCategory={oldCategory}
                category={category}
                imageUrl={imageUrl}
                alert={alert}
                fieldErrors={fieldErrors}
                loading={loading}
                onNameChange={}
                onDescriptionChange={}
                onImageUrlChange={}
                onDisplayOrderChange={}
                onIsActiveChange={}
                onUndoClick={}
                removeAlert={removeAlert}
                updateCategory={}
                postCategory={}
                handleDeleteClick={}
            />

        </div>
    );
}