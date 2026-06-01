export interface Category {
    id: number;
    name: string;
    description: string;
    image_url: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
    total: number | undefined;
}

export interface GetCategoryResponse {
    info: string;
    data: Category[];
    success: boolean;
}

export interface GetCategoryDetailsResponse {
    info: string;
    data: Category;
    success: boolean;
}