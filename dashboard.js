// 1. Tampilkan Tanggal Hari Ini
const dateElement = document.getElementById("currentDate");
const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
dateElement.textContent = new Date().toLocaleDateString("id-ID", options);

// 2. Konfigurasi Grafik Penjualan (Menggunakan Chart.js)
const ctx = document.getElementById("salesChart").getContext("2d");

const salesChart = new Chart(ctx, {
  type: "line", // Jenis grafik: Garis
  data: {
    labels: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"], // Sumbu X
    datasets: [
      {
        label: "Pendapatan (Rp)",
        data: [1500000, 2100000, 1800000, 2500000, 2300000, 3100000, 2800000], // Data Dummy
        borderColor: "#2563eb", // Warna Garis Biru
        backgroundColor: "rgba(37, 99, 235, 0.1)", // Warna area bawah garis (transparan)
        tension: 0.4, // Kelengkungan garis (biar smooth)
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#2563eb",
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // Sembunyikan legenda biar bersih
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { borderDash: [5, 5] }, // Garis putus-putus di background
      },
      x: {
        grid: { display: false }, // Hilangkan garis vertikal
      },
    },
  },
});

// 3. Populate Tabel "Early Warning System" (Simulasi Data FEFO)
// Ini biasanya hasil query SQL: SELECT * FROM batches WHERE expired_date < NOW() + 90 DAYS
const warningData = [
  { name: "Amoxicillin Sirup", daysLeft: 12, stock: "5 Botol", risk: "high" },
  { name: "Betadine 30ml", daysLeft: 45, stock: "10 Botol", risk: "medium" },
  { name: "Captopril 25mg", daysLeft: 60, stock: "2 Box", risk: "medium" },
  { name: "Insulin Pen", daysLeft: 5, stock: "2 Pcs", risk: "high" },
  { name: "Vitamin C Strip", daysLeft: 88, stock: "50 Strip", risk: "low" },
];

const warningTableBody = document.getElementById("warningTableBody");

warningData.forEach((item) => {
  // Tentukan warna teks berdasarkan risiko
  let colorClass = "text-gray-600";
  if (item.risk === "high")
    colorClass = "color: #dc2626; font-weight:bold;"; // Merah
  else if (item.risk === "medium") colorClass = "color: #d97706;"; // Oranye

  const row = document.createElement("tr");
  row.innerHTML = `
        <td style="font-weight: 500;">${item.name}</td>
        <td style="${colorClass}">${item.daysLeft} Hari</td>
        <td>${item.stock}</td>
    `;
  warningTableBody.appendChild(row);
});
