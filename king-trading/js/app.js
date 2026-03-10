// ============================================================
//  app.js — Customer Menu Page Logic
//  King Trading Co. Grocery Store
// ============================================================

// ── Seed data (loaded if Firestore is empty or offline) ──
const SEED_PRODUCTS = [
  { productName:"A M30",                        price:0, category:"Rice",    available:true },
  { productName:"Aschippam 50 K",               price:0, category:"Flour",   available:true },
  { productName:"Aska 25 Kg",                   price:0, category:"Rice",    available:true },
  { productName:"Aska No.1 50 Kg",              price:0, category:"Rice",    available:true },
  { productName:"Atta 10kg",                    price:0, category:"Flour",   available:true },
  { productName:"Atta 50K",                     price:0, category:"Flour",   available:true },
  { productName:"Deepam Oil 180 Bottle",        price:0, category:"Oil",     available:true },
  { productName:"Deepam Oil 350 Bottle",        price:0, category:"Oil",     available:true },
  { productName:"Deepam Oil 500 Bottle",        price:0, category:"Oil",     available:true },
  { productName:"Deepam Oil 500 Pouch",         price:0, category:"Oil",     available:true },
  { productName:"Dummy",                        price:0, category:"Other",   available:true },
  { productName:"Frg 30kg 222",                 price:0, category:"Rice",    available:true },
  { productName:"Frg 30kg Apple",               price:0, category:"Rice",    available:true },
  { productName:"Frg Gopuram",                  price:0, category:"Rice",    available:true },
  { productName:"Gf Joker 30Kg",                price:0, category:"Rice",    available:true },
  { productName:"Gf Leader 30Kg",               price:0, category:"Rice",    available:true },
  { productName:"GF NO1 30k",                   price:0, category:"Rice",    available:true },
  { productName:"Gf Tiger",                     price:0, category:"Rice",    available:true },
  { productName:"KV +++ Atta 50K",              price:0, category:"Flour",   available:true },
  { productName:"Maida 10kg VG Mudai",          price:0, category:"Flour",   available:true },
  { productName:"Maida 50 Kg Meenachi Diamond", price:0, category:"Flour",   available:true },
  { productName:"Maida 50K VERY NICE",          price:0, category:"Flour",   available:true },
  { productName:"Maida KURUVI 50Kg",            price:0, category:"Flour",   available:true },
  { productName:"Maida Oxygen 50KG",            price:0, category:"Flour",   available:true },
  { productName:"Maida Vnice 10Kg Chippam",     price:0, category:"Flour",   available:true },
  { productName:"MDall 30Kg",                   price:0, category:"Dal",     available:true },
  { productName:"ODall 25kg",                   price:0, category:"Dal",     available:true },
  { productName:"ODall 50kg GANESH",            price:0, category:"Dal",     available:true },
  { productName:"ODall GUBERAN 50kg",           price:0, category:"Dal",     available:true },
  { productName:"ODall KANNAN 50kg",            price:0, category:"Dal",     available:true },
  { productName:"Onion Bold",                   price:0, category:"Other",   available:true },
  { productName:"Onion Medium",                 price:0, category:"Other",   available:true },
  { productName:"Onion New",                    price:0, category:"Other",   available:true },
  { productName:"PDall Australia",              price:0, category:"Dal",     available:true },
  { productName:"PDall Satha",                  price:0, category:"Dal",     available:true },
  { productName:"Pori Hand Fry",                price:0, category:"Other",   available:true },
  { productName:"Puli AC NO1",                  price:0, category:"Other",   available:true },
  { productName:"Puli BEST",                    price:0, category:"Other",   available:true },
  { productName:"PULI Special New",             price:0, category:"Other",   available:true },
  { productName:"R Adt45 Baloon26 Kg",          price:0, category:"Rice",    available:true },
  { productName:"Rava Very Nice 50K",           price:0, category:"Flour",   available:true },
  { productName:"R Basmathi BK Platina 26Kg",   price:0, category:"Rice",    available:true },
  { productName:"R Basmathi Nazreen 30Kg",      price:0, category:"Rice",    available:true },
  { productName:"R Bpt Krishna 26kg Old",       price:0, category:"Rice",    available:true },
  { productName:"R Bpt Krishna New 26 Kg",      price:0, category:"Rice",    available:true },
  { productName:"R Bpt Omsakthi 26kg",          price:0, category:"Rice",    available:true },
  { productName:"R Bullet SS 26Kg",             price:0, category:"Rice",    available:true },
  { productName:"R DT Vadakolam 26kg",          price:0, category:"Rice",    available:true },
  { productName:"R DT Vadakolam 30Kg",          price:0, category:"Rice",    available:true },
  { productName:"Real Diamond",                 price:0, category:"Rice",    available:true },
  { productName:"R HMT Andal Nachiyar 26 Kg",   price:0, category:"Rice",    available:true },
  { productName:"R HMT Annalakshmi 26kg",       price:0, category:"Rice",    available:true },
  { productName:"R HMT Kitchen King 26Kg",      price:0, category:"Rice",    available:true },
  { productName:"R Idly Addukumali 26Kg",       price:0, category:"Rice",    available:true },
  { productName:"R Idly Nirmalaya 26Kg",        price:0, category:"Rice",    available:true },
  { productName:"R IDLY Orange 26kg",           price:0, category:"Rice",    available:true },
  { productName:"R KA CS 26kg",                 price:0, category:"Rice",    available:true },
  { productName:"RNR Pannayar 26 Kg",           price:0, category:"Rice",    available:true },
  { productName:"R Pachai 26Kg",                price:0, category:"Rice",    available:true },
  { productName:"Samiya Ragi",                  price:0, category:"Flour",   available:true },
  { productName:"TDall 25kg",                   price:0, category:"Dal",     available:true },
  { productName:"Tdall Orange 50KG",            price:0, category:"Dal",     available:true },
  { productName:"Vanaspathy Abirami 10kg",      price:0, category:"Oil",     available:true },
  { productName:"Vanaspathy Bakery Green Gold",  price:0, category:"Oil",     available:true },
  { productName:"Vanaspathy Bess",              price:0, category:"Oil",     available:true },
  { productName:"Vanaspathy Margarine Cake 5 Kg",price:0,category:"Oil",     available:true },
  { productName:"Vanaspathy PRIDE Puff",        price:0, category:"Oil",     available:true },
  { productName:"Vanaspathy RICHLAYER Puff",    price:0, category:"Oil",     available:true },
  { productName:"Vanaspathy T S R Biscuits",    price:0, category:"Oil",     available:true },
  { productName:"Vanaspathy T.S.R. Cream",      price:0, category:"Oil",     available:true },
  { productName:"Vanaspathy Tsr Fiesta 5kg",    price:0, category:"Oil",     available:true },
  { productName:"Vanaspathy T S R Puff",        price:0, category:"Oil",     available:true },
  { productName:"Masala Mix",                   price:0, category:"Masala",  available:true },
];

// Category emoji map
const CAT_EMOJI = {
  Rice:"🌾", Dal:"🫘", Flour:"🌻", Oil:"🫙", Masala:"🌶️", Other:"🛒"
};

// ── State ──
let allProducts   = [];
let activeCategory = "All";
let searchQuery   = "";

// ── DOM Refs ──
const productsGrid = document.getElementById("productsGrid");
const filterBtns   = document.querySelectorAll(".filter-btn");
const searchInput  = document.getElementById("searchInput");

// ── Init ──
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  showSkeletons(10);
  loadProducts();

  // Search
  searchInput?.addEventListener("input", e => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderProducts();
  });

  // Category filters
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.cat;
      renderProducts();
    });
  });
});

// ── Load Products from Firestore ──
function loadProducts() {
  try {
    productsCol
      .orderBy("createdAt", "desc")
      .onSnapshot(snapshot => {
        if (snapshot.empty) {
          // Use seed data if collection empty
          allProducts = SEED_PRODUCTS.map((p, i) => ({ id: `seed-${i}`, ...p }));
        } else {
          allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
        renderProducts();
      }, err => {
        console.warn("Firestore unavailable, using seed data:", err.message);
        allProducts = SEED_PRODUCTS.map((p, i) => ({ id: `seed-${i}`, ...p }));
        renderProducts();
      });
  } catch(e) {
    allProducts = SEED_PRODUCTS.map((p, i) => ({ id: `seed-${i}`, ...p }));
    renderProducts();
  }
}

// ── Render ──
function renderProducts() {
  const filtered = allProducts.filter(p => {
    const matchCat    = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = !searchQuery ||
                        p.productName.toLowerCase().includes(searchQuery) ||
                        (p.category || "").toLowerCase().includes(searchQuery);
    return matchCat && matchSearch;
  });

  // Update count
  const countEl = document.getElementById("productCount");
  if (countEl) countEl.textContent = filtered.length + " items";

  if (!productsGrid) return;
  if (filtered.length === 0) {
    productsGrid.innerHTML = `
      <div class="empty-state">
        <div class="es-icon">🔍</div>
        <h3>No products found</h3>
        <p>Try a different search or category</p>
      </div>`;
    return;
  }

  productsGrid.innerHTML = filtered.map(p => productCard(p)).join("");
  // Stagger animation
  productsGrid.querySelectorAll(".product-card").forEach((c, i) => {
    c.style.animationDelay = `${i * 0.035}s`;
  });
}

// ── Product Card HTML ──
function productCard(p) {
  const imgHtml = p.imageUrl
    ? `<img src="${p.imageUrl}" alt="${escHtml(p.productName)}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\'card-placeholder\'><div class=\'ph-icon\'>🛒</div></div>'">`
    : `<div class="card-placeholder"><div class="ph-icon">${CAT_EMOJI[p.category]||'🛒'}</div></div>`;
  const priceHtml = p.price > 0
    ? `<div class="card-price"><span class="currency">₹</span>${p.price.toLocaleString('en-IN')}</div>`
    : `<div class="card-price no-price">Price on request</div>`;
  const addHtml = p.available !== false
    ? `<button class="add-btn" onclick="addToCart('${p.id}','${escAttr(p.productName)}',${p.price||0},'${escAttr(p.imageUrl||'')}')">
        <span>＋</span> Add to Cart
       </button>`
    : `<button class="add-btn" disabled style="background:#e5e7eb;color:#9ca3af;cursor:not-allowed">Unavailable</button>`;
  return `
    <div class="product-card${p.available===false?' unavailable':''}">
      <div class="card-img-wrap">
        ${imgHtml}
        <span class="cat-pill">${CAT_EMOJI[p.category]||''} ${p.category||'Other'}</span>
      </div>
      <div class="card-body">
        <div class="card-name">${escHtml(p.productName)}</div>
        ${priceHtml}
        ${addHtml}
      </div>
    </div>`;
}

// ── Skeletons ──
function showSkeletons(n) {
  if (!productsGrid) return;
  productsGrid.innerHTML = Array(n).fill(`
    <div class="skeleton-card">
      <div class="skeleton skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line short"></div>
        <div class="skeleton skeleton-line btn"></div>
      </div>
    </div>`).join("");
}

// ── Cart (add) ──
function addToCart(id, name, price, image) {
  const cart = getCart();
  const existing = cart.find(i => i.id === id);
  if (existing) { existing.qty += 1; }
  else           { cart.push({ id, name, price, image, qty: 1 }); }
  saveCart(cart);
  updateCartBadge();
  showToast(`🛒 ${name} added!`, "success");

  // Visual feedback on button
  const btns = document.querySelectorAll(`.add-btn`);
  btns.forEach(btn => {
    if (btn.getAttribute("onclick")?.includes(`'${id}'`)) {
      btn.classList.add("added");
      btn.textContent = "✓ Added";
      setTimeout(() => { btn.classList.remove("added"); btn.innerHTML = "<span>＋</span> Add to Cart"; }, 1200);
    }
  });
}

// ── Cart helpers ──
function getCart()       { try { return JSON.parse(localStorage.getItem("kt_cart") || "[]"); } catch(e) { return []; } }
function saveCart(cart)  { localStorage.setItem("kt_cart", JSON.stringify(cart)); }
function updateCartBadge() {
  const cart   = getCart();
  const total  = cart.reduce((s, i) => s + i.qty, 0);
  const badges = document.querySelectorAll(".cart-badge");
  badges.forEach(b => {
    b.textContent = total;
    b.classList.toggle("show", total > 0);
  });
}

// ── Toast notification ──
function showToast(msg, type = "") {
  let toast = document.getElementById("globalToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "globalToast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = `toast ${type} show`;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove("show"), 2800);
}

// ── Utils ──
function escHtml(s)  { return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function escAttr(s)  { return String(s).replace(/'/g,"&#39;").replace(/"/g,"&quot;"); }
