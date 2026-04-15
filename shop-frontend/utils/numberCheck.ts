import { countDecimals } from "./countDecimals";

export const numberCheck = (number: number, decimals: number): string => {
    if (Number.isNaN(number) || number < 0) return "Number should be a positive number or 0";

    const count = countDecimals(number);

    if (decimals < count) return "Wrong decimals";

    return "";

};