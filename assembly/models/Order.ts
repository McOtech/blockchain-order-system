import { context } from 'near-sdk-as';
import { Carts, KEY_LENGTH, Orders } from '../constants';
import { generateRandomKey } from '../utils';
import { Cart } from './Cart';

@nearBindgen
export class Order {
  private id: string;
  private delivery: string;
  private cart: Cart;
  private isCleared: bool;
  private isDelivered: bool;

  constructor(delivery: string) {
    this.setId();
    this.setDelivery(delivery);
    this.setCart();
    this.setIsCleared(false);
    this.setIsDelivered(false);
  }

  private setId(): void {
    let flag: bool = false;
    while (flag == false) {
      let id = generateRandomKey(KEY_LENGTH);
      if (!Orders.contains(id)) {
        this.id = id;
        flag = true;
      }
    }
  }

  getId(): string {
    return this.id;
  }

  private setDelivery(id: string): void {
    this.delivery = id;
  }

  getDelivery(): string {
    return this.delivery;
  }

  private setCart(): void {
    this.cart = Carts.getSome(context.sender);
  }

  getCart(): Cart {
    return this.cart;
  }

  setIsCleared(flag: bool): void {
    this.isCleared = flag;
  }

  getIsCleared(): bool {
    return this.isCleared;
  }

  setIsDelivered(flag: bool): void {
    this.isDelivered = flag;
  }

  getIsDelivered(): bool {
    return this.isDelivered;
  }
}
