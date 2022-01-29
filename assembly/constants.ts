import { PersistentMap, PersistentVector, u128 } from 'near-sdk-as';
import { Cart } from './models/Cart';
import { Order } from './models/Order';
import { Product } from './models/Product';
import { ProductId } from './models/ProductId';

export const KEY_LENGTH = 22;

export const Orders = new PersistentMap<string, Order>('orders');
export const Products = new PersistentMap<string, Product>('products');
export const ProductIds = new PersistentVector<ProductId>('productIds');
export const Carts = new PersistentMap<string, Cart>('carts');
export const ActiveAccounts = new PersistentMap<string, u128>('aacc');
export const LockedAccounts = new PersistentMap<string, u128>('lacc');
