import { useState } from "react";
import type { Cart } from "../../types/cart";

export function useSelect() {
    const [selectedItems, setSelectedItems] = useState<Cart[] | null>(null);

    const selectItem = (selected: boolean, newCi: Cart) => {
        if (!selectedItems) {
            const newSelectedItems = [newCi];
            return setSelectedItems(newSelectedItems);
        }

        if (selected) {
            const newSelectedItems = selectedItems.filter(ci => ci.product_id !== newCi.product_id);
            setSelectedItems(newSelectedItems);
        } else {
            const newSelectedItems = selectedItems.slice();
            newSelectedItems.push(newCi);
            setSelectedItems(newSelectedItems);
        }
    };

    const loadOrderCart = (orderCart: Cart[]) => setSelectedItems(orderCart);

    return {
        selectedItems,
        selectItem,
        loadOrderCart
    };
}