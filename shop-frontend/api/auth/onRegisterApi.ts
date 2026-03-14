import type { Response } from '../../types/response';

export const onRegisterApi = async (
    username: string,
    email: string,
    password: string,
    full_name: string,
    phone: string,
    address_line1: string,
    address_line2: string,
    country: string,
    city: string,
    postal_code: string
): Promise<Response | null> => {
  try {
    const res = await fetch("http://localhost:3001/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, full_name, phone, address_line1, address_line2, country, city, postal_code })
    });

    if (!res.ok) return null;

    const json: Response = await res.json();

    return json;
    
  } catch (err) {
    console.error(err);
    return null;
  }
};