/* Samantha — The Closet. Demo storefront. Cart lives in memory. */

const PRODUCTS = [
  { id: "red-satin-mini",        name: "Scarlet Satin Mini",     price: 88,  img: "images/red-satin-mini.jpg",        note: "The bowling dress." },
  { id: "emerald-satin-mini",    name: "Emerald Satin Mini",     price: 88,  img: "images/emerald-satin-mini.jpg",    note: "Thin straps, bias cut." },
  { id: "denim-shorts-set",      name: "Denim Set",              price: 64,  img: "images/denim-shorts-set.jpg",      note: "High-waisted shorts + white crop." },
  { id: "black-sweetheart-mini", name: "Black Sweetheart Mini",  price: 86,  img: "images/black-sweetheart-mini.jpg", note: "Sweetheart neckline." },
  { id: "maroon-sari",           name: "Maroon Silk Sari",       price: 120, img: "images/maroon-sari.jpg",           note: "Gold border, pure silk." },
  { id: "floral-sundress",       name: "Pastel Floral Sundress", price: 78,  img: "images/floral-sundress.jpg",       note: "The golf-course dress." },
];

const grid = document.getElementById("grid");

PRODUCTS.forEach((p) => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="card-img"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
    <div class="p-name">${p.name}</div>
    <div class="p-meta">
      <span class="p-price">$${p.price} &mdash; ${p.note}</span>
      <button class="p-add" type="button" data-add="${p.id}">Add to cart</button>
    </div>`;
  grid.appendChild(card);
});

grid.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-add]");
  if (btn) addToCart(btn.dataset.add);
});

/* ---------- CART ---------- */

const cart = new Map();
const drawer = document.getElementById("drawer");
const overlay = document.getElementById("overlay");
const drawerItems = document.getElementById("drawer-items");
const cartCount = document.getElementById("cart-count");
const subtotalEl = document.getElementById("subtotal");

function addToCart(id) {
  cart.set(id, (cart.get(id) || 0) + 1);
  renderCart();
  toast(`${PRODUCTS.find(x => x.id === id).name} added to cart`);
}

function cartTotals() {
  let count = 0, total = 0;
  for (const [id, qty] of cart) {
    const p = PRODUCTS.find(x => x.id === id);
    count += qty;
    total += p.price * qty;
  }
  return { count, total };
}

function renderCart() {
  const { count, total } = cartTotals();
  cartCount.textContent = count;
  subtotalEl.textContent = "$" + total;
  if (count === 0) {
    drawerItems.innerHTML = `<p class="drawer-empty">Your cart is empty.<br>The closet awaits.</p>`;
    return;
  }
  drawerItems.innerHTML = [...cart.entries()].map(([id, qty]) => {
    const p = PRODUCTS.find(x => x.id === id);
    return `
      <div class="line-item">
        <img class="line-thumb" src="${p.img}" alt="">
        <div class="line-info">
          <div class="line-name">${p.name} &times; ${qty}</div>
          <div class="line-price">$${p.price * qty}</div>
        </div>
        <button class="line-remove" type="button" data-remove="${id}">Remove</button>
      </div>`;
  }).join("");
}

drawerItems.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-remove]");
  if (btn) { cart.delete(btn.dataset.remove); renderCart(); }
});

function openCart() { drawer.hidden = false; overlay.hidden = false; document.body.style.overflow = "hidden"; }
function closeCart() { drawer.hidden = true; overlay.hidden = true; document.body.style.overflow = ""; }

document.getElementById("cart-open").addEventListener("click", openCart);
document.getElementById("cart-close").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.getElementById("checkout").addEventListener("click", () => {
  toast("Demo checkout — this sample store takes no real orders.");
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });

renderCart();

/* ---------- TOAST ---------- */

const toastEl = document.getElementById("toast");
let toastTimer = null;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastEl.hidden = true; }, 2200);
}
