export interface Category {
    id: number;
    name: string;
    description: string;
    image_url: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
}

export interface GetCategoryResponse {
    info: string;
    data: Category[];
    success: boolean;
}