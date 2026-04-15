import type { Cart } from "./cart"

export interface OrderCreation {
    cart: Cart[] | null;
    shipping_name: string | null;
    shipping_phone: string | null;
    shipping_address_line1: string | null;
    shipping_address_line2: string | null;
    shipping_city: string | null;
    shipping_postal_code: string | null;
    shipping_country: string | null;
    payment_method: string | null;
    customer_notes: string | null;
}

export interface Item {
    product_id: number;
    product_name: string;
    product_price: number;
    quantity: number;
    subtotal: number;
}

export interface Order {
    id: number;
    user_id: number;
    total_amount: number;
    status: string;
    created_at: string;
    customer_notes: string | null;
    items: Item[];
    edit: boolean | undefined;
    total: number;
}

export interface GetOrderResponse {
    success: boolean;
    data: Order[];
    info: string;
}