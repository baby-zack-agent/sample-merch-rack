/* Sample Merch — rack shop demo. No backend; cart lives in memory. */

const PRODUCTS = [
  { id: "wildflower",  name: "Wildflower Script Tee",      price: 38, color: "#f7f3ea", ink: "#191713", graphic: "script-flowers" },
  { id: "escape",      name: "Escape the Ordinary Tee",    price: 36, color: "#1c1a17", ink: "#f7f3ea", graphic: "stacked-text" },
  { id: "supply",      name: "Supply Pocket Tee",          price: 34, color: "#2e4b34", ink: "#f2e8c9", graphic: "chest-text" },
  { id: "twentythree", name: "Come With 23 Longsleeve",    price: 48, color: "#1c1a17", ink: "#f2e8c9", graphic: "number23", long: true },
  { id: "blush",       name: "Blush Script Tee",           price: 34, color: "#f3b8c6", ink: "#fffdf7", graphic: "script" },
  { id: "sol",         name: "Solstice Sun Tee",           price: 36, color: "#d8d2c4", ink: "#191713", graphic: "sun" },
  { id: "checker",     name: "Checker Band Tee",           price: 38, color: "#f7f3ea", ink: "#191713", graphic: "checker" },
  { id: "tide",        name: "Tide Lines Tee",             price: 34, color: "#33383e", ink: "#e8e2d2", graphic: "waves" },
  { id: "daisy",       name: "Daisy Chain Tee",            price: 36, color: "#1c1a17", ink: "#f7f3ea", graphic: "daisy" },
  { id: "smile",       name: "Acid Smile Tee",             price: 32, color: "#efe6d0", ink: "#191713", graphic: "smile" },
];

/* ---------- SVG builders ---------- */

function hangerSVG() {
  return `
    <path d="M60 14 C58 7 53 4 50 7 C47 10 50 14 54 13" fill="none" stroke="#8a6a3f" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M60 14 L30 32 M60 14 L90 32" stroke="#b98a4e" stroke-width="7" stroke-linecap="round"/>
    <circle cx="60" cy="14" r="2.6" fill="#8a6a3f"/>`;
}

function teeBody(p) {
  const body = p.long
    ? "M50 32 L30 38 L16 116 L30 120 L40 62 L40 148 L80 148 L80 62 L90 120 L104 116 L90 38 L70 32 C64 40 56 42 52 40 C48 38 46 35 50 32 Z"
    : "M50 32 L30 38 L14 62 L28 68 L36 56 L36 148 L84 148 L84 56 L92 68 L106 62 L90 38 L70 32 C64 40 56 42 52 40 C48 38 46 35 50 32 Z";
  return `<path d="${body}" fill="${p.color}" stroke="rgba(0,0,0,0.10)" stroke-width="1.5"/>`;
}

function graphicSVG(p) {
  const ink = p.ink;
  switch (p.graphic) {
    case "script-flowers":
      return `
        <text x="60" y="92" text-anchor="middle" font-family="Caveat, cursive" font-size="26" font-weight="700" fill="#e4572e" transform="rotate(-4 60 92)">wildflowers</text>
        <g fill="#e4572e"><circle cx="38" cy="76" r="3.4"/><circle cx="84" cy="80" r="3.4"/></g>
        <g fill="#7ba05b"><circle cx="44" cy="70" r="2.6"/><circle cx="78" cy="74" r="2.6"/></g>
        <g fill="#f2b134"><circle cx="60" cy="70" r="3"/></g>`;
    case "stacked-text":
      return `
        <text x="60" y="78" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="600" letter-spacing="2" fill="${ink}">ESCAPE</text>
        <text x="60" y="96" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="600" letter-spacing="2" fill="${ink}">THE</text>
        <text x="60" y="114" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="600" letter-spacing="2" fill="${ink}">ORDINARY</text>`;
    case "chest-text":
      return `<text x="60" y="66" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" font-weight="600" letter-spacing="3" fill="${ink}">SAMPLE SUPPLY</text>`;
    case "number23":
      return `
        <text x="60" y="74" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="600" letter-spacing="4" fill="${ink}">COME WITH</text>
        <text x="60" y="118" text-anchor="middle" font-family="Caveat, cursive" font-size="52" font-weight="700" fill="${ink}">23</text>`;
    case "script":
      return `<text x="60" y="98" text-anchor="middle" font-family="Caveat, cursive" font-size="30" font-weight="700" fill="${ink}" transform="rotate(-5 60 98)">merch!</text>`;
    case "sun":
      return `
        <circle cx="60" cy="92" r="14" fill="${ink}"/>
        ${Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI) / 4;
          const x1 = 60 + Math.cos(a) * 19, y1 = 92 + Math.sin(a) * 19;
          const x2 = 60 + Math.cos(a) * 26, y2 = 92 + Math.sin(a) * 26;
          return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"/>`;
        }).join("")}`;
    case "checker":
      return `
        ${[0, 1, 2, 3].map(r => [0, 1, 2, 3, 4, 5].map(c =>
          `<rect x="${36 + c * 8}" y="${80 + r * 8}" width="8" height="8" fill="${(r + c) % 2 ? ink : "none"}"/>`
        ).join("")).join("")}`;
    case "waves":
      return `
        <path d="M40 84 q10 -8 20 0 t20 0" fill="none" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M40 96 q10 -8 20 0 t20 0" fill="none" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M40 108 q10 -8 20 0 t20 0" fill="none" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"/>`;
    case "daisy":
      return `
        ${Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI) / 4;
          return `<ellipse cx="${(60 + Math.cos(a) * 10).toFixed(1)}" cy="${(92 + Math.sin(a) * 10).toFixed(1)}" rx="4.4" ry="7" fill="${ink}" transform="rotate(${(a * 180 / Math.PI).toFixed(0)} 60 92)"/>`;
        }).join("")}
        <circle cx="60" cy="92" r="5" fill="#f2b134"/>`;
    case "smile":
      return `
        <circle cx="60" cy="92" r="17" fill="none" stroke="${ink}" stroke-width="3"/>
        <circle cx="53" cy="86" r="2.6" fill="${ink}"/><circle cx="67" cy="86" r="2.6" fill="${ink}"/>
        <path d="M48 96 q12 10 24 0" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`;
    default:
      return "";
  }
}

function shirtSVG(p) {
  return `
  <svg viewBox="0 0 120 160" role="img" aria-label="${p.name}">
    ${hangerSVG()}
    ${teeBody(p)}
    ${graphicSVG(p)}
  </svg>`;
}

/* ---------- RENDER ---------- */

const shirtsEl = document.getElementById("shirts");
const gridEl = document.getElementById("grid");

PRODUCTS.forEach((p, i) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "shirt-item";
  btn.setAttribute("role", "listitem");
  btn.title = p.name;
  btn.style.setProperty("--dur", (4.6 + (i % 5) * 0.55).toFixed(2) + "s");
  btn.style.setProperty("--delay", (-i * 0.7).toFixed(2) + "s");
  btn.innerHTML = shirtSVG(p);
  btn.addEventListener("click", () => openCarousel(i));
  shirtsEl.appendChild(btn);

  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="card-art" data-i="${i}" style="cursor:pointer" role="button" tabindex="0" aria-label="View ${p.name}">${shirtSVG(p)}</div>
    <div class="card-name">${p.name}</div>
    <div class="card-price">$${p.price}</div>
    <button class="pill" type="button" data-add="${p.id}">Add to cart</button>`;
  gridEl.appendChild(card);
});

gridEl.addEventListener("click", (e) => {
  const art = e.target.closest(".card-art");
  if (art) openCarousel(Number(art.dataset.i));
  const add = e.target.closest("[data-add]");
  if (add) addToCart(add.dataset.add);
});
gridEl.addEventListener("keydown", (e) => {
  const art = e.target.closest(".card-art");
  if (art && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openCarousel(Number(art.dataset.i)); }
});

/* ---------- CAROUSEL ---------- */

const carousel = document.getElementById("carousel");
const carShown = document.getElementById("car-shown");
const carGhostL = document.getElementById("car-ghost-left");
const carGhostR = document.getElementById("car-ghost-right");
const carName = document.getElementById("car-name");
const carPrice = document.getElementById("car-price");
const carAdd = document.getElementById("car-add");
let carIndex = 0;

function renderCarousel() {
  const p = PRODUCTS[carIndex];
  const prev = PRODUCTS[(carIndex - 1 + PRODUCTS.length) % PRODUCTS.length];
  const next = PRODUCTS[(carIndex + 1) % PRODUCTS.length];
  carShown.innerHTML = shirtSVG(p);
  carGhostL.innerHTML = shirtSVG(prev);
  carGhostR.innerHTML = shirtSVG(next);
  carName.textContent = p.name;
  carPrice.textContent = "$" + p.price + " — ships in 1 week";
  carAdd.dataset.add = p.id;
}

function openCarousel(i) {
  carIndex = i;
  renderCarousel();
  carousel.hidden = false;
  carousel.scrollIntoView({ behavior: "smooth", block: "center" });
}

function closeCarousel() { carousel.hidden = true; }

document.getElementById("car-prev").addEventListener("click", () => {
  carIndex = (carIndex - 1 + PRODUCTS.length) % PRODUCTS.length;
  renderCarousel();
});
document.getElementById("car-next").addEventListener("click", () => {
  carIndex = (carIndex + 1) % PRODUCTS.length;
  renderCarousel();
});
document.getElementById("car-close").addEventListener("click", closeCarousel);
carAdd.addEventListener("click", () => addToCart(carAdd.dataset.add));
document.getElementById("featured-add").addEventListener("click", () => addToCart("wildflower"));

/* ---------- CART ---------- */

const cart = new Map(); // id -> qty
const drawer = document.getElementById("drawer");
const overlay = document.getElementById("overlay");
const drawerItems = document.getElementById("drawer-items");
const cartCount = document.getElementById("cart-count");
const subtotalEl = document.getElementById("subtotal");

function addToCart(id) {
  cart.set(id, (cart.get(id) || 0) + 1);
  renderCart();
  const p = PRODUCTS.find(x => x.id === id);
  toast(`${p.name} added to cart`);
}

function removeFromCart(id) {
  cart.delete(id);
  renderCart();
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
    drawerItems.innerHTML = `<p class="drawer-empty">your cart is empty —<br>grab something off the rack.</p>`;
    return;
  }
  drawerItems.innerHTML = [...cart.entries()].map(([id, qty]) => {
    const p = PRODUCTS.find(x => x.id === id);
    return `
      <div class="line-item">
        <div class="swatch" style="background:${p.color}"></div>
        <div class="line-info">
          <div class="line-name">${p.name} × ${qty}</div>
          <div class="line-price">$${p.price * qty}</div>
        </div>
        <button class="line-remove" type="button" data-remove="${id}">remove</button>
      </div>`;
  }).join("");
}

drawerItems.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-remove]");
  if (btn) removeFromCart(btn.dataset.remove);
});

function openCart() { drawer.hidden = false; overlay.hidden = false; document.body.style.overflow = "hidden"; }
function closeCart() { drawer.hidden = true; overlay.hidden = true; document.body.style.overflow = ""; }

document.getElementById("cart-open").addEventListener("click", openCart);
document.getElementById("cart-close").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.getElementById("checkout").addEventListener("click", () => {
  toast("demo checkout — this sample store doesn't take real orders");
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeCart(); closeCarousel(); }
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
