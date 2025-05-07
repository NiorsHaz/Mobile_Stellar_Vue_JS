// src/api/product.js
import { bridge } from './bridge';

export class ProductManager {
  constructor() {
    this.products = [];
    this.price = [];
    this.initialized = false;
    this.page = 1;
    this.content = 10;
  }

  async init() {
    if (this.initialized) return;
    this.products = await bridge.getProducts(this.page, this.content);
    this.price = await bridge.getProductsPrice(this.page, this.content);
    this.quantity = await bridge.getProductsQuantity(this.page, this.content);
    this.initialized = true;
  }

  getAll() {
    return this.products;
  }

  getAllPrice(){
    return this.price;
  }

  getAllMerged() {
    return this.products.records.map(product => {
      const priceEntry = this.price.records.find(p => p.M_Product_ID.id === product.id);
      const quantityEntry = this.quantity.records.find(p => p.M_Product_ID.id === product.id);
      return {
        ...product,
        PriceList: priceEntry ? priceEntry.PriceStd : null,
        Qtyonhand: quantityEntry ? quantityEntry.QtyOnHand : null
      };
    });
  }
  

  getById(id) {
    return this.products.find(p => p.id === id);
  }

  async refresh() {
    // this.products = await bridge.getProducts(this.page, this.content);
    await this.init();
  }

  async nextPage() {
    this.page += 1;
    await this.refresh();
  }

  async previousPage(){
    this.page -=1;;
    await this.refresh();
  }
}

const productManager = new ProductManager();

export default productManager;
