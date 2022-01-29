import { context, logging, u128 } from 'near-sdk-as';
import { Carts, Products } from '../constants';
import { Product } from './Product';
import { ProductOrdered } from './ProductOrdered';

@nearBindgen
export class Cart {
  productsOrdered: ProductOrdered[];
  subTotal: u128;
  shippingFee: u128;
  buyer: string;

  constructor(buyer: string) {
    this.cartInit(buyer);
  }

  addToCart(productId: string, quantity: u64): void {
    assert(
      Products.contains(productId),
      'Invalid product id! Please check and try again.'
    );
    const product: Product = Products.getSome(productId);
    const productOrdered = new ProductOrdered(
      product.getId(),
      product.getPrice(),
      quantity,
      product.getShippingFee()
    );
    this.productsOrdered.push(productOrdered);
    logging.log(product.getName() + ' successfully added.');
    this.setAmountPaid();
    this.updateCart();
  }

  removeFromCart(productId: string): void {
    assert(
      Products.contains(productId),
      'Invalid product id! Please check and try again.'
    );
    const remainingProducts = new Array<ProductOrdered>();
    for (let i = 0; i < this.productsOrdered.length; i++) {
      const pOrdered = this.productsOrdered[i];
      if (pOrdered.getId() != productId) {
        remainingProducts.push(pOrdered);
      }
    }
    assert(
      this.productsOrdered.length != remainingProducts.length,
      'Product not in cart!'
    );
    this.productsOrdered = remainingProducts;
    logging.log('Product successfully removed.');
    this.setAmountPaid();
    this.updateCart();
  }

  getBuyer(): string {
    return this.buyer;
  }

  setBuyer(buyer: string): void {
    this.buyer = buyer;
  }

  private setAmountPaid(): void {
    let newAmount = u128.fromU64(0);
    let newShippingFee = u128.fromU64(0);
    if (this.productsOrdered.length > 0) {
      for (let i = 0; i < this.productsOrdered.length; i++) {
        const pOrdered = this.productsOrdered[i];
        newAmount = u128.add(newAmount, pOrdered.getAmount());
        newShippingFee = u128.add(newShippingFee, pOrdered.getShippingFee());
      }
    }
    this.subTotal = u128.fromU128(newAmount);
    this.shippingFee = u128.fromU128(newShippingFee);
  }

  getSubTotal(): u128 {
    return this.subTotal;
  }

  static setSubTotal(amount: u128): void {
    this.su;
  }

  getShippingFee(): u128 {
    return this.shippingFee;
  }

  getTotalAmount(): u128 {
    return u128.add(this.getSubTotal(), this.getShippingFee());
  }

  getProductsOrdered(): ProductOrdered[] {
    return this.productsOrdered;
  }

  private cartInit(buyer: string): void {
    this.productsOrdered = [];
    this.subTotal = u128.fromU64(0);
    this.shippingFee = u128.fromU64(0);
    this.setBuyer(buyer);
  }

  private updateCart(): void {
    Carts.set(this.getBuyer(), this);
  }
}
