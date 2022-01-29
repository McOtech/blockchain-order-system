import { u128 } from 'near-sdk-as';
import { KEY_LENGTH, Products } from '../constants';
import { generateRandomKey } from '../utils';

@nearBindgen
export class Product {
  id: string;
  price: u128;
  name: string;
  shippingFee: u128;
  index: u64;

  constructor(index: u64, name: string, price: u128, shippingFee: u64) {
    this.setIndex(index);
    this.setId();
    this.setName(name);
    this.setPrice(price);
    this.setShippingFee(shippingFee);
  }

  getId(): string {
    return this.id;
  }

  getPrice(): u128 {
    return this.price;
  }

  getName(): string {
    return this.name;
  }

  getShippingFee(): u128 {
    return this.shippingFee;
  }

  getIndex(): u64 {
    return this.index;
  }

  private setId(): void {
    let flag: bool = false;
    while (flag == false) {
      let id = generateRandomKey(KEY_LENGTH);
      if (!Products.contains(id)) {
        this.id = id;
        flag = true;
      }
    }
  }

  setName(name: string): void {
    this.name = name;
  }

  setPrice(price: u128): void {
    this.price = price;
  }

  setShippingFee(amount: u64): void {
    this.shippingFee = u128.fromU64(amount);
  }

  setIndex(index: u64): void {
    this.index = index;
  }
}
