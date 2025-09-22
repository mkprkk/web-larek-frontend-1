export class Basket implements IBasket {
    products: IProduct[] = [];
    total: number = 0;

    addProduct(product: IProduct): void {
        this.products.push(product);
        this.calculateTotal();
    }

    removeProduct(productId: string): void {
        this.products = this.products.filter((product) => product.id !== productId);
        this.calculateTotal();
    }

    calculateTotal(): void {
        this.total = this.products.reduce((sum, product) => {
            return sum + (product.price || 0);
        }, 0);
    }

    clear(): void {
        this.products = [];
        this.total = 0;
    }
}