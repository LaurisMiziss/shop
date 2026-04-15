import { createContext, useContext, useState, useEffect, useRef } from "react";
import type { Cart } from "../types/cart";
import type { Filter } from "../types/filter";
import { getCartItemsApi } from "../api/cartItems/getCartItemsApi";
import { updateItemApi } from "../api/cartItems/updateItemApi";
import { deleteItemApi } from "../api/cartItems/deleteItemApi";
import { countDecimals } from "../utils/countDecimals";

interface CartContextType {
  cart: Cart[] | null;
  name: string;
  selected: {product: Cart, quantity: number} | null;
  filter: Filter;
  loading: boolean;
  alert: {type: "success" | "error", message: string} | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  getCartItems: () => void;
  updateItem: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  deleteItem: (productId: number) => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updateSelected: (product: Cart, e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterPriceChange: (scale: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSortTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onIsFeaturedChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  removeAlert: () => void;
  onPageChange: (page: number) => void;
}

const ITEMS_PER_PAGE = 10;

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart[] | null>(null);
  const [name, setName] = useState<string>("");
  const [selected, setSelected] = useState<{product: Cart, quantity: number} | null>(null);
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
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const timeoutRef = useRef<number | null>(null);
  const quantityRef = useRef<number | null>(null);
  const priceRef = useRef<number | null>(null);

  useEffect(() => {
    setTotalCount(0);
    setCurrentPage(0);
    setName("");

    const loadData = async () => await getCartItems();
    loadData();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => await getCartItems(), name.length > 0 ? 500 : 0);
    return () => clearTimeout(timeout);
  }, [filter, name]);

  const getCartItems = async () => {
    setLoading(true);

    try {
        const allowedSort = ["name", "price", "stock", "added_at"];

        if (!allowedSort.includes(filter.sort)) return showAlert("error", "Invalid sort");

        const res = await getCartItemsApi(name, filter.categoryId, filter.sort, filter.sortType, filter.priceMin, filter.priceMax, filter.isFeatured, filter.limit, filter.offset);

        if (!res) return showAlert("error", "Something went wrong");

        setCart(res);

        res.length > 0 ? setTotalCount(Number(res[0].total)) : setTotalCount(0);

    } catch (err) {
      if (err instanceof Error) {
          showAlert("error", err.toString())
      } else {
          showAlert("error", "Something went wrong")
      }
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!selected) return;

    if (e.key === "Escape") return setSelected(null);

    if (e.key === "Enter") {
      if (Number.isNaN(selected.product.product_id) || Number.isNaN(selected.quantity)) return showAlert("error", "Invalid product ID or quantity");

      if (selected.product.stock < selected.quantity) return showAlert("error", "Not enough in the stock");

      if (
          (selected.product.unit === "kg" && selected.quantity < 0.05) || 
          (selected.product.unit === "liter" && selected.quantity < 0.5) ||
          (selected.product.unit === "piece" && selected.quantity < 1)
        ) {
        let answer = confirm("You want to remove item from the cart?");

        if (!answer) return setSelected(null);

        return deleteItem(selected.product.product_id);

      }

      if ((selected.product.unit === "liter" || selected.product.unit === "kg") && countDecimals(selected.quantity) > 3) {
        return showAlert("error", "Invalid decimal number");
      }

      if (selected.product.unit === "piece" && countDecimals(selected.quantity) > 0) {
        return showAlert("error", "Invalid decimal number");
      }

      if (quantityRef.current) {
        clearTimeout(quantityRef.current);
      }

      quantityRef.current = setTimeout(async () => {
        try {
          setLoading(true);

          const res = await updateItemApi(selected.product.product_id, selected.quantity)

          if (!res) return showAlert("error", "Something went wrong");

          showAlert("success", "Product quantity was updated");

          await getCartItems();

        } catch (err) {
            if (err instanceof Error) {
                showAlert("error", err.toString())
            } else {
                showAlert("error", "Something went wrong")
            }
        } finally {
            setLoading(false);
            setSelected(null);
        }
      }, 200);
    }
  };

  const deleteItem = async (productId: number) => {
    setLoading(true);

    try {
      if (!Number.isInteger(productId)) return showAlert("error", "Invalid product ID");;

      const res = await deleteItemApi(productId);

      if (!res) return showAlert("error", "Invalid product ID or quantity");

      showAlert("success", "Product was deleted");

      await getCartItems();

    } catch (err) {
      if (err instanceof Error) {
          showAlert("error", err.toString())
      } else {
          showAlert("error", "Something went wrong")
      }
    } finally {
      setLoading(false);
    }
  };

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const updateSelected = (product: Cart, e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = +e.target.value;

    if (Number.isNaN(quantity)) return showAlert("error", "New quantity is not a number");

    setSelected({product: product, quantity: +quantity});
  };

  const onFilterPriceChange = (scale: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = Number(e.target.value);

    if (Number.isNaN(newPrice)) return;

    if (priceRef.current) {
        clearTimeout(priceRef.current);
    }

    priceRef.current = setTimeout(() => {
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
    const allowed = ["name", "price", "stock", "added_at"];
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

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    setFilter(prev => ({...prev, offset: (page - 1) * ITEMS_PER_PAGE}))
  };

  return (
    <CartContext.Provider value={{
      cart,
      name,
      selected,
      filter,
      loading,
      alert,
      totalCount,
      currentPage,
      totalPages,
      getCartItems,
      updateItem,
      deleteItem,
      onNameChange,
      updateSelected,
      onFilterPriceChange,
      onCategoryChange,
      onSortChange,
      onSortTypeChange,
      onIsFeaturedChange,
      removeAlert,
      onPageChange
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);

  if (!ctx) throw new Error("useCart must be used inside CartProvider");

  return ctx;
}