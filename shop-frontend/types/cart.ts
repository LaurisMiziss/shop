export interface Cart {
    id: number;
    user_id: number;
    product_id: number;
    quantity: number;
    added_at: string;
    name: string;
    price: string;
    unit: string;
    stock: number;
    category_id: number;
    image_url: string;
    is_active: boolean;
    is_featured: boolean;
    total: string | undefined;
}