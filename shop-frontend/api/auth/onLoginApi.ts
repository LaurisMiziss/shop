import { apiFetch } from "../../utils/apiFetch";
import type { User, LoginResponse } from '../../types/user';

export const onLoginApi = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) return null;

    const json: LoginResponse = await res.json();

    if (!json.success) return null;

    localStorage.setItem("token", json.token);

    return json.data;

  } catch (err) {
    console.error(err);
    return null;
  }
};