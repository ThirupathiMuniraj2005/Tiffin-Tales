# Tiffin Tales

A food-ordering website for a South Indian café, built with HTML, CSS and JavaScript (no frameworks).

**Live site:** https://YOUR-NAME.github.io/tiffin-tales/

## Features
- Menu rendered from data (12 dishes) with veg / non-veg marks, ratings and spice level
- Live search, category filter, veg-only filter and sorting (price / rating)
- Cart with + / − quantities, GST (5%), delivery fee and coupon codes (TIFFIN10, FIRST50)
- Checkout form with validation and an order confirmation popup with a unique order ID
- Responsive design — works beautifully on phones and desktops
- Bonus: Clear cart button, Escape key closes popup

## Coupon codes
| Code | Discount | Minimum order |
|------|----------|---------------|
| `TIFFIN10` | 10% off (max ₹100) | No minimum |
| `FIRST50`  | ₹50 flat off | ₹300+ |

## How it works
- `menu.js` holds the data, `utils.js` the pure helper functions, `app.js` the state, rendering and events.
- Every event changes the `state` object and calls `render()`, which redraws the page from state.
- The bill is always computed fresh from state — no stale data.

## Run it locally
Open the folder in VS Code and start **Live Server** (ES modules need a server, not a file:// URL).

## Project structure
```
tiffin-tales/
├── index.html   ← semantic page structure
├── style.css    ← design system with CSS variables
├── menu.js      ← the 12 dishes and 2 coupons
├── utils.js     ← pure functions: price, bill, validation, order id
├── app.js       ← state, render, events
└── README.md    ← this file
```

## What I learned
Building Tiffin Tales showed me how a real-world web app is structured from scratch.
I used ES modules to keep concerns separated (data, logic, UI), and learned how a single
`state` object drives the whole UI through a central `render()` function. Working with
array methods like `filter`, `map`, `reduce` and `find` on real data felt much more
meaningful than toy exercises. The Git branch workflow for the coupon feature showed
me how professional teams work in parallel without breaking the main codebase.
