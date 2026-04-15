import { useState, useRef, useEffect } from "react";
import type { Cart } from "../../types/cart";
import { EUROPEAN_COUNTRIES } from "../../data/countries";
import { postOrderApi } from "../../api/orders/postOrderApi";
import { validatePhoneFormat } from "../../utils/validatePhoneFormat";

export function useOrderCreation() {
    const [shippingName, setShippingName] = useState<string>("");
    const [shippingPhone, setShippingPhone] = useState<string>("");
    const [phonePrefix, setPhonePrefix] = useState<string>("");
    const [shippingAddressLine1, setShippingAddressLine1] = useState<string>("");
    const [shippingAddressLine2, setShippingAddressLine2] = useState<string>("");
    const [shippingCity, setShippingCity] = useState<string>("");
    const [shippingPostalCode, setShippingPostalCode] = useState<string>("");
    const [shippingCountry, setShippingCountry] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [customerNotes, setCustomerNotes] = useState<string>("");
    const [alert, setAlert] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [phoneError, setPhoneError] = useState<string | null>(null);

    useEffect(() => {
        if (!shippingPhone || !phonePrefix) return;

        const fullNumber = `${phonePrefix}${shippingPhone}`;
        const error = validatePhoneFormat(fullNumber);
        setPhoneError(error ?? null);

    }, [shippingPhone]);

    const alertRef = useRef<number | null>(null);

    const postOrder = async (cart: Cart[] | null): Promise<number | null> => {
        try {
            setLoading(true);

            if (!cart || !shippingName || !shippingAddressLine1 || !shippingCity || !shippingPostalCode || (!shippingCountry || shippingCountry === "initial-value") || !paymentMethod) {
                showAlert("error", "Missing required fields");
                return null;
            }

            const orderInfo = {
                cart: cart, 
                shipping_name: shippingName, 
                shipping_phone: shippingPhone, 
                shipping_address_line1: shippingAddressLine1,
                shipping_address_line2: shippingAddressLine2, 
                shipping_city: shippingCity, 
                shipping_postal_code: shippingPostalCode, 
                shipping_country: shippingCountry,
                payment_method: paymentMethod, 
                customer_notes: customerNotes
            };

            const res = await postOrderApi(orderInfo);

            if (!res) {
                showAlert("error", "Something went wrong");
                return null;
            }

            showAlert("success", `Order was successfully created, order ID is ${res.data}`);

            return res.data;

        } catch (err) {
            if (err instanceof Error) {
                showAlert("error", err.toString());
            } else {
                showAlert("error", "Something went wrong");
            }

            return null;

        } finally {
            setLoading(false);
        }
    };

    const onShippingNameChange = (e: React.ChangeEvent<HTMLInputElement> | string) => {      
        if (typeof(e) === "string") {
            setShippingName(e);
        } else {
            const name = e.target.value.trim();
            setShippingName(name);
        }
    };

    const onShippingPhoneChange = (e: React.ChangeEvent<HTMLInputElement>  | string) => {
        if (typeof(e) === "string") {
            setShippingPhone(e);
        } else {
            const phone = e.target.value.trim();
            setShippingPhone(phone);
        }
    };

    const onShippingAddressLineChange = (addressNum: number, e: React.ChangeEvent<HTMLInputElement> | string) => {
        let address;

        if (typeof(e) === "string") {
            address = e;
        } else {
            address = e.target.value.trim();
        }
        
        if (addressNum === 1)  {
            setShippingAddressLine1(address);
        } else {
            setShippingAddressLine2(address);
        }
    };

    const onShippingCityChange = (e: React.ChangeEvent<HTMLInputElement> | string) => {
        if (typeof(e) === "string") {
            setShippingCity(e);
        } else {
            const city = e.target.value;
            setShippingCity(city);
        }
    };

    const onShippingPostalCodeChange = (e: React.ChangeEvent<HTMLInputElement> | string) => {
        if (typeof(e) === "string") {
            setShippingPostalCode(e);
        } else {
            const postalCode = e.target.value.trim();
            setShippingPostalCode(postalCode);
        }
    };

    const onShippingCountryChange = (e: React.ChangeEvent<HTMLSelectElement> | string) => {
        let country;

        if (typeof(e) === "string") {
            setShippingCountry(e);

            country = EUROPEAN_COUNTRIES.find(country => country.code === e);
        } else {
            const optionCountry = e.target.value.trim();
            setShippingCountry(optionCountry);

            country = EUROPEAN_COUNTRIES.find(country => country.code === optionCountry);
        }

        country ? setPhonePrefix(country.prefix) : setPhonePrefix("");
    };

    const onPaymentMethodChange = (method: string) => {
        const allowedMethods = ["bank_transfer", "digital_wallet", "cash"];

        if (!allowedMethods.includes(method)) return showAlert("error", "Invalid payment method");

        setPaymentMethod(method);
    };

    const onCustomerNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setCustomerNotes(e.target.value);

    const showAlert = (type: "success" | "error", message: string) => {
        setAlert({ type, message });

        if (alertRef.current) {
            clearTimeout(alertRef.current);
        }

        alertRef.current = setTimeout(() => {
            setAlert(null);
        }, 5000);
    };

    const removeAlert = () => setAlert(null);

    return {
        shippingName,
        shippingPhone,
        shippingAddressLine1,
        shippingAddressLine2,
        shippingCity,
        shippingPostalCode,
        shippingCountry,
        paymentMethod,
        customerNotes,
        alert,
        loading,
        phoneError,
        onShippingNameChange,
        onShippingPhoneChange,
        onShippingAddressLineChange,
        onShippingCityChange,
        onShippingPostalCodeChange,
        onShippingCountryChange,
        onPaymentMethodChange,
        onCustomerNotesChange,
        postOrder,
        removeAlert
    };
}