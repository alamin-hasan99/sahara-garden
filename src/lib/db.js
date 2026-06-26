import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src/data');

function getFilePath(collection) {
  return path.join(DATA_DIR, `${collection}.json`);
}

function readCollection(collection) {
  const filePath = getFilePath(collection);
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading database collection ${collection}:`, error);
    return [];
  }
}

function writeCollection(collection, data) {
  const filePath = getFilePath(collection);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing database collection ${collection}:`, error);
    return false;
  }
}

export const db = {
  products: {
    getAll() {
      return readCollection('products');
    },
    getById(id) {
      const list = this.getAll();
      return list.find(p => p.id === parseInt(id));
    },
    create(productData) {
      const list = this.getAll();
      const nextId = list.reduce((max, p) => p.id > max ? p.id : max, 0) + 1;
      
      const newProduct = {
        id: nextId,
        name: productData.name || "Unnamed Product",
        category: productData.category || "fruits",
        price: parseFloat(productData.price) || 0.00,
        image: productData.image || "assets/peaches.png",
        tag: productData.tag || "",
        shortDesc: productData.shortDesc || "",
        longDesc: productData.longDesc || "",
        nutrition: productData.nutrition || { calories: "N/A", carbs: "N/A", fiber: "N/A", protein: "N/A" }
      };

      list.push(newProduct);
      writeCollection('products', list);
      return newProduct;
    },
    update(id, productData) {
      const list = this.getAll();
      const index = list.findIndex(p => p.id === parseInt(id));
      if (index === -1) return null;

      list[index] = {
        ...list[index],
        name: productData.name !== undefined ? productData.name : list[index].name,
        category: productData.category !== undefined ? productData.category : list[index].category,
        price: productData.price !== undefined ? parseFloat(productData.price) : list[index].price,
        image: productData.image !== undefined ? productData.image : list[index].image,
        tag: productData.tag !== undefined ? productData.tag : list[index].tag,
        shortDesc: productData.shortDesc !== undefined ? productData.shortDesc : list[index].shortDesc,
        longDesc: productData.longDesc !== undefined ? productData.longDesc : list[index].longDesc,
        nutrition: productData.nutrition !== undefined ? { ...list[index].nutrition, ...productData.nutrition } : list[index].nutrition
      };

      writeCollection('products', list);
      return list[index];
    },
    delete(id) {
      const list = this.getAll();
      const index = list.findIndex(p => p.id === parseInt(id));
      if (index === -1) return false;

      list.splice(index, 1);
      writeCollection('products', list);
      return true;
    }
  },

  orders: {
    getAll() {
      return readCollection('orders');
    },
    create(orderData) {
      const list = this.getAll();
      const invoiceId = `GG-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 90)}`;
      
      const newOrder = {
        id: invoiceId,
        date: new Date().toISOString(),
        items: orderData.items || [],
        subtotal: parseFloat(orderData.subtotal) || 0,
        discount: parseFloat(orderData.discount) || 0,
        shipping: parseFloat(orderData.shipping) || 0,
        tax: parseFloat(orderData.tax) || 0,
        total: parseFloat(orderData.total) || 0,
        status: "Pending"
      };

      list.unshift(newOrder);
      writeCollection('orders', list);
      return newOrder;
    },
    updateStatus(id, status) {
      const list = this.getAll();
      const order = list.find(o => o.id === id);
      if (!order) return null;

      order.status = status;
      writeCollection('orders', list);
      return order;
    }
  },

  subscribers: {
    getAll() {
      return readCollection('subscribers');
    },
    add(email) {
      const list = this.getAll();
      const exists = list.some(s => s.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        return { success: true, alreadyExists: true };
      }

      const newSubscriber = {
        email: email,
        subscribedAt: new Date().toISOString()
      };

      list.push(newSubscriber);
      writeCollection('subscribers', list);
      return { success: true, subscriber: newSubscriber };
    }
  }
};
