// app.js: the brain of the website. Data → state → render → events.

import menu, { coupons }    from "./menu.js";
import {
  formatPrice,
  findItem,
  spiceDots,
  calcBill,
  validateOrder,
  makeOrderId
} from "./utils.js";

// ── DOM Elements ──────────────────────────────────────────────────────────────
const searchEl      = document.getElementById("search");
const sortEl        = document.getElementById("sort");
const vegOnlyEl     = document.getElementById("veg-only");
const chipsEl       = document.getElementById("chips");
const resultInfoEl  = document.getElementById("result-info");
const menuGridEl    = document.getElementById("menu-grid");
const cartCountEl   = document.getElementById("cart-count");
const cartListEl    = document.getElementById("cart-list");
const billEl        = document.getElementById("bill");
const couponFormEl  = document.getElementById("coupon-form");
const couponInputEl = document.getElementById("coupon-input");
const couponMsgEl   = document.getElementById("coupon-msg");
const checkoutFormEl = document.getElementById("checkout-form");
const placeBtnEl    = document.getElementById("place-btn");
const confirmationEl = document.getElementById("confirmation");

// ── State ─────────────────────────────────────────────────────────────────────
const state = {
  query:      "",
  category:   "all",
  vegOnly:    false,
  sort:       "default",
  cart:       [],        // [{ id, qty }]
  couponCode: "",
  orderCount: 0
};

// ── Derived: visibleItems() ───────────────────────────────────────────────────
function visibleItems() {
  let list = menu
    .filter(item => state.category === "all" || item.category === state.category)
    .filter(item => !state.vegOnly || item.veg)
    .filter(item => item.name.toLowerCase().includes(state.query.toLowerCase()));

  // Sort a copy so we don't mutate the original array
  const sorted = [...list];
  if (state.sort === "price-low")  sorted.sort((a, b) => a.price - b.price);
  if (state.sort === "price-high") sorted.sort((a, b) => b.price - a.price);
  if (state.sort === "rating")     sorted.sort((a, b) => b.rating - a.rating);

  return (state.sort === "default") ? list : sorted;
}

// ── dishHTML ──────────────────────────────────────────────────────────────────
function dishHTML(item) {
  const { id, name, price, veg, rating, inStock } = item;
  const badge     = item.badge ?? "";
  const spiceLevel = item.spice?.level ?? 0;

  return `
    <li class="dish${inStock ? "" : " sold-out"}" data-id="${id}">
      <div class="dish-top">
        <span class="diet ${veg ? "veg" : "nonveg"}" title="${veg ? "Veg" : "Non-veg"}"></span>
        ${badge ? `<span class="badge">${badge}</span>` : "<span></span>"}
      </div>
      <h3>${name}</h3>
      <p class="meta">★ ${rating}${spiceLevel > 0 ? ` · <span class="spice">${spiceDots(spiceLevel)}</span>` : ""}</p>
      <div class="dish-bottom">
        <span class="price">${formatPrice(price)}</span>
        <button class="add-btn" ${inStock ? "" : "disabled"}>${inStock ? "Add" : "Sold out"}</button>
      </div>
    </li>
  `;
}

// ── renderMenu ────────────────────────────────────────────────────────────────
function renderMenu() {
  const list = visibleItems();

  // Update category chip active state
  document.querySelectorAll(".chip").forEach(chip => {
    chip.classList.toggle("active", chip.dataset.cat === state.category);
  });

  // Result info
  const total = menu.filter(item => !state.vegOnly || item.veg).length;
  resultInfoEl.textContent =
    list.length === 0
      ? "No dishes found"
      : `Showing ${list.length} of ${menu.length} dishes`;

  // Render cards (or empty state)
  menuGridEl.innerHTML = list.length > 0
    ? list.map(dishHTML).join("")
    : `<li class="empty">Nothing matches your search</li>`;
}

// ── cartItemHTML ──────────────────────────────────────────────────────────────
function cartItemHTML({ id, qty }) {
  const { name, price } = findItem(menu, id);
  return `
    <li data-id="${id}">
      <span class="item-name">${name}</span>
      <div class="qty-controls">
        <button class="qty-btn" data-action="dec">−</button>
        <span class="qty-val">${qty}</span>
        <button class="qty-btn" data-action="inc">+</button>
      </div>
      <span class="item-price">${formatPrice(price * qty)}</span>
    </li>
  `;
}

// ── renderCart ────────────────────────────────────────────────────────────────
function renderCart() {
  const bill = calcBill(state.cart, menu, state.couponCode, coupons);

  // Badge — animate on change
  const prevCount = parseInt(cartCountEl.textContent) || 0;
  cartCountEl.textContent = bill.itemCount;
  if (bill.itemCount !== prevCount) {
    cartCountEl.classList.remove("bump");
    void cartCountEl.offsetWidth; // reflow to restart animation
    cartCountEl.classList.add("bump");
    setTimeout(() => cartCountEl.classList.remove("bump"), 300);
  }

  // Cart rows
  if (state.cart.length === 0) {
    cartListEl.innerHTML = `<li class="cart-empty-msg">Your cart is empty 🛒</li>`;
  } else {
    cartListEl.innerHTML = state.cart.map(cartItemHTML).join("");
  }

  // Coupon message
  couponMsgEl.textContent = bill.message;
  couponMsgEl.classList.toggle("ok", bill.discount > 0);

  // Bill
  billEl.innerHTML = `
    <dt>Subtotal</dt><dd>${formatPrice(bill.subtotal)}</dd>
    ${bill.discount > 0 ? `<dt>Discount</dt><dd>− ${formatPrice(bill.discount)}</dd>` : ""}
    <dt>GST (5%)</dt><dd>${formatPrice(bill.gst)}</dd>
    <dt>Delivery</dt><dd>${bill.delivery === 0 && state.cart.length > 0 ? "FREE 🎉" : formatPrice(bill.delivery)}</dd>
    <dt class="total-label">Total</dt><dd class="total-val">${formatPrice(bill.total)}</dd>
  `;

  // Place order button
  placeBtnEl.disabled = state.cart.length === 0;
}

// ── render ────────────────────────────────────────────────────────────────────
function render() {
  renderMenu();
  renderCart();
}

// ── changeQty ─────────────────────────────────────────────────────────────────
function changeQty(id, change) {
  const line = state.cart.find(item => item.id === id);

  if (line) {
    line.qty += change;
  } else if (change > 0) {
    state.cart.push({ id, qty: 1 });
  }

  // Remove zero-qty lines
  state.cart = state.cart.filter(item => item.qty > 0);
}

// ══════════════════════════════════════════════════════════════════════════════
// EVENT LISTENERS
// ══════════════════════════════════════════════════════════════════════════════

// Search
searchEl.addEventListener("input", e => {
  state.query = e.target.value;
  render();
});

// Sort
sortEl.addEventListener("change", e => {
  state.sort = e.target.value;
  render();
});

// Veg only
vegOnlyEl.addEventListener("change", e => {
  state.vegOnly = e.target.checked;
  render();
});

// Category chips (delegation)
chipsEl.addEventListener("click", e => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  state.category = chip.dataset.cat;
  render();
});

// Add to cart (delegation on menu grid)
menuGridEl.addEventListener("click", e => {
  const btn = e.target.closest(".add-btn");
  if (!btn) return;
  const id = Number(btn.closest(".dish").dataset.id);
  changeQty(id, 1);
  render();
});

// + / − buttons in cart (delegation)
cartListEl.addEventListener("click", e => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const id     = Number(btn.closest("li").dataset.id);
  const change = btn.dataset.action === "inc" ? 1 : -1;
  changeQty(id, change);
  render();
});

// Coupon form
couponFormEl.addEventListener("submit", e => {
  e.preventDefault();
  state.couponCode = couponInputEl.value.trim().toUpperCase();
  render();
});

// Clear cart button (bonus B1)
document.addEventListener("click", e => {
  if (e.target.closest(".clear-cart-btn")) {
    state.cart       = [];
    state.couponCode = "";
    couponInputEl.value = "";
    render();
  }
});

// Escape closes popup (bonus B2)
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !confirmationEl.hidden) {
    closeConfirmation();
  }
});

// ── Checkout Form ─────────────────────────────────────────────────────────────
const errorSmalls = document.querySelectorAll(".error");

// Clear individual error while typing
checkoutFormEl.addEventListener("input", e => {
  const small = document.querySelector(`[data-error-for="${e.target.id}"]`);
  if (!small) return;
  small.textContent = "";
  e.target.classList.remove("invalid");
});

// Submit
checkoutFormEl.addEventListener("submit", e => {
  e.preventDefault();

  const details = {
    name:    document.getElementById("name").value,
    phone:   document.getElementById("phone").value,
    address: document.getElementById("address").value
  };

  const errors = validateOrder(details);

  // Show / hide error messages
  errorSmalls.forEach(small => {
    const field = small.dataset.errorFor;
    small.textContent = errors[field] ?? "";
    const input = document.getElementById(field);
    if (input) input.classList.toggle("invalid", !!errors[field]);
  });

  if (Object.keys(errors).length > 0) return;

  // ── Place the order ──────────────────────────────────────────
  state.orderCount += 1;

  const bill = calcBill(state.cart, menu, state.couponCode, coupons);

  const order = {
    ...details,
    id:    makeOrderId(details.name, state.orderCount),
    items: state.cart.map(line => ({ ...line })),  // deep copy
    bill
  };

  showConfirmation(order);

  // Reset
  state.cart       = [];
  state.couponCode = "";
  couponInputEl.value = "";
  checkoutFormEl.reset();
  render();
});

// ── showConfirmation ──────────────────────────────────────────────────────────
function showConfirmation(order) {
  // Build the popup DOM with createElement (no innerHTML)
  const box = document.createElement("div");
  box.className = "confirm-box";

  const emoji = document.createElement("div");
  emoji.className = "confirm-emoji";
  emoji.textContent = "🎉";

  const heading = document.createElement("h2");
  heading.textContent = "Order placed!";

  const orderId = document.createElement("p");
  orderId.className = "order-id";
  orderId.textContent = `Order ID: ${order.id}`;

  const msg = document.createElement("p");
  msg.className = "confirm-msg";
  msg.textContent = `Thank you, ${order.name}! Your food is being prepared and will be delivered to your address soon.`;

  const total = document.createElement("p");
  total.className = "confirm-total";
  total.textContent = `Total paid: ${formatPrice(order.bill.total)}`;

  const closeBtn = document.createElement("button");
  closeBtn.className = "confirm-close-btn";
  closeBtn.textContent = "Track my order";
  closeBtn.addEventListener("click", closeConfirmation);

  box.append(emoji, heading, orderId, msg, total, closeBtn);
  confirmationEl.innerHTML = "";
  confirmationEl.appendChild(box);
  confirmationEl.hidden = false;
}

function closeConfirmation() {
  confirmationEl.hidden = true;
  confirmationEl.innerHTML = "";
}

// ── Initial render ────────────────────────────────────────────────────────────
render();
