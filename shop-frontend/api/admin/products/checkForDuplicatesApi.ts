import { apiFetch } from "../../../utils/apiFetch";
import type { Response } from "../../../types/response";

export const checkForDuplicatesApi = async (
    name: string,
    id: number
): Promise<Response | null> => {
    const token = localStorage.getItem("token");

    if (!token) return null;

    try {
        const res = await apiFetch(`/products/admin/check?name=${name}&id=${id}`, {
            method: "GET",
            headers: ({ token })
        });

        if (!res.ok && res.status !== 409) return null;

        const json: Response = await res.json();

        return json;

    } catch (err) {
        console.log(err);
        return null;
    }
};