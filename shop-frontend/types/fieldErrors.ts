export interface FieldErrors {
    username: string;
    email: string;
    password: string;
    phone: string;
}

export interface OrderFieldErrors {
    shippingFullname: string;
    shippingAddressLine1: string;
    shippingCity: string;
    shippingPostalCode: string;
    shippingCountry: string;
    paymentMethod: string;
}

export interface ProductEditFieldErrors {
    name: string;
    price: string;
    stock: string;
    category_id: string;
    image_url: string;
    is_active: string;
    is_featured: string;
    description: string;
    sku: string;
    images: string;
    weight: string;
    unit: string;
}

export interface CategoryEditFieldErrors {
    name: string;
    description: string;
    image_url: string;
    display_order: string;
    is_active: string;
}