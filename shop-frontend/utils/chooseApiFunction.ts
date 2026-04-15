import type { User } from "../types/user";
import { getProductsWithFiltersApi } from "../api/products/getProductsWithFiltersApi";
import { getAdminProductsWithFiltersApi } from "../api/products/getAdminProductsWithFiltersApi";

export function chooseApiFunction(user: User | null, pathname: string) {
    const isAdminRoute = pathname.includes("/admin-panel");
    const isAdmin = user?.role === "admin";

    return isAdmin && isAdminRoute
        ? getAdminProductsWithFiltersApi
        : getProductsWithFiltersApi;
}