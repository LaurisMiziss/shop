import "./Filter.css";
import type { Filter } from "../../types/filter";
import type { Category } from "../../types/category";

interface FilterProps {
    name: string;
    categories: Category[] | null;
    filter: Filter;
    onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFilterPriceChange: (scale: string, e: React.ChangeEvent<HTMLInputElement>) => void;
    onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onSortTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onIsFeaturedChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function Filter({
    name,
    categories,
    filter,
    onNameChange,
    onFilterPriceChange,
    onCategoryChange,
    onSortChange,
    onSortTypeChange,
    onIsFeaturedChange
}: FilterProps) {
    return (
        <div className="filters">
            <div className="filter-group">
                <label>Name</label>
                <input type="text" value={name} placeholder="Search products in a cart..." onChange={(e) => onNameChange(e)} />   
            </div>
            {/* CATEGORY */}
            <div className="filter-group">
                <label>Category</label>
                <select onChange={onCategoryChange}>
                    <option value="">All</option>
                    {categories?.map(ct => (
                        <option key={ct.id} value={ct.id}>
                            {ct.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* FEATURED */}
            <div className="filter-group">
                <label>Featured</label>
                <select onChange={onIsFeaturedChange}>
                    <option value="">All</option>
                    <option value="true">Only featured</option>
                </select>
            </div>

            {/* PRICE */}
            <div className="filter-group">
                <label>Price range</label>

                <div className="price-inputs">
                    <input
                        type="number"
                        value={filter.priceMin}
                        onChange={(e) => onFilterPriceChange("min", e)}
                        placeholder="Min"
                    />
                    <input
                        type="number"
                        value={filter.priceMax}
                        onChange={(e) => onFilterPriceChange("max", e)}
                        placeholder="Max"
                    />
                </div>

                <input
                    type="range"
                    value={filter.priceMin}
                    onChange={(e) => onFilterPriceChange("min", e)}
                    min="0"
                    max="9999"
                />

                <input
                    type="range"
                    value={filter.priceMax}
                    onChange={(e) => onFilterPriceChange("max", e)}
                    min="1"
                    max="10000"
                />
            </div>

            {/* SORT */}
            <div className="filter-group">
                <label>Sort by</label>
                <select onChange={onSortChange}>
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                    <option value="stock">Stock</option>
                    <option value="added_at">Added at</option>
                </select>
            </div>

            {/* SORT TYPE */}
            <div className="filter-group">
                <label>Order</label>
                <select onChange={onSortTypeChange}>
                    <option value="DESC">Descending</option>
                    <option value="ASC">Ascending</option>
                </select>
            </div>
        </div>
    );
}