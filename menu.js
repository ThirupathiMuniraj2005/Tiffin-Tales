// menu.js: all the data for the café (the same for every student)

const menu = [
  { id: 1,  name: "Masala Dosa",          category: "breakfast", price: 90,  veg: true,  rating: 4.6, spice: { level: 1 }, badge: "Bestseller", inStock: true },
  { id: 2,  name: "Idli Vada",            category: "breakfast", price: 60,  veg: true,  rating: 4.4, inStock: true },
  { id: 3,  name: "Ven Pongal",           category: "breakfast", price: 70,  veg: true,  rating: 4.2, inStock: true },
  { id: 4,  name: "Chicken Biryani",      category: "meals",     price: 220, veg: false, rating: 4.8, spice: { level: 2 }, badge: "Bestseller", inStock: true },
  { id: 5,  name: "South Indian Meals",   category: "meals",     price: 150, veg: true,  rating: 4.3, spice: { level: 1 }, inStock: true },
  { id: 6,  name: "Paneer Butter Masala", category: "meals",     price: 180, veg: true,  rating: 4.5, spice: { level: 1 }, badge: "New", inStock: true },
  { id: 7,  name: "Fish Curry Meals",     category: "meals",     price: 240, veg: false, rating: 4.4, spice: { level: 3 }, inStock: false },
  { id: 8,  name: "Samosa",               category: "snacks",    price: 15,  veg: true,  rating: 4.2, spice: { level: 1 }, inStock: true },
  { id: 9,  name: "Veg Puff",             category: "snacks",    price: 20,  veg: true,  rating: 4.1, inStock: true },
  { id: 10, name: "French Fries",         category: "snacks",    price: 60,  veg: true,  rating: 4.5, badge: "Bestseller", inStock: true },
  { id: 11, name: "Sandwich",             category: "snacks",    price: 50,  veg: true,  rating: 4.3, inStock: true },
  { id: 12, name: "Bajji",               category: "snacks",    price: 25,  veg: true,  rating: 4.0, spice: { level: 1 }, inStock: true },
  { id: 13, name: "Cookies",             category: "snacks",    price: 20,  veg: true,  rating: 4.2, inStock: true },
  { id: 14, name: "Tea",                 category: "drinks",    price: 12,  veg: true,  rating: 4.5, badge: "Bestseller", inStock: true },
  { id: 15, name: "Coffee",             category: "drinks",    price: 20,  veg: true,  rating: 4.6, inStock: true },
  { id: 16, name: "Fresh Lime Juice",   category: "drinks",    price: 30,  veg: true,  rating: 4.4, inStock: true },
  { id: 17, name: "Badam Milk",         category: "drinks",    price: 35,  veg: true,  rating: 4.7, badge: "New", inStock: true },
  { id: 18, name: "Cold Coffee",        category: "drinks",    price: 60,  veg: true,  rating: 4.5, inStock: true },
  { id: 19, name: "Milkshake",          category: "drinks",    price: 70,  veg: true,  rating: 4.8, inStock: true }
];

export const coupons = {
  TIFFIN10: { type: "percent", value: 10, max: 100, minOrder: 0 },
  FIRST50:  { type: "flat",    value: 50,            minOrder: 300 }
};

export default menu;
