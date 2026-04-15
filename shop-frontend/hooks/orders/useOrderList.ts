import { useState, useRef, useEffect } from "react";
import type { Order } from "../../types/order"
import { getOrdersApi } from "../../api/orders/getOrdersApi";
import { updateCustomerNotesApi } from "../../api/orders/updateCustomerNotesApi";
import { deleteOrderApi } from "../../api/orders/deleteOrderApi";

const ITEMS_PER_PAGE = 10;

export function useOrderList() {
    const [orders, setOrders] = useState<Order[] | null>(null);
    const [filters, setFilters] = useState<{limit: number, offset: number}>({limit: 10, offset: 0});
    const [selected, setSelected] = useState<{orderId: number, note: string | null} | null>(null);
    const [alert, setAlert] = useState<{type: "success" | "error", message: string} | null>(null);
    const [loading ,setLoading] = useState<boolean>(false);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    const alertRef = useRef<number | null>(null);

    useEffect(() => {
        const fetchData = async () => await getOrders();
        fetchData();
    }, [filters]);

    const getOrders = async () => {
        try {
            setLoading(true);

            const res = await getOrdersApi(filters);

            if (!res) return showAlert("error", "Was unable to retrieve orders");

            setOrders(res);
            console.log(res)
            res.length > 0 ? setTotalCount(Number(res[0].total)) : setTotalCount(0);

        } catch (err) {
            if (err instanceof Error) {
                showAlert("error", err.toString());
            } else {
                showAlert("error", "Something went wrong");
            }

        } finally {
            setLoading(false);

        }
    };

    const saveNotes = async () => {
        if (!selected) return;

        try {
            setLoading(true);

            const res = await updateCustomerNotesApi(selected.orderId, selected.note);
            
            if (!res) return showAlert("error", "Was unable to save note");;

            showAlert("success", "Order notes was successfully updated");
            
            getOrders();

        } catch (err) {
            if (err instanceof Error) {
                showAlert("error", err.toString());
            } else {
                showAlert("error", "Something went wrong");
            }

        } finally {
            setLoading(false);

        }
    };

    const handleEditChange = (orderId: number) => {
        if (!orders) return showAlert("error", "Order list is empty");

        const isSame = orderId === selected?.orderId;

        if (selected !== null) {
            const shouldSave = confirm("Do you want to save changes?");
            if (shouldSave) saveNotes();
        }

        if (isSame) {
            return setSelected(null);
        }

        const orderInfo = orders.find(order => order.id === orderId);

        setSelected(orderInfo ? {orderId: orderInfo.id, note: orderInfo.customer_notes} : null);
    };

    const onNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSelected(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                note: e.target.value
            };
        });
    };

    const onSaveOrUndo = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!selected) return showAlert("error", "Order is not selected");

        if (e.ctrlKey) {
            saveNotes();
            setSelected(null);
        }
        else if (e.code === "Escape") {
            setSelected(null);
        }
    };

    const onDeleteOrder = async (orderId: number) => {
        try {
            const res = await deleteOrderApi(orderId);

            if (!res) return showAlert("error", "Something went wrong");

            showAlert("success", "Order was successfully deleted")

            getOrders();

        } catch (err) {
            if (err instanceof Error) {
                showAlert("error", err.toString());
            } else {
                showAlert("error", "Something went wrong");
            }

        } finally {
            setLoading(false);

        }
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

    const onPageChange = (page: number) => {
        setCurrentPage(page);
        setFilters(prev => ({...prev, offset: (page - 1) * ITEMS_PER_PAGE}));
    };

    return {
        orders,
        selected,
        getOrders,
        alert,
        loading,
        totalCount,
        currentPage,
        totalPages,
        handleEditChange,
        onNoteChange,
        onSaveOrUndo,
        onDeleteOrder,
        removeAlert,
        onPageChange
    };
}