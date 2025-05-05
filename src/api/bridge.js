import { ref } from "vue";

// src/api/bridge.js
const API_URL = "/api";

class Bridge {
  constructor(apiKey = null) {
    this.apiKey = apiKey || localStorage.getItem('token') || '';
  }

  setApiKey(key) {
    this.apiKey = key;
    localStorage.setItem('token', key);
  }

  getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  async get(endpoint) {
    const res = await fetch(`${API_URL}/${endpoint}`, {
      headers: this.getHeaders(),
    });

    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (err) {
      throw new SyntaxError("Non-JSON response: " + text);
    }
  }

  async post(endpoint, data) {
    const res = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (err) {
      throw new SyntaxError("Non-JSON response: " + text);
    }
  }

  async login(username, password) {
    const res = await fetch(`${API_URL}/auth/tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: username,
        password: password,
        parameters : {
          "clientId": 11,
          "roleId": 102,
          "organizationId": 0,
          "warehouseId": 103,
          "language": "en_US"
        }
      }),
    });

    const data = await res.json();

    if (data.token) {
      this.setApiKey(data.token);
      console.log("✅ Token saved:", data.token);
    } else {
      console.error("❌ Login failed: No token received");
    }

    return data;
  }

  async createOrder(orderData) {
    return this.post('orders', orderData);
  }

  async getOrder() {
    return this.get('orders');
  }

  async getInvoice() {
    return this.get('invoices');
  }

  async getOrderBySocid(socid) {
    return this.get(`orders/orders?socid=${socid}`);
  }

  async getProducts() {
    return this.get('models/m_product');
  }
  async getProductsPrice() {
    return this.get('models/m_productprice');
  }
  async getProductsQuantity(){
    return this.get('models/m_storageonhand');
  }

  // async getProduct(id) {
  //   return this.get(`products/${id}`);
  // }

  async updateRatingProduct(ref, label, rating) {
    const orderData = {
      array_options: {
        options_rating: rating,
      },
    };

    const res = await fetch(`${API_URL}/products/${ref}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(orderData),
    });

    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (err) {
      throw new SyntaxError("Non-JSON response: " + text);
    }
  }

  async createThirdParty(userData) {
    return this.post('thirdparties', userData);
  }

  async createUser(userData) {
    return this.post('users', userData);
  }

  async getUserId() {
    const res = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    const userData = await res.json();

    const foundUser = userData.find(user => user.login === localStorage.getItem('username'));

    if (foundUser) {
      console.log("✅ Found user:", foundUser.ref);
      return foundUser.ref;
    } else {
      console.warn("❌ User not found");
      return null;
    }
  }
}

export const bridge = new Bridge();
