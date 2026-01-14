// 1. DATABASE PRODUK (Simulasi)
const products = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    category: "Tablet",
    price: 5000,
    stock: 50,
    unit: "Strip",
  },
  {
    id: 2,
    name: "Amoxicillin 500mg",
    category: "Tablet",
    price: 8500,
    stock: 20,
    unit: "Strip",
  },
  {
    id: 3,
    name: "OBH Combi Anak",
    category: "Sirup",
    price: 15000,
    stock: 15,
    unit: "Botol",
  },
  {
    id: 4,
    name: "Betadine 30ml",
    category: "Salep",
    price: 25000,
    stock: 8,
    unit: "Botol",
  },
  {
    id: 5,
    name: "Vitamin C IPI",
    category: "Tablet",
    price: 7000,
    stock: 100,
    unit: "Botol",
  },
  {
    id: 6,
    name: "Sanmol Sirup",
    category: "Sirup",
    price: 18000,
    stock: 12,
    unit: "Botol",
  },
  {
    id: 7,
    name: "Insto Mata",
    category: "Alat",
    price: 13500,
    stock: 25,
    unit: "Pcs",
  },
  {
    id: 8,
    name: "Bodrex Migra",
    category: "Tablet",
    price: 4500,
    stock: 40,
    unit: "Strip",
  },
];

let cart = [];

// Format Rupiah
const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

// Tanggal Hari Ini
const dateEl = document.getElementById("currentDate");
if (dateEl) {
  dateEl.innerText = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// 2. RENDER PRODUK (Cara Aman menggunakan createElement)
function renderProducts(filterText = "", category = "all") {
  const productGrid = document.getElementById("productGrid");
  productGrid.innerHTML = ""; // Bersihkan grid

  const filtered = products.filter((p) => {
    const matchName = p.name.toLowerCase().includes(filterText.toLowerCase());
    const matchCat = category === "all" || p.category === category;
    return matchName && matchCat;
  });

  if (filtered.length === 0) {
    productGrid.innerHTML =
      '<p style="text-align:center; grid-column: 1/-1; color:#9ca3af; margin-top: 20px;">Produk tidak ditemukan.</p>';
    return;
  }

  filtered.forEach((p) => {
    // Buat elemen DIV baru untuk kartu
    const card = document.createElement("div");
    card.className = "product-card";

    // Isi HTML kartu
    card.innerHTML = `
            <div>
                <div class="p-name">${p.name}</div>
                <div class="p-stock">Stok: ${p.stock}</div>
            </div>
            <div>
                <div class="p-price">${formatRupiah(
                  p.price
                )} <span class="p-unit">/${p.unit}</span></div>
            </div>
        `;

    // Event Listener (Klik kartu = Masuk Keranjang)
    card.addEventListener("click", () => {
      addToCart(p.id);
    });

    // Masukkan kartu ke Grid
    productGrid.appendChild(card);
  });
}

// 3. LOGIKA KERANJANG
function addToCart(id) {
  const product = products.find((p) => p.id === id);
  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    if (existingItem.qty < product.stock) {
      existingItem.qty++;
    } else {
      alert("Stok habis / maksimal!");
      return;
    }
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
}

function updateCartQty(id, change) {
  const item = cart.find((item) => item.id === id);
  if (item) {
    item.qty += change;
    if (item.qty <= 0) {
      cart = cart.filter((i) => i.id !== id);
    }
  }
  updateCartUI();
}

function clearCart() {
  if (cart.length > 0 && confirm("Kosongkan keranjang?")) {
    cart = [];
    updateCartUI();
  }
}

// 4. UPDATE TAMPILAN KERANJANG & TOTAL
function updateCartUI() {
  const cartContainer = document.getElementById("cartItems");
  cartContainer.innerHTML = "";

  let subtotal = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = `
            <div class="empty-state-cart">
                <i class="ph ph-shopping-cart" style="font-size: 32px; color: #d1d5db;"></i>
                <p>Keranjang kosong</p>
            </div>`;
  }

  cart.forEach((item) => {
    subtotal += item.price * item.qty;

    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
            <div style="flex:1;">
                <h4>${item.name}</h4>
                <p>${formatRupiah(item.price)}</p>
            </div>
            <div class="qty-control">
                <button class="qty-btn minus">-</button>
                <span style="font-size:13px; font-weight:600; min-width:20px; text-align:center;">${
                  item.qty
                }</span>
                <button class="qty-btn plus">+</button>
            </div>
        `;

    // Event Listener Tombol +/- (Supaya tidak bentrok)
    row
      .querySelector(".minus")
      .addEventListener("click", () => updateCartQty(item.id, -1));
    row
      .querySelector(".plus")
      .addEventListener("click", () => updateCartQty(item.id, 1));

    cartContainer.appendChild(row);
  });

  // Hitung Total Akhir
  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  document.getElementById("subtotalLabel").innerText = formatRupiah(subtotal);
  document.getElementById("taxLabel").innerText = formatRupiah(tax);
  document.getElementById("totalLabel").innerText = formatRupiah(total);
}

// 5. EVENT LISTENER FILTER & SEARCH
const searchInput = document.getElementById("searchProduct");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    // Ambil kategori yang sedang aktif
    const activeCat =
      document.querySelector(".pill.active")?.innerText || "Semua";
    // Mapping text tombol ke value kategori
    let catValue = "all";
    if (activeCat === "Tablet") catValue = "Tablet";
    if (activeCat === "Sirup") catValue = "Sirup";
    if (activeCat === "Salep") catValue = "Salep";

    renderProducts(e.target.value, catValue);
  });
}

// Fungsi Filter Global (Agar bisa dipanggil dari HTML onclick)
window.filterCategory = function (cat) {
  // Highlight Tombol
  document
    .querySelectorAll(".pill")
    .forEach((btn) => btn.classList.remove("active"));
  // Cari tombol yang diklik (sedikit tricky karena onclick di HTML)
  const pills = document.querySelectorAll(".pill");
  pills.forEach((p) => {
    if (p.innerText === cat || (cat === "all" && p.innerText === "Semua")) {
      p.classList.add("active");
    }
  });

  renderProducts(document.getElementById("searchProduct").value, cat);
};

// Fungsi Checkout Global
window.processCheckout = function () {
  if (cart.length === 0) return alert("Keranjang kosong!");
  const total = document.getElementById("totalLabel").innerText;
  alert(`Pembayaran Berhasil!\nTotal: ${total}`);
  cart = [];
  updateCartUI();
};

// 6. JALANKAN PERTAMA KALI
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCartUI();
});
