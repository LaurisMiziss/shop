import type { Response } from '../../types/response';

export const validateRegisterFields = async (
    username: string | undefined,
    email: string | undefined,
    phone: string | undefined
): Promise<Response | null> => {
  try {
    const res = await fetch(`http://localhost:3001/api/auth/check?username=${username}&email=${email}&phone=${phone}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    
    if (!res.ok && res.status !== 409) return null;

    const json: Response = await res.json();

    return json;
    
  } catch (err) {
    console.error(err);
    return null;
  }
};