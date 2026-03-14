import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";

export const validatePhoneFormat = (phone: string): string | null => {
    if (!phone) return null;

    try {
        const parsed = parsePhoneNumber(phone);

        if (!parsed) return "Invalid phone number";
        if (!parsed.isPossible()) return "Phone number is too short or too long";
        if (!parsed.isValid()) return "Invalid phone number for this country";

        return null; // null means no error — valid number
    } catch {
        return "Invalid phone number — include country code (e.g. +371...)";
    }
};