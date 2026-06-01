import { useState, useEffect, useRef } from "react";
import type { User, UserInList } from "../../../types/user";
import { getUsersApi } from "../../../api/admin/users/getUsersApi";
import { getUserApi } from "../../../api/admin/users/getUserApi";

export function useUserList() {
    const [users, setUsers] = useState<UserInList[] | null>(null);
    const [filters, setFilters] = useState<{limit: number, offset: number}>({limit: 10, offset: 0});
    const [query, setQuery] = useState("");
    const [view, setView] = useState<"table" | "grid">("table");
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{type: "success" | "error", message: string} | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const alertRef = useRef<number | null>(null);

    const queryRef = useRef<number | null>(null);
    
    const totalPages =  users && users[0]?.total ? Math.ceil(users?.[0].total / filters.limit) : 0;

    useEffect(() => {
        const fetchUsers = async () => await getUsers(filters.limit, filters.offset, undefined);
        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => await getUsers(10, 0, undefined);

        if (!query || query === "0") {
            fetchUsers();
            return;
        }
        
        if (queryRef.current) clearTimeout(queryRef.current);

        queryRef.current = setTimeout(async () => {
            setAlert(null);
            setCurrentPage(1);
            await getUsers(1, 0, +query);
        }, 1200);

    }, [query]);

    useEffect(() => {
        setQuery("");
        const fetchUsers = async () => await getUsers(filters.limit, filters.offset, undefined);
        fetchUsers();
    }, [filters]);

    const getUsers = async (limit: number, offset: number, userId: number | undefined) => {
        try {
            setLoading(true);

            const res = await getUsersApi(limit, offset, userId);

            if (!res) {
                showAlert("error", "User with this ID is not found");
                return setUsers([]);
            }

            if (!Array.isArray(res.data)) return setUsers([res.data]);

            setUsers(res.data);

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

    const getUser = async (userId: number): Promise<User | null> => {
        try {
            setLoading(true);

            const res = await getUserApi(userId);

            if (!res) {
                showAlert("error", "Something went wrong");
                return null;
            }

            return res.data;

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
        users,
        query,
        view,
        loading,
        alert,
        currentPage,
        totalPages,
        getUser,
        getUsers,
        onQueryChange,
        onViewChange,
        removeAlert,
        onPageChange
    };
}