import { u128 } from 'near-sdk-as';

@nearBindgen
export class ProductOrdered {
  id: string;
  price: u128;
  quantity: u64;
  shippingFee: u128;
  amount: u128;

  constructor(id: string, price: u128, qty: u64, sFee: u128) {
    this.setId(id);
    this.setPrice(price);
    this.setQuantity(qty);
    this.setShippingFee(sFee);
    this.setAmount();
  }

  private setId(id: string): void {
    this.id = id;
  }

  private setPrice(price: u128): void {
    this.price = price;
  }

  private setQuantity(qty: u64): void {
    this.quantity = qty;
  }

  private setShippingFee(fee: u128): void {
    this.shippingFee = u128.fromU128(fee);
  }

  private setAmount(): void {
    const mul = u128.mul(this.getPrice(), u128.fromU64(this.getQuantity()));
    this.amount = u128.fromU128(mul);
  }

  getId(): string {
    return this.id;
  }

  getPrice(): u128 {
    return this.price;
  }

  getQuantity(): u64 {
    return this.quantity;
  }

  getShippingFee(): u128 {
    return this.shippingFee;
  }

  getAmount(): u128 {
    return this.amount;
  }
}
