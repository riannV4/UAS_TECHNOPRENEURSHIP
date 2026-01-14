// 1. Data Dummy Inventaris
const inventoryData = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    category: "Tablet",
    buyPrice: 3000,
    sellPrice: 5000,
    stock: 120,
    unit: "Strip",
  },
  {
    id: 2,
    name: "Amoxicillin 500mg",
    category: "Tablet",
    buyPrice: 6000,
    sellPrice: 8500,
    stock: 45,
    unit: "Strip",
  },
  {
    id: 3,
    name: "OBH Combi Anak",
    category: "Sirup",
    buyPrice: 12000,
    sellPrice: 15000,
    stock: 8,
    unit: "Botol",
  },
  {
    id: 4,
    name: "Betadine 30ml",
    category: "Salep",
    buyPrice: 20000,
    sellPrice: 25000,
    stock: 5,
    unit: "Botol",
  },
  {
    id: 5,
    name: "Vitamin C IPI",
    category: "Tablet",
    buyPrice: 4000,
    sellPrice: 7000,
    stock: 200,
    unit: "Botol",
  },
  {
    id: 6,
    name: "Insulin Pen",
    category: "Alat",
    buyPrice: 150000,
    sellPrice: 180000,
    stock: 2,
    unit: "Pcs",
  },
  {
    id: 7,
    name: "Masker Medis",
    category: "Alat",
    buyPrice: 25000,
    sellPrice: 35000,
    stock: 0,
    unit: "Box",
  },
  {
    id: 8,
    name: "Sanmol Sirup",
    category: "Sirup",
    buyPrice: 14000,
    sellPrice: 18000,
    stock: 15,
    unit: "Botol",
  },
];

const tableBody = document.getElementById("reportTableBody");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const stockFilter = document.getElementById("stockFilter");
const emptyState = document.getElementById("emptyState");

// Format Rupiah
const formatRupiah = (num) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);

// 2. Fungsi Render Tabel
function renderTable(data) {
  tableBody.innerHTML = "";

  // Reset Counters
  let totalItems = 0;
  let totalAsset = 0;
  let lowStock = 0;

  if (data.length === 0) {
    emptyState.style.display = "block";
    return;
  } else {
    emptyState.style.display = "none";
  }

  data.forEach((item) => {
    // Hitung Statistik
    totalItems++;
    totalAsset += item.buyPrice * item.stock;
    if (item.stock < 10) lowStock++;

    // Tentukan Status Badge
    let badgeClass = "status-safe";
    let badgeText = "Aman";

    if (item.stock === 0) {
      badgeClass = "status-danger";
      badgeText = "Stok Habis";
    } else if (item.stock < 10) {
      badgeClass = "status-warning";
      badgeText = "Menipis";
    }

    const row = document.createElement("tr");
    row.innerHTML = `
            <td style="font-weight: 500;">${item.name}</td>
            <td>${item.category}</td>
            <td>${formatRupiah(item.buyPrice)}</td>
            <td>${formatRupiah(item.sellPrice)}</td>
            <td style="font-weight: bold;">${item.stock} ${item.unit}</td>
            <td>${formatRupiah(item.stock * item.buyPrice)}</td>
            <td><span class="status-badge ${badgeClass}">${badgeText}</span></td>
        `;
    tableBody.appendChild(row);
  });

  // Update Kartu Ringkasan di Atas
  document.getElementById("totalItems").innerText = totalItems + " SKU";
  document.getElementById("totalAssetValue").innerText =
    formatRupiah(totalAsset);
  document.getElementById("lowStockCount").innerText = lowStock + " Item";
}

// 3. Fungsi Filter
function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase();
  const catValue = categoryFilter.value;
  const stockValue = stockFilter.value;

  const filteredData = inventoryData.filter((item) => {
    // 1. Filter Nama
    const matchName = item.name.toLowerCase().includes(searchTerm);

    // 2. Filter Kategori
    const matchCat = catValue === "all" || item.category === catValue;

    // 3. Filter Status Stok
    let matchStock = true;
    if (stockValue === "aman") matchStock = item.stock >= 10;
    if (stockValue === "menipis")
      matchStock = item.stock > 0 && item.stock < 10;
    if (stockValue === "kosong") matchStock = item.stock === 0;

    return matchName && matchCat && matchStock;
  });

  renderTable(filteredData);
}

// Event Listeners
searchInput.addEventListener("input", applyFilters);

// Jalankan Awal
renderTable(inventoryData);
