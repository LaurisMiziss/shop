import { useState, useRef } from "react";
import { postItemApi } from "../../api/cartItems/postItemApi";

export function useProductDetails() {
    const [quantity, setQuantity] = useState(0);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const timeoutRef = useRef<number | null>(null);

    const onQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const quantity = +e.target.value;

        if (Number.isNaN(quantity)) return;

        setQuantity(quantity);
    };

    const showAlert = (type: "success" | "error", message: string) => {
        setAlert({ type, message });

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setAlert(null);
        }, 5000);
    };

    const removeAlert = () => setAlert(null);

    const onAddToCart = async (productId: number, quantity: number, unit: string) => {
        setLoading(true);
        setAlert(null);

        try {
            const allowedUnit = ["kg", "piece", "liter"];

            if (!productId || !allowedUnit.includes(unit)) return showAlert("error", "Product is not selected or unit is not found");

            if (!quantity) return showAlert("error", "Invalid quantity");

            if (unit === "kg" && quantity < 0.05) return showAlert("error", "Quantity must be at least 0.05kg");

            if (unit === "liter" && quantity < 0.5) return showAlert("error", "Quantity must be at least 1 liter");

            if (unit === "piece" && quantity < 1) return showAlert("error", "Quantity must be at least 1 piece");

            const res = await postItemApi(productId, quantity, unit);

            if (!res) return showAlert("error", "Something went wrong");

            return showAlert("success", "Product was added to the your cart")

        } catch (error) {
            if (error instanceof Error) {
                showAlert("error", error.toString())
            } else {
                showAlert("error", "Something went wrong")
            }

        } finally {
            setLoading(false);
        }
    };

    return {
        quantity,
        loading,
        alert,
        onQuantityChange,
        removeAlert,
        onAddToCart
    };
}