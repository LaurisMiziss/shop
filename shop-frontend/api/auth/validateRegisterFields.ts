import { apiFetch } from "../../utils/apiFetch";
import type { Response } from '../../types/response';

export const validateRegisterFields = async (
    username: string | undefined,
    email: string | undefined,
    phone: string | undefined
): Promise<Response | null> => {
  try {
    const res = await apiFetch(`/auth/check?username=${username}&email=${email}&phone=${phone}`, {
      method: "GET",
    });
    
    if (!res.ok && res.status !== 409) return null;

    const json: Response = await res.json();

    return json;
    
  } catch (err) {
    console.error(err);
    return null;
  }
};