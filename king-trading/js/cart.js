// ============================================================
//  cart.js — Cart Page Logic
//  King Trading Co. Grocery Store
// ============================================================

const WA_NUMBER  = "919080348568";
const WA_MSG_BASE = "Vanakkam king trading co, I would like to place an order.";

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateCartBadge();

  document.getElementById("clearCartBtn")?.addEventListener("click", clearCart);
  document.getElementById("checkoutBtn")?.addEventListener("click", checkoutWhatsApp);
  document.getElementById("continueBtn")?.addEventListener("click", () => { window.location.href = "index.html"; });
});

// ── Render Cart ──
function renderCart() {
  const cart = getCart();
  const listEl  = document.getElementById("cartList");
  const emptyEl = document.getElementById("cartEmpty");
  const summaryEl = document.getElementById("cartSummary");

  if (!listEl) return;

  if (cart.length === 0) {
    listEl.innerHTML = "";
    if (emptyEl)   emptyEl.style.display = "block";
    if (summaryEl) summaryEl.style.display = "none";
    updateSummary(cart);
    return;
  }

  if (emptyEl)   emptyEl.style.display = "none";
  if (summaryEl) summaryEl.style.display = "block";

  listEl.innerHTML = cart.map(item => cartItemHTML(item)).join("");
  updateSummary(cart);
}

// ── Cart Item HTML ──
function cartItemHTML(item) {
  const imgEl = item.image
    ? `<img class="ci-img" src="${item.image}" alt="${escHtml(item.name)}" onerror="this.outerHTML='<div class=\'ci-img-placeholder\'>🛒</div>'">`
    : `<div class="ci-img-placeholder">${catEmoji(item.name)}</div>`;
  const priceStr = item.price > 0
    ? `₹${item.price.toLocaleString('en-IN')} × ${item.qty}`
    : `Qty: ${item.qty}`;
  return `
    <div class="cart-item" data-id="${item.id}">
      ${imgEl}
      <div class="ci-info">
        <div class="ci-name">${escHtml(item.name)}</div>
        <div class="ci-price">${priceStr}</div>
      </div>
      <div class="ci-controls">
        <button class="qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty('${item.id}', +1)">＋</button>
        <button class="ci-remove" onclick="removeItem('${item.id}')" title="Remove">🗑</button>
      </div>
    </div>`;
}

// ── Update Summary ──
function updateSummary(cart) {
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal  = cart.reduce((s, i) => s + (i.price * i.qty), 0);

  const elCount    = document.getElementById("summItemCount");
  const elSub      = document.getElementById("summSubtotal");
  const elTotal    = document.getElementById("summTotal");
  const elTotalTop = document.getElementById("summTotalTop");

  if (elCount)    elCount.textContent    = `${itemCount} item${itemCount !== 1 ? "s" : ""}`;
  if (elSub)      elSub.textContent      = subtotal > 0 ? `₹${subtotal.toLocaleString('en-IN')}` : "—";
  if (elTotal)    elTotal.textContent    = subtotal > 0 ? `₹${subtotal.toLocaleString('en-IN')}` : "—";
  if (elTotalTop) elTotalTop.textContent = `${itemCount}`;
}

// ── Change Quantity ──
function changeQty(id, delta) {
  const cart = getCart();
  const idx  = cart.findIndex(i => i.id === id);
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1); // auto-remove
  saveCart(cart);
  renderCart();
  updateCartBadge();
}

// ── Remove Item ──
function removeItem(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
  updateCartBadge();
}

// ── Clear Cart ──
function clearCart() {
  if (!confirm("Clear all items from cart?")) return;
  saveCart([]);
  renderCart();
  updateCartBadge();
}

// ── WhatsApp Checkout ──
function checkoutWhatsApp() {
  const cart = getCart();
  if (cart.length === 0) { alert("Your cart is empty!"); return; }

  let msg = WA_MSG_BASE + "\n\n*My Order:*\n";
  cart.forEach((item, i) => {
    msg += `${i+1}. ${item.name} × ${item.qty}`;
    if (item.price > 0) msg += ` (₹${(item.price * item.qty).toLocaleString('en-IN')})`;
    msg += "\n";
  });

  const total = cart.reduce((s,i) => s + (i.price * i.qty), 0);
  if (total > 0) msg += `\n*Total: ₹${total.toLocaleString('en-IN')}*`;
  msg += "\n\nThank you!";

  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}

// ── Helpers ──
function getCart()      { try { return JSON.parse(localStorage.getItem("kt_cart") || "[]"); } catch(e) { return []; } }
function saveCart(cart) { localStorage.setItem("kt_cart", JSON.stringify(cart)); }

function updateCartBadge() {
  const cart  = getCart();
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll(".cart-badge").forEach(b => {
    b.textContent = total;
    b.classList.toggle("show", total > 0);
  });
}

function catEmoji(name) {
  const n = (name||"").toLowerCase();
  if (n.includes("rice")||n.includes("bpt")||n.includes("basmathi")||n.includes("idly")||n.includes("adt")) return "🌾";
  if (n.includes("dal")) return "🫘";
  if (n.includes("atta")||n.includes("maida")||n.includes("flour")||n.includes("rava")) return "🌻";
  if (n.includes("oil")||n.includes("vanaspathy")) return "🫙";
  if (n.includes("masala")) return "🌶️";
  return "🛒";
}

function escHtml(s) { return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
