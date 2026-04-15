export interface Filter {
    categoryId: number | undefined;
    sort: string;
    sortType: string | undefined;
    priceMin: number;
    priceMax: number;
    isFeatured: string | undefined;
    limit: number | undefined;
    offset: number | undefined;
}