import { apiFetch } from "../../utils/apiFetch";
import type { User, LoginResponse } from '../../types/user';

export const onLoginByTokenApi = async (
    token: string
): Promise<User | null> => {
  try {
    const res = await apiFetch("/auth/login_by_token", {
      method: "POST",
      headers: ({ token }),
    });

    if (!res.ok) return null;

    const json: LoginResponse = await res.json();

    if (!json.success) return null;

    return json.data;

  } catch (err) {
    console.error(err);
    return null;
  }
};