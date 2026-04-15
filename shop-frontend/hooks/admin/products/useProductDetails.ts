import { useState, useRef, useEffect } from "react";
import type { ProductDetail } from "../../../types/products";
import type { ProductEditFieldErrors } from "../../../types/fieldErrors";
import { checkForDuplicatesApi } from "../../../api/admin/products/checkForDuplicatesApi";
import { updateProductApi } from "../../../api/admin/products/updateProductApi";
import { deleteProductApi } from "../../../api/admin/products/deleteProductApi";
import { postProductApi } from "../../../api/admin/products/postProductApi";
import { countDecimals } from "../../../utils/countDecimals";
import { numberCheck } from "../../../utils/numberCheck";

export function useProductDetails() {
    const [oldProduct, setOldProduct] = useState<ProductDetail | null>(null);
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [imageUrl, setImageUrl] = useState("");
    const [imagesUrl, setImagesUrl] = useState("");
    const [alert, setAlert] = useState<{type: "success" | "error", message: string} | null>(null);
    const [fieldErrors, setFieldErrors] = useState<ProductEditFieldErrors>({
        name: "",
        price: "",
        stock: "",
        category_id: "",
        image_url: "",
        is_active: "",
        is_featured: "",
        description: "",
        sku: "",
        images: "",
        weight: "",
        unit: ""
    });
    const [loading, setLoading] = useState(false);

    const alertRef = useRef<number | null>(null); 

    useEffect(() => {
        if ((product && oldProduct) && (product.name.length > 3 && product.name !== oldProduct.name)) {
            const timeout = setTimeout(async () => {
                const res = await checkForDuplicates(product.name, +product.id);

                if (res !== "Duplicates are not found") {
                    setFieldErrors(prev => ({...prev, name: res ? res : "Something went wrong" }));

                } else {
                    setFieldErrors(prev => ({...prev, username: ""}));

                }

            }, 500);

            return () => clearTimeout(timeout);
        }

    }, [product?.name]);

    const onProductChange = (product: ProductDetail | null) => {
        if (product === null) return;
        setOldProduct(product);
        setProduct(product);
    };

    const onUndoClick = (field: string | undefined) => {
        if (!oldProduct) return;

        const doChanges = confirm(`Are you want to undo changes for field ${field}?`);
        if (!doChanges) return;

        setProduct(prev => {
            if (!prev) return null;

            switch (field) {
                case "name":
                    return { ...prev, name: oldProduct.name };

                case "price":
                    return { ...prev, price: oldProduct.price };

                case "stock":
                    return { ...prev, stock: oldProduct.stock };

                case "category_id":
                    return { ...prev, category_id: oldProduct.category_id };

                case "image_url":
                    return { ...prev, image_url: oldProduct.image_url };

                case "is_active":
                    return { ...prev, is_active: oldProduct.is_active };

                case "is_featured":
                    return { ...prev, is_featured: oldProduct.is_featured };

                case "description":
                    return { ...prev, description: oldProduct.description };

                case "sku":
                    return { ...prev, sku: oldProduct.sku };

                case "images":
                    return { ...prev, images: oldProduct.images };

                case "weight":
                    return { ...prev, weight: oldProduct.weight };

                case "unit":
                    return { ...prev, unit: oldProduct.unit };

                default:
                    return oldProduct;
            }
        });
    };

    const checkForDuplicates = async (name: string, id: number): Promise<string | null> => {
        try {
            setLoading(true);

            const res = await checkForDuplicatesApi(name, id);

            if (!res) {
                showAlert("error", "Something went wrong");
                return null;
            }

            return res.info;

        } catch (err) {
            if (err instanceof Error) {
                showAlert("error", err.message);
            } else {
                showAlert("error", "Something went wrong");
            }

            return null;

        } finally {
            setLoading(false);

        };
    };

    const updateProduct = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            if (!product) return;
            setLoading(true);

            for (const [key, value] of Object.entries(fieldErrors)) {
                if (value) return showAlert("error", `Field ${value} is invalid`);
            }

            const res = await updateProductApi(product);

            if (!res) return showAlert("error", "Something went wrong");

            showAlert("success", "Product was successfully updated");

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

    const deleteProduct = async (): Promise<boolean> => {
        const deleteProduct = confirm("Are you want to delete product?");

        if (!deleteProduct) return false;

        try {
            if (!product) return false;
            setLoading(true);
            
            const res = await deleteProductApi(product.id);

            if (!res) {
                showAlert("error", "Something went wrong");
                return false;
            }

            showAlert("success", "Product was successfully deleted. You will be redirected to the product list...");
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

        };
    };

    const postProduct = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            if (!product) return;
            setLoading(true);

            for (const [key, value] of Object.entries(fieldErrors)) {
                if (value) return showAlert("error", `Field ${value} is invalid`);
            }

            const res = await postProductApi(product);

            if (!res) return showAlert("error", "Something went wrong");

            showAlert("success", "New product was successfully created");

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

    const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;

        if (!newName) {
            setFieldErrors(prev => ({ ...prev, name: "Product name can't be empty string" }));
        } else {
            setFieldErrors(prev => ({ ...prev, name: "" }));
        }

        setProduct(prev => {
            if (prev === null) return null;
            return {
                ...prev,
                name: newName
            };
        });
    };

    const onPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPrice = e.target.value.trim();

        const message = numberCheck(+newPrice, 2);

        if (message !== "") {
            setFieldErrors(prev => ({ ...prev, price: message }));
        } else {
            setFieldErrors(prev => ({ ...prev, price: "" }));
        }

        setProduct(prev => {
            if (prev === null) return null;
            return {
                ...prev,
                price: newPrice.toString()
            };
        });
    };

    const onStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStock = e.target.value.trim();

        const decimals = product?.unit === "pieces" ? 0 : 3;

        const message = numberCheck(+newStock, decimals);

        if (message !== "") {
            setFieldErrors(prev => ({ ...prev, stock: message }));
        } else {
            setFieldErrors(prev => ({ ...prev, stock: "" }));
        }

        setProduct(prev => {
            if (prev === null) return null;
            return {
                ...prev,
                stock: newStock
            };
        });
    };

    const onCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const categoryId = +e.target.value;

        if (Number.isNaN(categoryId) || categoryId < 0)  {
            setFieldErrors(prev => ({ ...prev, category_id: "Category should be a positive number or 0" }));
        } else {
            setFieldErrors(prev => ({ ...prev, category_id: "" }));
        }
        
        setProduct(prev => {
            if (prev === null) return null;
            return {
                ...prev,
                category_id: categoryId
            };
        });
    };

    const onImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>, url: number) => {
        const newImageUrl = e.target.value.trim();

        if (url === 1) {
            setImageUrl(newImageUrl);
        } else {
            setImagesUrl(newImageUrl);
        }
    }

    const onImageSave = () => {
        if (imageUrl === product?.image_url) return showAlert("error", "Image with this URL is already uploaded");

        try {
            new URL(imageUrl.toString());

            setFieldErrors(prev => ({...prev, image_url: ""}));

        } catch (err) {
            if (err instanceof Error) {
                setFieldErrors(prev => ({ ...prev, image_url: err.message }));
            } else {
                setFieldErrors(prev => ({ ...prev, image_url: "Invalid URL format" }));
            }
    
        }

        setProduct(prev => {
            if (prev === null) return null;
            return {
                ...prev,
                image_url: imageUrl
            };
        });
    };

    const onImagesSave = () => {
        if (product?.images.includes(imagesUrl)) {
            return showAlert("error", "Image with this URL is already uploaded");

        }

        try {
            new URL(imageUrl.toString());

            setFieldErrors(prev => ({ ...prev, images: "" }));

        } catch (err) {
            if (err instanceof Error) {
                setFieldErrors(prev => ({ ...prev, images: err.message }));

            } else {
                setFieldErrors(prev => ({ ...prev, images: "Invalid URL format" }));

            }
    
        }
        
        if (product && product.images.length > 10) {
            setFieldErrors(prev => ({ ...prev, images: "Product can have only 10 images attached at a time" }));

        } else {
            setFieldErrors(prev => ({ ...prev, images: "" }));

        }

        const newImages = product ? product.images.slice() : [];

        newImages.push(imagesUrl);

        setProduct(prev => {
            if (prev === null) return null;
            return {
                ...prev,
                images: newImages
            };
        });
    };

    const onIsActiveChange = () => {
        setProduct(prev => {
            if (prev === null) return null;
            return {
                ...prev,
                is_active: !prev.is_active
            };
        });
    };

    const onIsFeaturedChange = () => {
        setProduct(prev => {
            if (prev === null) return null;
            return {
                ...prev,
                is_featured: !prev.is_featured
            };
        });
    };

    const onDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newDescription = e.target.value;

        if (newDescription.length > 1000) {
            setFieldErrors(prev => ({ ...prev, description: "Description maximum length is 1000 symbols" }));
        } else {
            setFieldErrors(prev => ({ ...prev, description: "" }));
        }

        setProduct(prev => {
            if (prev === null) return null;
            return {
                ...prev,
                description: newDescription
            };
        });
    };

    const onSKUChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSku = e.target.value.trim();

        if (newSku.length < 6) {
            setFieldErrors(prev => ({ ...prev, sku: "SKU length should be 6 symbols long" }));

        } else if (newSku.length === 7) {
            const firstHalf = newSku.slice(0,3);
            const mid = newSku.slice(3, 4);
            const secondHalf = newSku.slice(4, 7);

            if (typeof(firstHalf) !== "string" || mid !== "-" || !Number.isInteger(+secondHalf)) {
                setFieldErrors(prev => ({ ...prev, sku: "Wrong SKU format" }));
            }
        
        } else {
            setFieldErrors(prev => ({ ...prev, sku: "" }));
        
        }

        setProduct(prev => {
            if (prev === null) return null;
            return {
                ...prev,
                sku: newSku
            };
        });
    };

    const onDeleteImage = async () => {
        setProduct(prev => {
            if (prev === null) return null;
            return {
                ...prev,
                image_url: ""
            };
        });
    };

    const onDeleteImages = async (imageToDel: string) => {
        if (!product) return;

        const newImages = product.images.filter(image => image !== imageToDel);

        setProduct(prev => {
            if (prev === null) return null;
            return {
                ...prev,
                images: newImages
            };
        });
    };

    const onWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newWeight = e.target.value.trim();

        const message = numberCheck(+newWeight, 2);

        if (message !== "") {
            setFieldErrors(prev => ({ ...prev, weight: message }));
        } else {
            setFieldErrors(prev => ({ ...prev, weight: "" }));
        }

        setProduct(prev => {
            if (prev === null) return null;
            return {
                ...prev,
                weight: +newWeight
            };
        });
    };

    const onUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newUnit = e.target.value;
        const allowedUnits = ["liter", "kg", "piece", "pack"];

        if (!allowedUnits.includes(newUnit)) {
            setFieldErrors(prev => ({ ...prev, unit: "This unit type is not allowed" }));

        } else if (product && (newUnit === "piece" && countDecimals(+product.stock) > 0)) {
            setFieldErrors(prev => ({ ...prev, unit: "Stock can't be a decimal number, if unit is piece" }));

        } else {
            setFieldErrors(prev => ({ ...prev, unit: "" }));

        }

        setProduct(prev => {
            if (prev === null) return null;
            return {
                ...prev,
                unit: newUnit
            };
        });
    };

    const showAlert = (type: "success" | "error", message: string) => {
        setAlert({ type, message });

        if (alertRef.current) {
            clearTimeout(alertRef.current);
        }

        alertRef.current = setTimeout(() => {
            setAlert(null);
        }, 5000);
    };

    const removeAlert = () => setAlert(null);

    return {
        oldProduct,
        product,
        imageUrl,
        imagesUrl,
        alert,
        loading,
        fieldErrors,
        onProductChange,
        onNameChange,
        onPriceChange,
        onCategoryChange,
        onStockChange,
        onIsActiveChange,
        onIsFeaturedChange,
        onDescChange,
        onSKUChange,
        onImageUrlChange,
        onImageSave,
        onImagesSave,
        onDeleteImage,
        onDeleteImages,
        onWeightChange,
        onUnitChange,
        onUndoClick,
        removeAlert,
        updateProduct,
        deleteProduct,
        postProduct
    };
}