// ============================================================
//  admin.js — Admin Dashboard Logic
//  King Trading Co. Grocery Store
//  Images stored as Base64 in Firestore (no Firebase Storage)
// ============================================================

const CATEGORIES     = ["Rice","Dal","Flour","Oil","Masala","Other"];
let allAdminProducts = [];
let editingId        = null;
let editImageUrl     = null;

// ── Init ──
document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
});

// ── Auth Guard ──
function checkAuth() {
  auth.onAuthStateChanged(user => {
    if (!user) { window.location.href = "login.html"; return; }
    const emailEl = document.getElementById("adminEmail");
    if (emailEl) { emailEl.textContent = user.email; emailEl.style.display = "inline"; }
    initAdmin();
  });
}

// ── Logout ──
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await auth.signOut();
  window.location.href = "login.html";
});

// ── Initialize Admin ──
function initAdmin() {
  loadAdminProducts();
  setupAddForm();
  setupEditModal();
  setupTableSearch();
}

// ── Load Products from Firestore ──
function loadAdminProducts() {
  productsCol.orderBy("createdAt", "desc").onSnapshot(snapshot => {
    allAdminProducts = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    renderAdminTable(allAdminProducts);
    updateStats(allAdminProducts);
  }, err => {
    console.error("Firestore error:", err);
    showAdminToast("Failed to load products: " + err.message, "error");
  });
}

// ── Stats ──
function updateStats(products) {
  document.getElementById("statTotal").textContent   = products.length;
  document.getElementById("statAvail").textContent   = products.filter(p => p.available).length;
  document.getElementById("statUnavail").textContent = products.filter(p => !p.available).length;
  const cats = [...new Set(products.map(p => p.category))].length;
  document.getElementById("statCats").textContent    = cats;
}

// ── Render Table ──
function renderAdminTable(products) {
  const tbody = document.getElementById("adminTableBody");
  if (!tbody) return;

  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-muted)">No products found</td></tr>`;
    return;
  }

  tbody.innerHTML = products.map(p => `
    <tr>
      <td>
        ${p.imageUrl
          ? `<img class="td-img" src="${p.imageUrl}" alt="${escHtml(p.productName)}">`
          : `<div class="td-img-placeholder">🛒</div>`}
      </td>
      <td class="td-name">${escHtml(p.productName)}</td>
      <td>${p.category || '—'}</td>
      <td class="td-price">${p.price > 0 ? '₹' + p.price.toLocaleString('en-IN') : '—'}</td>
      <td>
        <span class="avail-badge ${p.available ? 'yes' : 'no'}">
          ${p.available ? '✓ Available' : '✗ Unavailable'}
        </span>
      </td>
      <td>
        <button class="tbl-edit-btn" onclick="openEditModal('${p.id}')" title="Edit">✏️</button>
        <button class="tbl-del-btn"  onclick="deleteProduct('${p.id}','${escAttr(p.productName)}')" title="Delete">🗑</button>
      </td>
    </tr>`).join("");
}

// ── Table Search ──
function setupTableSearch() {
  document.getElementById("tableSearch")?.addEventListener("input", e => {
    const q = e.target.value.toLowerCase().trim();
    const filtered = allAdminProducts.filter(p =>
      p.productName.toLowerCase().includes(q) ||
      (p.category || "").toLowerCase().includes(q)
    );
    renderAdminTable(filtered);
  });
}

// ── Toggle Add Form ──
document.getElementById("toggleAddForm")?.addEventListener("click", function () {
  const body = document.getElementById("addFormBody");
  this.classList.toggle("open");
  body.classList.toggle("show");
  this.querySelector(".toggle-icon").textContent = body.classList.contains("show") ? "✕" : "＋";
});

// ── Setup Add Form ──
function setupAddForm() {
  const form     = document.getElementById("addProductForm");
  const imgInput = document.getElementById("imgInput");
  const imgPrev  = document.getElementById("imgPreview");
  const imgText  = document.getElementById("imgUploadText");

  // Populate categories
  const catSel = document.getElementById("addCategory");
  if (catSel) catSel.innerHTML = CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join("");

  // Show image preview when user selects a file
  imgInput?.addEventListener("change", async e => {
    const file = e.target.files[0];
    if (!file) return;

    // Show original size
    const sizeEl = document.getElementById("addSizeInfo");
    if (sizeEl) sizeEl.textContent = `Original: ${Math.round(file.size / 1024)} KB — compressing…`;

    // Show progress
    showProgress("uploadProgress", "progressFill", "progressText", 40);

    // Compress to base64
    const base64 = await compressToBase64(file, 500);

    showProgress("uploadProgress", "progressFill", "progressText", 100);
    setTimeout(() => hideProgress("uploadProgress"), 1000);

    // ✅ Show preview ABOVE the upload zone
    imgPrev.src = base64;
    imgPrev.classList.add("show");

    const compKB = getBase64KB(base64);
    if (sizeEl) sizeEl.textContent = `Original: ${Math.round(file.size/1024)} KB → Compressed: ${compKB} KB ✓`;
    if (imgText) imgText.textContent = `✓ Image selected — ${file.name}`;
  });

  // Submit — save to Firestore with base64 image
  form?.addEventListener("submit", async e => {
    e.preventDefault();

    const name     = document.getElementById("addName").value.trim();
    const price    = parseFloat(document.getElementById("addPrice").value) || 0;
    const category = document.getElementById("addCategory").value;
    const avail    = document.getElementById("addAvail").checked;
    const file     = imgInput.files[0];

    if (!name) { showAdminToast("Product name is required", "error"); return; }

    const saveBtn = document.getElementById("addSaveBtn");
    saveBtn.disabled = true;
    saveBtn.innerHTML = `<div class="spinner"></div> Saving…`;

    try {
      let imageUrl = "";
      if (file) {
        imageUrl = await compressToBase64(file, 500);
      }

      // ✅ imageUrl is a base64 data string — stored directly in Firestore
      await productsCol.add({
        productName: name,
        price,
        category,
        imageUrl,
        available: avail,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      form.reset();
      imgPrev.classList.remove("show");
      if (imgText) imgText.innerHTML = `<strong>Click to upload</strong> or drag & drop<br>JPG, PNG up to 5MB (auto-compressed)`;
      const sizeEl = document.getElementById("addSizeInfo");
      if (sizeEl) sizeEl.textContent = "";
      showAdminToast("✓ Product added successfully!", "success");

    } catch (err) {
      console.error(err);
      showAdminToast("Error: " + err.message, "error");
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = "💾 Save Product";
    }
  });
}

// ── Edit Modal Setup ──
function setupEditModal() {
  const catSel = document.getElementById("editCategory");
  if (catSel) catSel.innerHTML = CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join("");

  document.getElementById("editModalClose")?.addEventListener("click", closeEditModal);
  document.getElementById("editModalOverlay")?.addEventListener("click", e => {
    if (e.target === e.currentTarget) closeEditModal();
  });

  const editImgInput = document.getElementById("editImgInput");
  const editImgPrev  = document.getElementById("editImgPreview");
  const editImgText  = document.getElementById("editImgText");

  // When admin picks a new image in edit modal
  editImgInput?.addEventListener("change", async e => {
    const file = e.target.files[0];
    if (!file) return;

    const sizeEl = document.getElementById("editSizeInfo");
    if (sizeEl) sizeEl.textContent = `Original: ${Math.round(file.size / 1024)} KB — compressing…`;

    // Compress to base64
    const base64 = await compressToBase64(file, 500);

    // ✅ Show preview ABOVE the upload zone
    editImgPrev.src = base64;
    editImgPrev.classList.add("show");

    editImageUrl = base64; // replace old base64 with new one
    const compKB = getBase64KB(base64);
    if (sizeEl)    sizeEl.textContent   = `Original: ${Math.round(file.size/1024)} KB → Compressed: ${compKB} KB ✓`;
    if (editImgText) editImgText.textContent = `✓ New image selected — ${file.name}`;
  });

  // Edit form submit
  document.getElementById("editProductForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    if (!editingId) return;

    const name  = document.getElementById("editName").value.trim();
    const price = parseFloat(document.getElementById("editPrice").value) || 0;
    const cat   = document.getElementById("editCategory").value;
    const avail = document.getElementById("editAvail").checked;

    if (!name) { showAdminToast("Product name is required", "error"); return; }

    const saveBtn = document.getElementById("editSaveBtn");
    saveBtn.disabled = true;
    saveBtn.innerHTML = `<div class="spinner"></div> Saving…`;

    try {
      // editImageUrl = old base64 (unchanged) OR new base64 (if admin uploaded new image)
      await productsCol.doc(editingId).update({
        productName: name,
        price,
        category: cat,
        imageUrl: editImageUrl || "",
        available: avail,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      closeEditModal();
      showAdminToast("✓ Product updated!", "success");

    } catch (err) {
      showAdminToast("Error: " + err.message, "error");
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = "💾 Save Changes";
    }
  });
}

// ── Open Edit Modal ──
function openEditModal(id) {
  const product = allAdminProducts.find(p => p.id === id);
  if (!product) return;

  editingId    = id;
  editImageUrl = product.imageUrl || ""; // keep existing base64

  document.getElementById("editName").value     = product.productName;
  document.getElementById("editPrice").value    = product.price || "";
  document.getElementById("editCategory").value = product.category;
  document.getElementById("editAvail").checked  = product.available !== false;

  const prev    = document.getElementById("editImgPreview");
  const imgText = document.getElementById("editImgText");
  const sizeEl  = document.getElementById("editSizeInfo");

  if (product.imageUrl) {
    prev.src = product.imageUrl;
    prev.classList.add("show");
    if (imgText) imgText.textContent = `✓ Image exists — click to change`;
    if (sizeEl)  sizeEl.textContent  = `Stored: ${getBase64KB(product.imageUrl)} KB`;
  } else {
    prev.classList.remove("show");
    if (imgText) imgText.innerHTML = "<strong>Click to upload image</strong>";
    if (sizeEl)  sizeEl.textContent = "";
  }

  document.getElementById("editImgInput").value = "";
  document.getElementById("editModalOverlay").classList.add("open");
}

// ── Close Edit Modal ──
function closeEditModal() {
  document.getElementById("editModalOverlay").classList.remove("open");
  editingId    = null;
  editImageUrl = null;
}

// ── Delete Product ──
async function deleteProduct(id, name) {
  if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
  try {
    await productsCol.doc(id).delete();
    showAdminToast("🗑 Product deleted", "success");
  } catch (err) {
    showAdminToast("Error: " + err.message, "error");
  }
}

// ============================================================
//  compressToBase64()
//  Takes a File object, compresses it in the browser using
//  Canvas API, and returns a base64 data URL string.
//  This string is saved directly into Firestore's imageUrl field.
//
//  Flow:
//  1. Read file → FileReader → base64 data URL
//  2. Draw onto HTML Canvas (resize if > 1000px)
//  3. Re-encode as JPEG, reducing quality until under maxKB
//  4. Return final base64 string
// ============================================================
async function compressToBase64(file, maxKB = 500) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = ev => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width, h = img.height;

        // Step 1: Resize image dimensions
        const maxDim = 1000;
        if (w > maxDim || h > maxDim) {
          if (w > h) { h = Math.round(h * maxDim / w); w = maxDim; }
          else       { w = Math.round(w * maxDim / h); h = maxDim; }
        }

        canvas.width  = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);

        // Step 2: Reduce JPEG quality until size is under maxKB
        let quality = 0.82;
        const tryCompress = () => {
          const base64 = canvas.toDataURL("image/jpeg", quality);
          // Approximate byte size from base64 length
          const kb = Math.round((base64.length * 3) / 4 / 1024);
          if (kb > maxKB && quality > 0.25) {
            quality -= 0.08;
            tryCompress(); // try again with lower quality
          } else {
            resolve(base64); // ✅ done — return base64 string
          }
        };
        tryCompress();
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ── Progress bar helpers ──
function showProgress(wrapId, fillId, textId, pct) {
  const wrap = document.getElementById(wrapId);
  const fill = document.getElementById(fillId);
  const text = document.getElementById(textId);
  if (wrap) wrap.classList.add("show");
  if (fill) fill.style.width = pct + "%";
  if (text) text.textContent = pct < 100 ? "Compressing image…" : "Compressed! ✓";
}
function hideProgress(wrapId) {
  const wrap = document.getElementById(wrapId);
  if (wrap) wrap.classList.remove("show");
}

// ── Get KB size from base64 string ──
function getBase64KB(base64) {
  if (!base64) return 0;
  return Math.round((base64.length * 3) / 4 / 1024);
}

// ── Toast notification ──
function showAdminToast(msg, type = "") {
  let toast = document.getElementById("adminToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "adminToast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = `toast ${type} show`;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove("show"), 3200);
}

// ── Utils ──
function escHtml(s) { return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function escAttr(s) { return String(s).replace(/'/g,"&#39;").replace(/"/g,"&quot;"); }
