import { context, PersistentDeque, u128 } from 'near-sdk-as';
import { Carts, Orders, ProductIds, Products } from './constants';
import { Accounts } from './models/Accounts';
import { Cart } from './models/Cart';
import { Order } from './models/Order';
import { Product } from './models/Product';
import { ProductId } from './models/ProductId';
import { ProductOrdered } from './models/ProductOrdered';

export class Contract {
  seller: string = '<seller-accountId>';

  // ================================================================
  // SELLER FUNCTIONS
  // ================================================================

  /**
   * This is a call function that changes the state by adding a single product.
   * @param name : Name of the product.
   * @param price : Price of the product.
   * @param sFee : Product's shipping fee.
   * @returns product id.
   */
  addProduct(name: string, price: u64, sFee: u64): string {
    assert(
      context.sender == this.seller,
      'You are Unauthorized to perform this transaction.'
    );
    const product = new Product(
      ProductIds.length,
      name,
      u128.fromU64(price),
      sFee
    );
    Products.set(product.getId(), product);

    if (ProductIds.length > 0) {
      const idStorage = ProductIds.pop();
      idStorage.add(product.getId());
      ProductIds.push(idStorage);
    } else {
      const idStorage = new ProductId();
      idStorage.add(product.getId());
      ProductIds.push(idStorage);
    }
    return product.getId();
  }

  /**
   * A call function.
   * It removes a single product from the Products collection.
   * @param id product id to be removed from Products collection
   */
  removeProduct(id: string): void {
    assert(
      context.sender == this.seller,
      'You are Unauthorized to perform this transaction.'
    );
    assert(Products.contains(id), 'Invalid product reference!');
    const product = Products.getSome(id);
    Products.delete(id);

    const idStorage = ProductIds.pop();
    idStorage.remove(product.getId());
    ProductIds.push(idStorage);
  }

  /**
   * A call function that changes order delivery state to true then initiates cash transactions of the involved parties.
   * @param orderId : id of the order to be confirmed.
   * @param delivery : the account-id of the delivery account.
   */
  confirmReturn(orderId: string, delivery: string): void {
    assert(
      context.sender == this.seller,
      'You are Unauthorized to perform this transaction.'
    );
    assert(Orders.contains(orderId), 'Invalid order id!');
    const order = Orders.getSome(orderId);
    assert(order.getDelivery() == delivery, 'Delivery id mismatch!');
    assert(
      !order.getIsDelivered(),
      'Order is already delivered! Invalidating return process.'
    );
    Accounts.transfer(delivery, this.seller);
    Accounts.transfer(order.getCart().getBuyer(), delivery);
    Accounts.activeTransfer(
      order.getCart().getBuyer(),
      delivery,
      order.getCart().getShippingFee()
    );
    order.setIsDelivered(true);
    Orders.set(order.getId(), order);
  }

  // ================================================================
  // BUYER FUNCTIONS
  // ================================================================

  /**
   * A call function to add item to cart.
   * @param id of the product to be added to cart.
   * @param qty : quantity of the product to be added to cart.
   */
  addToCart(id: string, qty: u64): void {
    if (Carts.contains(context.sender)) {
      const myCart: Cart = Carts.getSome(context.sender);
      myCart.addToCart(id, qty);
    } else {
      const myCart = new Cart(context.sender);
      myCart.addToCart(id, qty);
    }
  }

  /**
   * A call function to remove item from cart.
   * @param id of the product to be removed from cart.
   */
  removeFromCart(id: string): void {
    if (Carts.contains(context.sender)) {
      const myCart: Cart = Carts.getSome(context.sender);
      myCart.removeFromCart(id);
    }
  }

  /**
   * A call function to list items in cart
   * @returns a list of items in the cart, null otherwise.
   */
  viewCart(): Cart | null {
    if (Carts.contains(context.sender)) {
      return Carts.getSome(context.sender);
    }
    return null;
  }

  /**
   * A call function to change cart items into sales.
   * It initiates locking of money in buyer's account for further order processing stages.
   * @param delivery account id of the delivery person
   * @returns order id of the just placed order.
   */
  placeOrder(delivery: string): string {
    assert(
      Carts.contains(context.sender),
      'Empty cart! To proceed, select products to order.'
    );
    assert(delivery.length > 0, 'Valid delivery id required to proceed!');
    const myOrder = new Order(delivery);
    const amountPayable = <u128>myOrder.getCart().getTotalAmount();
    const aBalance = Accounts.activeBalance(context.sender);
    assert(
      u128.ge(aBalance, amountPayable),
      'Insufficient funds in your account. \nBalance: ' +
        aBalance.toString() +
        '\nAmount Required: ' +
        amountPayable.toString()
    );
    Accounts.lock(context.sender, delivery, amountPayable);
    Orders.set(myOrder.getId(), myOrder);
    Carts.delete(context.sender);
    return myOrder.getId();
  }

  /**
   * A call function to confirm that products ordered have reached the intended buyer.
   * @param orderId : id of the order whose delivery is to be confirmed.
   * @param delivery : delivery person's account id.
   */
  confirmDelivery(orderId: string, delivery: string): void {
    assert(Orders.contains(orderId), 'Invalid order id! Check and try again.');
    const myOrder = Orders.getSome(orderId);
    assert(!myOrder.getIsDelivered(), 'Order delivery confirmed already!');
    Accounts.unlock(context.sender, delivery);
    Accounts.unlock(delivery, this.seller);
    myOrder.setIsDelivered(true);
    Orders.set(myOrder.getId(), myOrder);
  }

  // ================================================================
  // DELIVERY FUNCTIONS
  // ================================================================

  /**
   * A call function to change the status of the order to have been cleared.
   * @param orderId is the id of the order to be cleared for shipment
   */
  clearShipment(orderId: string): void {
    assert(
      Orders.contains(orderId),
      'Order not found! check order id and try again.'
    );
    const aBalance = Accounts.activeBalance(context.sender);
    const order = Orders.getSome(orderId);
    assert(!order.getIsCleared(), 'Order cleared already!');
    assert(!order.getIsDelivered(), 'Order delivery confirmed already!');
    assert(order.getDelivery() == context.sender, 'Unauthorized operation!');
    assert(
      u128.ge(aBalance, order.getCart().getSubTotal()),
      'Insufficient funds in your account. \nBalance: ' +
        aBalance.toString() +
        '\nAmount Required: ' +
        order.getCart().getSubTotal().toString()
    );
    Accounts.lock(context.sender, this.seller, order.getCart().getSubTotal());
    order.setIsCleared(true);
    Orders.set(order.getId(), order);
  }

  // ================================================================
  // UNIVERSAL FUNCTIONS
  // ================================================================

  /**
   * A call function that retreives and displays all products' information in the collection.
   * @returns a list of products being sold.
   */
  showProducts(): Product[] {
    const products = new Array<Product>();
    const pIds = ProductIds[0].showIds();
    for (let i = 0; i < pIds.length; i++) {
      products[i] = Products.getSome(pIds[i]);
    }
    return products;
  }

  /**
   * A call function to check user's active balance.
   * @returns figure of money in user's account.
   */
  myBalance(): u128 {
    return Accounts.activeBalance(context.sender);
  }

  /**
   * A call function to deposit money into user's active account depending on the figure of context.attachedDeposit.
   */
  deposit(): void {
    const amount = context.attachedDeposit;
    Accounts.deposit(context.sender, amount);
  }
}
