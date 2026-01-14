// input.js - PHARMAFLOW Input Stok Masuk

// 1. Simulasi Data Obat dari Database
const productsDB = [
  { id: 1, name: "Paracetamol 500mg (Strip)" },
  { id: 2, name: "Amoxicillin 500mg (Strip)" },
  { id: 3, name: "Vitamin C IPI (Botol)" },
  { id: 4, name: "OBH Combi Anak (Botol)" },
];

// 2. Ambil elemen DOM
const productSelect = document.getElementById("productSelect");
const customProductInput = document.getElementById("customProductInput");
const inventoryForm = document.getElementById("inventoryForm");
const historyTableBody = document.querySelector("#historyTable tbody");
const emptyState = document.getElementById("emptyState");
const toggleButtons = document.querySelectorAll(".toggle-btn");

// 3. Variable untuk track mode input
let inputMode = "select";

// 4. Populate Dropdown saat halaman dimuat
function populateProductDropdown() {
  productsDB.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = product.name;
    productSelect.appendChild(option);
  });
}

// 5. Toggle antara select dan input manual
function setupToggleButtons() {
  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.mode;
      inputMode = mode;

      // Update active state
      toggleButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      if (mode === "select") {
        // Mode Pilih dari Daftar
        productSelect.style.display = "block";
        productSelect.required = true;
        productSelect.disabled = false;
        customProductInput.style.display = "none";
        customProductInput.required = false;
        customProductInput.disabled = true;
        customProductInput.value = "";
      } else {
        // Mode Input Manual
        productSelect.style.display = "none";
        productSelect.required = false;
        productSelect.disabled = true;
        customProductInput.style.display = "block";
        customProductInput.required = true;
        customProductInput.disabled = false;
        productSelect.value = "";
      }
    });
  });
}

// 6. Fungsi untuk validasi dan submit form
function handleFormSubmit(e) {
  e.preventDefault();

  // Ambil nilai dari form
  const batchNumber = document.getElementById("batchNumber").value.trim();
  const expiryDate = document.getElementById("expiryDate").value;
  const qty = document.getElementById("qty").value;

  // Validasi field wajib
  if (!batchNumber) {
    alert("No. Batch harus diisi!");
    return;
  }
  if (!expiryDate) {
    alert("Tanggal Kedaluarsa harus diisi!");
    return;
  }
  if (!qty || qty < 1) {
    alert("Jumlah Masuk harus diisi minimal 1!");
    return;
  }

  // Ambil nama produk berdasarkan mode input
  let productName;
  if (inputMode === "select") {
    const productId = productSelect.value;
    if (!productId) {
      alert("Silakan pilih obat terlebih dahulu!");
      return;
    }
    const product = productsDB.find((p) => p.id == productId);
    productName = product ? product.name : "";
  } else {
    productName = customProductInput.value.trim();
    if (!productName) {
      alert("Silakan ketik nama obat terlebih dahulu!");
      return;
    }
  }

  // Logika Cek Status Expired
  const today = new Date();
  const expDateObj = new Date(expiryDate);
  const diffTime = expDateObj - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let statusBadge = "";
  if (diffDays < 90) {
    statusBadge = '<span class="badge-warning">Hampir Expired</span>';
  } else {
    statusBadge = '<span class="badge-safe">Aman</span>';
  }

  // Buat Baris Tabel Baru
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>${productName}</td>
    <td style="font-family: monospace;">${batchNumber}</td>
    <td>${expiryDate}</td>
    <td>${qty} Box</td>
    <td>${statusBadge}</td>
  `;

  // Masukkan ke tabel (di paling atas)
  historyTableBody.insertBefore(newRow, historyTableBody.firstChild);

  // Sembunyikan pesan "Belum ada data"
  emptyState.style.display = "none";

  // Reset Form
  inventoryForm.reset();

  // Focus kembali ke input yang aktif
  if (inputMode === "select") {
    productSelect.focus();
  } else {
    customProductInput.focus();
  }

  // Log data (simulasi simpan ke DB)
  console.log("Data tersimpan:", {
    product_name: productName,
    batch_number: batchNumber,
    expired_date: expiryDate,
    qty_current: qty,
    status: diffDays < 90 ? "warning" : "safe",
    days_until_expiry: diffDays,
  });

  // Notifikasi sukses
  alert("✓ Stok berhasil ditambahkan!");
}

// 7. Inisialisasi saat halaman dimuat
function init() {
  populateProductDropdown();
  setupToggleButtons();
  inventoryForm.addEventListener("submit", handleFormSubmit);

  console.log("✓ PHARMAFLOW Input Stok Masuk - Ready");
}

// 8. Jalankan inisialisasi
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
