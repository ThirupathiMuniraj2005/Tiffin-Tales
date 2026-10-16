// utils.js: pure helper functions — price, spice, coupons, bill, validation, order id

// ── Constants ────────────────────────────────────────────────────────────────
export const GST_RATE            = 0.05;
export const FREE_DELIVERY_ABOVE = 499;
export const DELIVERY_FEE        = 40;

// ── formatPrice ──────────────────────────────────────────────────────────────
// Returns a nicely formatted rupee string e.g. ₹1,250
export const formatPrice = (amount) =>
  `₹${amount.toLocaleString("en-IN")}`;

// ── findItem ─────────────────────────────────────────────────────────────────
// Returns the dish object with the given id, or undefined
export const findItem = (menu, id) => menu.find(item => item.id === id);

// ── spiceDots ────────────────────────────────────────────────────────────────
// Returns a string of filled/empty dots e.g. spiceDots(2) → "●●○"
export const spiceDots = (level = 0) => {
  let dots = "";
  for (let i = 1; i <= 3; i++) {
    dots += i <= level ? "●" : "○";
  }
  return dots;
};

// ── getDiscount ───────────────────────────────────────────────────────────────
// Returns { amount, message } based on the coupon code and subtotal
export const getDiscount = (subtotal, code, coupons) => {
  if (!code) return { amount: 0, message: "" };

  const coupon = coupons[code];

  if (!coupon) return { amount: 0, message: "Invalid coupon" };

  if (subtotal < coupon.minOrder) {
    const needed = coupon.minOrder - subtotal;
    return {
      amount: 0,
      message: `Add ₹${needed} more to use ${code}`
    };
  }

  switch (coupon.type) {
    case "percent": {
      const raw    = Math.round(subtotal * coupon.value / 100);
      const amount = Math.min(raw, coupon.max);
      return { amount, message: `${code} applied: ${coupon.value}% off` };
    }
    case "flat":
      return { amount: coupon.value, message: `${code} applied: ₹${coupon.value} off` };
    default:
      return { amount: 0, message: "" };
  }
};

// ── calcBill ──────────────────────────────────────────────────────────────────
// Returns the full bill object from the cart
export const calcBill = (cart, menu, code = "", coupons = {}) => {
  const subtotal  = cart.reduce((sum, { id, qty }) => {
    const item = findItem(menu, id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const itemCount = cart.reduce((sum, { qty }) => sum + qty, 0);

  const { amount: discount, message } = getDiscount(subtotal, code, coupons);

  const afterDiscount = subtotal - discount;
  const gst      = Math.round(afterDiscount * GST_RATE);
  const delivery = cart.length === 0 ? 0 : afterDiscount >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
  const total    = afterDiscount + gst + delivery;

  return { itemCount, subtotal, discount, gst, delivery, total, message };
};

// ── validateOrder ─────────────────────────────────────────────────────────────
// Returns an errors object; empty object means the form is valid
export const validateOrder = ({ name, phone, address }) => {
  const errors = {};

  if (name.trim().length < 3) {
    errors.name = "Please enter your full name";
  }

  const digits = phone.trim().replace(/\s/g, "");
  const allDigits = [...digits].every(ch => ch >= "0" && ch <= "9");
  if (digits.length !== 10 || !allDigits) {
    errors.phone = "Phone number must be exactly 10 digits";
  }

  if (address.trim().length < 10) {
    errors.address = "Please enter your full address";
  }

  return errors;
};

// ── makeOrderId ───────────────────────────────────────────────────────────────
// Builds e.g. "TT-RK-0007" from name "ravi kumar" and orderNumber 7
export const makeOrderId = (name, orderNumber) => {
  const initials = name
    .trim()
    .split(" ")
    .filter(word => word.length > 0)
    .map(word => word[0].toUpperCase())
    .join("");

  const padded = String(orderNumber).padStart(4, "0");
  return `TT-${initials}-${padded}`;
};
