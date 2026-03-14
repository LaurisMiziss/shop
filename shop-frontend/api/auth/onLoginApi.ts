import type { User, LoginResponse } from '../../types/user';

export const onLoginApi = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const res = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) return null;

    const json: LoginResponse = await res.json();

    if (!json.success) return null;

    localStorage.setItem("token", json.token);

    return json.data; // ✓ return just the User

  } catch (err) {
    console.error(err); // network error, no internet, server down
    return null;
  }
};