export interface Product {
    id: number;
    name: string;
    price: string;
    stock: number;
    category_id: number;
    image_url: string;
    is_active: boolean;
    is_featured: boolean;
    total: string | undefined;
}

export interface GetProductsResponse {
    info: string;
    data: Product[];
    success: boolean;
}

export interface ProductDetail extends Product {
    description: string;
    sku: string;
    images: string[];
    weight: number;
    unit: string;
    created_at: string;
    updated_at: string;
}

export interface GetProductDetailResponse {
    info: string;
    data: ProductDetail;
    success: boolean
}

