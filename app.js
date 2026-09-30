/* Samantha — The Closet. Animated rack + demo cart. */

const PRODUCTS = [
  { id: "red-satin-mini",        name: "Scarlet Satin Mini",     price: 88,  img: "images/red-satin-mini.jpg",        note: "The bowling dress." },
  { id: "emerald-satin-mini",    name: "Emerald Satin Mini",     price: 88,  img: "images/emerald-satin-mini.jpg",    note: "Thin straps, bias cut." },
  { id: "denim-shorts-set",      name: "Denim Set",              price: 64,  img: "images/denim-shorts-set.jpg",      note: "High-waisted shorts + white crop." },
  { id: "black-sweetheart-mini", name: "Black Sweetheart Mini",  price: 86,  img: "images/black-sweetheart-mini.jpg", note: "Sweetheart neckline." },
  { id: "maroon-sari",           name: "Maroon Silk Sari",       price: 120, img: "images/maroon-sari.jpg",           note: "Gold border, pure silk." },
  { id: "floral-sundress",       name: "Pastel Floral Sundress", price: 78,  img: "images/floral-sundress.jpg",       note: "The golf-course dress." },
];

const HOOK_SVG = `<svg class="hook" viewBox="0 0 26 30" aria-hidden="true">
  <path d="M13 29 V13 C13 5 22 5 22 12" stroke="#3a3f45" stroke-width="3.2" fill="none" stroke-linecap="round"/>
  <circle cx="13" cy="27" r="2.4" fill="#3a3f45"/>
</svg>`;

const stage = document.getElementById("rack-stage");
const hangersEl = document.getElementById("hangers");
const detail = document.getElementById("detail");
const N = PRODUCTS.length;
let selected = null;

/* ---------- BUILD RACK ---------- */

const hangerNodes = PRODUCTS.map((p, i) => {
  const el = document.createElement("div");
  el.className = "hanger";
  el.style.left = (10 + (i * 80) / (N - 1)) + "%";
  el.setAttribute("role", "button");
  el.setAttribute("tabindex", "0");
  el.setAttribute("aria-label", `View ${p.name}`);
  el.innerHTML = `
    <div class="hanger-sway">
      <div class="hanger-move">
        ${HOOK_SVG}
        <div class="hanger-bar"></div>
        <div class="garment"><img src="${p.img}" alt="${p.name}" draggable="false"></div>
        <div class="caption">${p.name}</div>
      </div>
    </div>`;
  el.addEventListener("click", () => select(i));
  el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(i); } });
  hangersEl.appendChild(el);
  return el;
});

/* ---------- PIECE INDEX ---------- */

const indexEl = document.getElementById("piece-index");
PRODUCTS.forEach((p, i) => {
  const li = document.createElement("li");
  li.innerHTML = `<span class="pi-num">${String(i + 1).padStart(2, "0")}</span><span class="pi-name">${p.name}</span><span class="pi-price">$${p.price}</span>`;
  li.addEventListener("click", () => { select(i); stage.scrollIntoView({ behavior: "smooth", block: "center" }); });
  indexEl.appendChild(li);
});

/* ---------- BREEZE (cursor-reactive sway) ---------- */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduceMotion) {
  stage.addEventListener("mousemove", (e) => {
    if (selected !== null) return;
    const r = stage.getBoundingClientRect();
    const mx = e.clientX - r.left;
    hangerNodes.forEach((el) => {
      const hr = el.getBoundingClientRect();
      const hx = hr.left + hr.width / 2 - r.left;
      const d = Math.max(-1, Math.min(1, (mx - hx) / 260));
      el.querySelector(".hanger-move").style.setProperty("--breeze", (d * 5).toFixed(2));
    });
  });
  stage.addEventListener("mouseleave", () => {
    hangerNodes.forEach((el) => el.querySelector(".hanger-move").style.setProperty("--breeze", 0));
  });
}

/* ---------- SELECTION ---------- */

function select(i) {
  selected = i;
  const p = PRODUCTS[i];
  const stageR = stage.getBoundingClientRect();

  hangerNodes.forEach((el, j) => {
    const move = el.querySelector(".hanger-move");
    move.style.setProperty("--breeze", 0);
    if (j === i) {
      const r = el.getBoundingClientRect();
      const dx = (stageR.left + stageR.width / 2) - (r.left + r.width / 2);
      move.style.setProperty("--px", dx.toFixed(1) + "px");
      move.style.setProperty("--s", window.innerWidth <= 900 ? 1.35 : 1.85);
      el.classList.add("active");
      el.classList.remove("dimmed");
    } else {
      move.style.setProperty("--px", ((j - i) * 72).toFixed(0) + "px");
      move.style.setProperty("--s", 0.88);
      el.classList.add("dimmed");
      el.classList.remove("active");
    }
  });

  document.getElementById("counter").textContent = `${i + 1} of ${N}`;
  document.getElementById("detail-name").textContent = p.name;
  document.getElementById("detail-kicker").textContent = p.name;
  document.getElementById("detail-price").textContent = "$" + p.price;
  document.getElementById("detail-note").textContent = p.note + " Cut in a small batch — when it's gone, it's gone.";
  document.getElementById("detail-add").onclick = () => addToCart(p.id);

  stage.classList.add("selecting");
  detail.hidden = false;
}

function deselect() {
  selected = null;
  hangerNodes.forEach((el) => {
    const move = el.querySelector(".hanger-move");
    move.style.setProperty("--px", "0px");
    move.style.setProperty("--s", 1);
    el.classList.remove("active", "dimmed");
  });
  stage.classList.remove("selecting");
  detail.hidden = true;
}

document.getElementById("detail-close").addEventListener("click", deselect);
document.getElementById("prev").addEventListener("click", () => select((selected + N - 1) % N));
document.getElementById("next").addEventListener("click", () => select((selected + 1) % N));
document.getElementById("see-availability").addEventListener("click", () => {
  select(0);
  stage.scrollIntoView({ behavior: "smooth", block: "center" });
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { deselect(); closeCart(); }
  if (selected !== null && !drawerOpen()) {
    if (e.key === "ArrowLeft") select((selected + N - 1) % N);
    if (e.key === "ArrowRight") select((selected + 1) % N);
  }
});

/* ---------- TICKER (seamless loop) ---------- */

const track = document.getElementById("ticker-track");
track.innerHTML += track.innerHTML;

/* ---------- CART ---------- */

const cart = new Map();
const drawer = document.getElementById("drawer");
const overlay = document.getElementById("overlay");
const drawerItems = document.getElementById("drawer-items");
const cartCount = document.getElementById("cart-count");
const subtotalEl = document.getElementById("subtotal");

function drawerOpen() { return !drawer.hidden; }

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
  toast("Demo checkout \u2014 this sample store takes no real orders.");
});

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
