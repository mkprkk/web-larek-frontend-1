import { Cart } from "./cart";
import { CDN_URL } from "../../utils/constants";

export class Product implements IProductInstance {
    static products: IProductInstance[] = [];

    id: string;
    description: string;
    image: string;
    title: string;
    category: ProductCategory;
    price: number | null;

    constructor(productData: IProduct, private cart: Cart) {
        this.id = productData.id;
        this.description = productData.description;
        this.image = `${CDN_URL}/${productData.image}`;
        this.title = productData.title;
        this.category = productData.category;
        this.price = productData.price;
        Product.products.push(this);
    }

    addToCart(): void {
        this.cart.addProduct(this);
    }

    removeFromCart(): void {
        this.cart.removeProduct(this.id);
    }

    get hasPrice(): boolean {
        return this.price !== null;
    }
}