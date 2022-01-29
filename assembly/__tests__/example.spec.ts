import { VMContext, VM, u128, context } from 'near-sdk-as';
import { Contract } from '..';
import {
  ActiveAccounts,
  Carts,
  LockedAccounts,
  Orders,
  ProductIds,
  Products,
} from '../constants';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';

const seller = 'amazon';
const buyer = 'alice';
const delivery = 'bob';

var contract: Contract;

describe('Order System', () => {
  beforeAll(() => {
    contract = new Contract();
    contract.seller = seller;
  });

  afterEach(() => {
    if (ProductIds.length > 0) {
      const pIds = ProductIds.pop();
      const ids = pIds.showIds();
      for (let i = 0; i < ids.length; i++) {
        Products.delete(ids[i]);
      }
    }
  });

  it('should add one product in Products storage', () => {
    VMContext.setSigner_account_id(seller);
    const pId = contract.addProduct('phone', 20, 1);
    expect(Products.contains(pId)).toStrictEqual(true);
    expect(ProductIds).toHaveLength(1);
    expect(ProductIds[0].showIds()[0]).toStrictEqual(pId);
  });

  it('should remove one product in Products storage', () => {
    VMContext.setSigner_account_id(seller);
    const pId = contract.addProduct('Charger', 10, 2);
    const pId2 = contract.addProduct('Tablet', 50, 1);
    expect(Products.contains(pId)).toStrictEqual(true);
    expect(Products.contains(pId2)).toStrictEqual(true);
    expect(ProductIds[0].showIds()).toHaveLength(2, 'Should contain two ids.');

    contract.removeProduct(pId);
    expect(Products.contains(pId)).toStrictEqual(false);
    expect(ProductIds).toHaveLength(1);
  });

  it("should add a product to buyers's cart", () => {
    VMContext.setSigner_account_id(seller);
    const pId = contract.addProduct('charger', 25, 2);

    VMContext.setSigner_account_id(buyer);
    contract.addToCart(ProductIds[0].showIds()[0], 2);

    expect(Carts.contains(buyer)).toStrictEqual(true);
    expect(Carts.getSome(buyer).getProductsOrdered()[0].getId()).toStrictEqual(
      ProductIds[0].showIds()[0]
    );
    expect(
      Carts.getSome(buyer).getProductsOrdered()[0].getQuantity()
    ).toStrictEqual(2);
    expect(
      Carts.getSome(buyer).getProductsOrdered()[0].getPrice()
    ).toStrictEqual(Products.getSome(ProductIds[0].showIds()[0]).getPrice());
    Carts.delete(buyer);
    expect(Carts.contains(buyer)).toStrictEqual(false);
  });

  it("should remove an item from the buyer's cart", () => {
    VMContext.setSigner_account_id(seller);
    const pId = contract.addProduct('phone', 26, 2);

    VMContext.setSigner_account_id(buyer);
    contract.addToCart(ProductIds[0].showIds()[0], 3);

    expect(Carts.contains(buyer)).toStrictEqual(true);
    expect(Carts.getSome(buyer).getProductsOrdered()[0].getId()).toStrictEqual(
      ProductIds[0].showIds()[0]
    );
    // Remove item from cart
    contract.removeFromCart(ProductIds[0].showIds()[0]);

    expect(Carts.getSome(buyer).getProductsOrdered()).toHaveLength(0);
    expect(Carts.getSome(buyer).getSubTotal()).toStrictEqual(u128.fromU64(0));
  });

  it("should view buyer's cart content", () => {
    VMContext.setSigner_account_id(seller);
    const pId = contract.addProduct('phone', 27, 2);

    VMContext.setSigner_account_id(buyer);
    contract.addToCart(ProductIds[0].showIds()[0], 4);
    const myCart = <Cart>contract.viewCart();
    log(`============================================================
          SHOWING CART CONTENT
        =============================================================
    `);
    log(myCart);
    expect(myCart).not.toBeNull();
    expect(myCart.getBuyer()).toStrictEqual(buyer);

    Carts.delete(buyer);
    expect(contract.viewCart()).toBeNull();
  });

  it('should show products being sold', () => {
    VMContext.setSigner_account_id(seller);
    const pId = contract.addProduct('Laptop', 28, 3);
    const pId2 = contract.addProduct('Charger', 7, 5);
    const products = contract.showProducts();
    log(`============================================================
          SHOWING PRODUCTS ON SALE
        =============================================================
    `);
    log(products);
    expect<Product[]>(products).toHaveLength(2);
    expect(products[0].getId()).toStrictEqual(pId);
    expect(products[1].getId()).toStrictEqual(pId2);
  });

  it("should return user's active account balance myBalance() and test deposit()", () => {
    VMContext.setSigner_account_id(buyer);
    let balance = contract.myBalance();
    expect(balance).toStrictEqual(u128.fromU64(0));
    log(`${buyer}'s active balance before deposit: ${balance}`);

    const deposit = u128.fromU64(10);

    VMContext.setAttached_deposit(deposit);
    contract.deposit();
    balance = contract.myBalance();
    log(`${buyer}'s active balance after deposit: ${balance}`);

    expect(balance).toStrictEqual(deposit);
    ActiveAccounts.delete(buyer);
  });
});

var orderId: string = '';
describe('Order Processing', () => {
  beforeAll(() => {
    contract = new Contract();
    contract.seller = seller;
  });

  afterAll(() => {
    if (ProductIds.length > 0) {
      const pIds = ProductIds.pop();
      const ids = pIds.showIds();
      for (let i = 0; i < ids.length; i++) {
        Products.delete(ids[i]);
      }
    }

    if (ActiveAccounts.contains(seller)) {
      ActiveAccounts.delete(seller);
    }
    if (ActiveAccounts.contains(buyer)) {
      ActiveAccounts.delete(buyer);
    }
    if (ActiveAccounts.contains(delivery)) {
      ActiveAccounts.delete(delivery);
    }

    const buyerDeliveryKey = buyer + ':' + delivery;
    if (LockedAccounts.contains(buyerDeliveryKey)) {
      LockedAccounts.delete(buyerDeliveryKey);
    }
  });

  it('should successfully execute placeOrder()', () => {
    VMContext.setSigner_account_id(seller);
    const pId = contract.addProduct('Laptop', 25, 5);

    VMContext.setSigner_account_id(buyer);
    contract.addToCart(ProductIds[0].showIds()[0], 2);

    expect(Carts.contains(buyer)).toStrictEqual(true);

    const amountDeposited = u128.fromU64(70);
    VMContext.setAttached_deposit(amountDeposited);
    contract.deposit();

    expect(contract.myBalance()).toStrictEqual(amountDeposited);

    const key = buyer + ':' + delivery;
    const balanceBefore = contract.myBalance();

    const orderId = contract.placeOrder(delivery);
    const balanceAfter = contract.myBalance();

    expect(Carts.contains(buyer)).toStrictEqual(false);
    expect(Orders.contains(orderId)).toStrictEqual(true);
    expect(balanceAfter).toStrictEqual(
      u128.sub(
        balanceBefore,
        Orders.getSome(orderId).getCart().getTotalAmount()
      )
    );
    expect(LockedAccounts.contains(key)).toStrictEqual(true);
    expect(LockedAccounts.getSome(key)).toStrictEqual(
      Orders.getSome(orderId).getCart().getTotalAmount()
    );

    if (Orders.contains(orderId)) {
      Orders.delete(orderId);
    }
  });

  it('should successfully execute clearShipment()', () => {
    VMContext.setSigner_account_id(seller);
    const pId = contract.addProduct('Laptop', 25, 5);

    VMContext.setSigner_account_id(buyer);
    contract.addToCart(ProductIds[0].showIds()[0], 2);
    const buyerAmountDeposited = u128.fromU64(70);
    VMContext.setAttached_deposit(buyerAmountDeposited);
    contract.deposit();
    const orderId = contract.placeOrder(delivery);

    VMContext.setSigner_account_id(delivery);
    const order = Orders.getSome(orderId);
    const deliveryAmountDeposited = u128.fromU64(70);
    VMContext.setAttached_deposit(deliveryAmountDeposited);
    contract.deposit();
    const balanceBefore = contract.myBalance();
    contract.clearShipment(orderId);
    const balanceAfter = contract.myBalance();

    expect(balanceBefore).toStrictEqual(
      u128.add(balanceAfter, order.getCart().getSubTotal())
    );
    expect(Orders.getSome(orderId).getIsCleared()).toStrictEqual(true);
    expect(
      LockedAccounts.getSome(delivery + ':' + seller)
    ).toBeGreaterThanOrEqual(order.getCart().getSubTotal());

    if (Orders.contains(orderId)) {
      Orders.delete(orderId);
    }
  });

  it('should successfully execute confirmDelivery()', () => {
    VMContext.setSigner_account_id(seller);
    const pId = contract.addProduct('Laptop', 25, 5);

    VMContext.setSigner_account_id(buyer);
    contract.addToCart(ProductIds[0].showIds()[0], 2);
    const buyerAmountDeposited = u128.fromU64(70);
    VMContext.setAttached_deposit(buyerAmountDeposited);
    contract.deposit();
    const orderId = contract.placeOrder(delivery);

    VMContext.setSigner_account_id(delivery);
    const order = Orders.getSome(orderId);
    const deliveryAmountDeposited = u128.fromU64(70);
    VMContext.setAttached_deposit(deliveryAmountDeposited);
    contract.deposit();
    contract.clearShipment(orderId);

    VMContext.setSigner_account_id(buyer);
    const balanceBefore = contract.myBalance();
    contract.confirmDelivery(orderId, delivery);
    const balanceAfter = contract.myBalance();

    expect(Orders.getSome(orderId).getIsDelivered()).toStrictEqual(true);
    expect(LockedAccounts.contains(buyer + ':' + delivery)).toStrictEqual(
      false
    );
    expect(LockedAccounts.contains(delivery + ':' + seller)).toStrictEqual(
      false
    );
    expect(ActiveAccounts.getSome(delivery)).toBeGreaterThanOrEqual(
      order.getCart().getTotalAmount()
    );
    expect(ActiveAccounts.getSome(seller)).toBeGreaterThanOrEqual(
      order.getCart().getSubTotal()
    );
  });

  it('should successfully execute confirmReturn()', () => {
    VMContext.setSigner_account_id(seller);
    const pId = contract.addProduct('Laptop', 25, 5);

    VMContext.setSigner_account_id(buyer);
    contract.addToCart(ProductIds[0].showIds()[0], 2);
    const buyerAmountDeposited = u128.fromU64(70);
    VMContext.setAttached_deposit(buyerAmountDeposited);
    contract.deposit();
    const orderId = contract.placeOrder(delivery);

    VMContext.setSigner_account_id(delivery);
    const order = Orders.getSome(orderId);
    const deliveryAmountDeposited = u128.fromU64(70);
    VMContext.setAttached_deposit(deliveryAmountDeposited);
    contract.deposit();
    contract.clearShipment(orderId);

    VMContext.setSigner_account_id(seller);
    contract.confirmReturn(orderId, delivery);

    expect(Orders.getSome(orderId).getIsDelivered()).toStrictEqual(true);
    expect(LockedAccounts.contains(buyer + ':' + delivery)).toStrictEqual(
      false
    );
    expect(LockedAccounts.contains(delivery + ':' + seller)).toStrictEqual(
      false
    );
    expect(ActiveAccounts.getSome(delivery)).toBeGreaterThanOrEqual(
      order.getCart().getTotalAmount()
    );
    expect(ActiveAccounts.getSome(buyer)).toBeGreaterThanOrEqual(
      order.getCart().getSubTotal()
    );
  });
});
