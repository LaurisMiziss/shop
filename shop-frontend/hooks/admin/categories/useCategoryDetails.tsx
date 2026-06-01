import { useState, useRef, useEffect } from "react";
import type { Category } from "../../../types/category";
import type { CategoryEditFieldErrors } from "../../../types/fieldErrors";
import { checkForDuplicatesApi } from "../../../api/admin/categories/checkForDuplicatesApi";
import { postCategoryApi } from "../../../api/admin/categories/postCategoryApi";
import { updateCategoryApi } from "../../../api/admin/categories/updateCategoryApi";
import { deleteCategoryApi } from "../../../api/admin/categories/deleteCategoryApi";
import { numberCheck } from "../../../utils/numberCheck";

export function useCategoryDetails() {
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

    const imageUrlRef = useRef<number | null>(null);

    useEffect(() => {
        if (!category) return;

        const nameCheck = async () => {
            const parameters = {
                name: category.name,
                display_order: undefined,
                category_id: category.id
            };

            const res = await checkForDuplicates(parameters);

            if (res === null) return;

            if (!res) return setFieldErrors(prev => ({ ...prev, name: "This category name already exists" }));

            fieldErrors.name === "This category name already exists" && setFieldErrors(prev => ({ ...prev, name: "" }));
        };

        nameCheck();
        
    }, [category?.name]);

    useEffect(() => {
        if (!category) return;

        const orderCheck = async () => {
            const parameters = {
                name: undefined,
                display_order: category.display_order,
                category_id: category.id
            };

            const res = await checkForDuplicates(parameters);
            
            if (res === null) return;

            if (!res) return setFieldErrors(prev => ({ ...prev, display_order: "This display order is already taken" }));

            fieldErrors.display_order === "This display order is already taken" && setFieldErrors(prev => ({ ...prev, display_order: "" }));
        };

        orderCheck();
        
    }, [category?.display_order]);

    useEffect(() => {
        if (!imageUrl) return setFieldErrors(prev => ({...prev, image_url: ""}));

        if (imageUrlRef.current) {
            imageUrlRef.current = null;
        }

        imageUrlRef.current = setTimeout(() => {
            try {
                new URL(imageUrl.toString());

                setFieldErrors(prev => ({...prev, image_url: ""}));

                setCategory(prev => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        image_url: imageUrl
                    };
                });

            } catch (err) {
                if (err instanceof Error) {
                    setFieldErrors(prev => ({ ...prev, image_url: err.message }));
                } else {
                    setFieldErrors(prev => ({ ...prev, image_url: "Invalid URL format" }));
                }
        
            }
        }, 500);

    }, [imageUrl]);

    const onUndoClick = (field: "name" | "description" | "image_url" | "display_order" | "is_active" | undefined) => {
        if (!oldCategory) return;

        const doChanges = confirm(`Are you want to undo changes for field ${field}?`);
        if (!doChanges) return;

        setCategory(prev => {
            if (!prev) return null;

            switch (field) {
                case "name":
                    return { ...prev, name: oldCategory.name };

                case "description":
                    return { ...prev, description: oldCategory.description };

                case "image_url":
                    return { ...prev, image_url: oldCategory.image_url };

                case "display_order":
                    return { ...prev, display_order: oldCategory.display_order };

                case "is_active":
                    return { ...prev, is_active: oldCategory.is_active };

                default:
                    return oldCategory;
            }
        });
    };

    const checkForDuplicates = async (parameters: {
        name: string | undefined, 
        display_order: number | undefined, 
        category_id: number | undefined
    }): Promise<boolean | null> => {
        try {
            setLoading(true);

            const res = await checkForDuplicatesApi(parameters);

            if (!res) {
                showAlert("error", "Something went wrong");
                return null;
            }

            if (!res.success) return false;

            return true;

        } catch (err) {
            if (err instanceof Error) {
                showAlert("error", err.message);
            } else {
                showAlert("error", "Something went wrong");
            }

            return false;

        } finally {
            setLoading(false);

        }
    };

    const postCategory = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            if (!category) return showAlert("error", "Category is not defined");
            setLoading(true);   

            for (const [key, value] of Object.entries(fieldErrors)) {
                if (value) return showAlert("error", `${value}`);
            }

            const res = postCategoryApi(category);

            if (!res) return showAlert("error", "Something went wrong");

            showAlert("success", "Category was successfully created");

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

    const updateCategory = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            if (!category || category === oldCategory) return showAlert("error", "Category is not defined or no changes was made");
            setLoading(true);   

            for (const [key, value] of Object.entries(fieldErrors)) {
                if (value) return showAlert("error", `${value}`);
            }

            const res = updateCategoryApi(category);

            if (!res) return showAlert("error", "Something went wrong");

            showAlert("success", "Category was successfully updated");

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

    const deleteCategory = async (): Promise<boolean> => {
        try {
            if (!category) return false;

            setLoading(true);

            const res = await deleteCategoryApi(category.id);

            if (!res) {
                showAlert("error", "Something went wrong");
                return false;
            }
            
            return true;

        } catch (err) {
            if (err instanceof Error) {
                showAlert("error", err.message);
            } else {
                showAlert("error", "Something went wrong");
            }

            return false;

        } finally {
            setLoading(false);

        }
    };

    const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;

        setCategory(prev => {
            if (prev === null) return null;
            return {
                ...prev,
                name: newName
            };
        });
    };

    const onDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newDesc = e.target.value;

        setCategory(prev => {
            if (prev === null) return null;
            return {
                ...prev,
                description: newDesc
            };
        });
    };

    const onImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newImageUrl = e.target.value;

        setImageUrl(newImageUrl);
    };

    const onOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newOrder = +e.target.value;

        const message = numberCheck(newOrder, 0);

        if (message) {
            setFieldErrors(prev => ({ ...prev, display_order: message }));
        } else if (newOrder < 1) {
            setFieldErrors(prev => ({ ...prev, display_order: "Display order can't have index 0" }));
        } else {
            setFieldErrors(prev => ({ ...prev, display_order: "" }));
        }

        setCategory(prev => {
            if (prev === null) return null;
            return {
                ...prev,
                display_order: newOrder
            };
        });
    };

    const onIsActiveChange = () => {
        setCategory(prev => {
            if (prev === null) return null;
            return {
                ...prev,
                is_active: !prev.is_active
            };
        });
    };

    const handleCategoryChange = (category: Category | null, action: "update" | "create" | null) => {
        if (!category && action === "create") {
            const blankCategory = {id: 1001, name: "", description: "", image_url: null, display_order: 11, is_active: false, created_at: ""};
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
        postCategory,
        updateCategory,
        deleteCategory,
        onNameChange,
        onDescChange,
        onImageUrlChange,
        onOrderChange,
        onIsActiveChange,
        onUndoClick,
        handleCategoryChange,
        removeAlert
    };
}