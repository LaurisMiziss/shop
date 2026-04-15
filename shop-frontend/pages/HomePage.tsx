import { useAuth } from "../context/AuthContext";
import { getProductDetailsApi } from "../api/products/getProductDetailsApi";
import { getProductsWithFiltersApi } from "../api/products/getProductsWithFiltersApi";
import { getCategoriesApi } from "../api/categories/getCategoriesApi"
import { useNavigate } from "react-router-dom";

export default function HomePage({}) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const a = async () => {
        const res = await getProductsWithFiltersApi(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
        console.log(res)
    }

    const b = async () => {
        const res = await getCategoriesApi();
        console.log(res);
    }

    const c = async () => {
        navigate("/shop-products")
    }

    return (
        <div>
            <button onClick={a}>aaa</button>
            <button onClick={b}>aaa</button>
            <button onClick={c}>cccccc</button>
            {user && <p>{user.username}</p>}
        </div>
    );
}