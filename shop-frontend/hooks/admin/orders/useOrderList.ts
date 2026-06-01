import { useState, useEffect, useRef } from "react";
import type { Order } from "../../../types/order";
import { getAllOrdersApi } from "../../../api/admin/orders/getAllOrdersApi";
import { getOrderDetailsApi } from "../../../api/admin/orders/getOrderDetails";

export function useOrderList() {
    const [orders, setOrders] = useState<Order[] | null>(null);
    const [filters, setFilters] = useState<{limit: number, offset: number}>({limit: 10, offset: 0});
    const [query, setQuery] = useState("");
    const [view, setView] = useState<"table" | "grid">("table");
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{type: "success" | "error", message: string} | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const alertRef = useRef<number | null>(null);

    const queryRef = useRef<number | null>(null);

    const totalPages =  orders?.length ? Math.ceil(orders?.[0].total / filters.limit) : 0;

    useEffect(() => {
        const fetchOrders = async () => await getAllOrders(filters.limit, filters.offset, undefined);
        fetchOrders();
    }, []);

    useEffect(() => {
        const fetchOrders = async () => await getAllOrders(10, 0, undefined);

        if (!query || query === "0") {
            fetchOrders();
            return;
        }

        if (queryRef.current) clearTimeout(queryRef.current);

        queryRef.current = setTimeout(async () => {
            setAlert(null);
            setCurrentPage(1);
            await getAllOrders(10, 0, +query);
        }, 1200);

    }, [query]);

    useEffect(() => {
        setQuery("");
        const fetchOrders = async () => await getAllOrders(filters.limit, filters.offset, undefined);
        fetchOrders();
    }, [filters]);

    const getAllOrders = async (limit: number, offset: number, orderId: number | undefined) => {
        try {
            setLoading(true);
            const res = await getAllOrdersApi(limit, offset, orderId);

            if (!res) {
                showAlert("error", "Order with this ID is not found");
                return setOrders([]);
            }

            if (!Array.isArray(res.data)) return setOrders([res.data]);

            return setOrders(res.data);
        
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

    const getOrderDetails = async (orderId: number): Promise<Order | null> => {
        try {
            setLoading(true);
            const res = await getOrderDetailsApi(orderId);

            if (!res) {
                showAlert("error", "Something went wrong");
                return null;
            }
            console.log(res)
            if (!Array.isArray(res.data)) {
                return res.data;
            } else {
                return null;
            }
        
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

    const onViewChange = (view: "table" | "grid") => setView(view);

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
        orders,
        filters,
        query,
        view,
        loading,
        alert,
        currentPage,
        getAllOrders,
        onQueryChange,
        getOrderDetails,
        onViewChange,
        removeAlert,
        totalPages,
        onPageChange
    };
}