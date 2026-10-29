import { Transaction, Product, StockMovement, DebtReceivable, TrainingMaterial, UserProfile } from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr_demo_1',
  name: 'Bu Sari',
  email: 'busari.warung@gmail.com',
  businessName: 'Warung Makan Bu Sari',
  businessType: 'Kuliner & Rumah Makan',
  phone: '081234567890',
  address: 'Jl. Melati No. 14, Sukajadi, Bandung',
  initialBalance: 2550000,
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'trx-1',
    userId: 'usr_demo_1',
    date: '2026-09-28',
    type: 'pemasukan',
    amount: 1250000,
    category: 'Penjualan',
    description: 'Penjualan harian',
    paymentMethod: 'Tunai',
    notes: 'Omzet warung hari ini (makan siang & katering)',
    createdAt: '2026-09-28T18:00:00Z',
    updatedAt: '2026-09-28T18:00:00Z',
  },
  {
    id: 'trx-2',
    userId: 'usr_demo_1',
    date: '2026-09-27',
    type: 'pengeluaran',
    amount: 450000,
    category: 'Bahan Baku',
    description: 'Beli ayam & sayur',
    paymentMethod: 'Tunai',
    notes: 'Pasar induk pagi: 15kg ayam potong, sayuran segar',
    createdAt: '2026-09-27T08:30:00Z',
    updatedAt: '2026-09-27T08:30:00Z',
  },
  {
    id: 'trx-3',
    userId: 'usr_demo_1',
    date: '2026-09-26',
    type: 'pengeluaran',
    amount: 320000,
    category: 'Operasional',
    description: 'Pembayaran listrik',
    paymentMethod: 'Transfer Bank',
    notes: 'Tagihan PLN pascabayar bulan September',
    createdAt: '2026-09-26T11:00:00Z',
    updatedAt: '2026-09-26T11:00:00Z',
  },
  {
    id: 'trx-4',
    userId: 'usr_demo_1',
    date: '2026-09-25',
    type: 'pemasukan',
    amount: 2100000,
    category: 'Penjualan',
    description: 'Pesanan prasmanan kantor',
    paymentMethod: 'Transfer Bank',
    notes: 'Paket nasi box 70 porsi kantor BPN',
    createdAt: '2026-09-25T14:30:00Z',
    updatedAt: '2026-09-25T14:30:00Z',
  },
  {
    id: 'trx-5',
    userId: 'usr_demo_1',
    date: '2026-09-24',
    type: 'pengeluaran',
    amount: 2240000,
    category: 'Gaji',
    description: 'Gaji 2 karyawan paruh waktu',
    paymentMethod: 'Tunai',
    notes: 'Gaji mingguan staff dapur & kasir',
    createdAt: '2026-09-24T17:00:00Z',
    updatedAt: '2026-09-24T17:00:00Z',
  },
  {
    id: 'trx-6',
    userId: 'usr_demo_1',
    date: '2026-09-21',
    type: 'pemasukan',
    amount: 2000000,
    category: 'Penjualan',
    description: 'Omzet akhir pekan',
    paymentMethod: 'QRIS',
    notes: 'Pengunjung ramai hari libur',
    createdAt: '2026-09-21T20:00:00Z',
    updatedAt: '2026-09-21T20:00:00Z',
  },
  {
    id: 'trx-7',
    userId: 'usr_demo_1',
    date: '2026-09-18',
    type: 'pengeluaran',
    amount: 1120000,
    category: 'Lainnya',
    description: 'Perawatan kompor & tabung gas',
    paymentMethod: 'Tunai',
    notes: 'Servis blower exhaust & 4 tabung elpiji 12kg',
    createdAt: '2026-09-18T10:00:00Z',
    updatedAt: '2026-09-18T10:00:00Z',
  },
  {
    id: 'trx-8',
    userId: 'usr_demo_1',
    date: '2026-09-14',
    type: 'pengeluaran',
    amount: 5710000,
    category: 'Bahan Baku',
    description: 'Kulakan beras, minyak & bumbu kering',
    paymentMethod: 'Transfer Bank',
    notes: 'Stok bahan sembako bulanan dari agen grosir',
    createdAt: '2026-09-14T09:00:00Z',
    updatedAt: '2026-09-14T09:00:00Z',
  },
  {
    id: 'trx-9',
    userId: 'usr_demo_1',
    date: '2026-09-11',
    type: 'pemasukan',
    amount: 4800000,
    category: 'Penjualan',
    description: 'Penjualan paket makan siang minggu ke-2',
    paymentMethod: 'Tunai',
    notes: 'Akumulasi penjualan harian warung',
    createdAt: '2026-09-11T19:00:00Z',
    updatedAt: '2026-09-11T19:00:00Z',
  },
  {
    id: 'trx-10',
    userId: 'usr_demo_1',
    date: '2026-09-05',
    type: 'pemasukan',
    amount: 4200000,
    category: 'Penjualan',
    description: 'Penjualan minggu ke-1 September',
    paymentMethod: 'QRIS',
    notes: 'Pemasukan pelanggan dine-in dan take away',
    createdAt: '2026-09-05T19:00:00Z',
    updatedAt: '2026-09-05T19:00:00Z',
  },
  {
    id: 'trx-11',
    userId: 'usr_demo_1',
    date: '2026-09-04',
    type: 'pengeluaran',
    amount: 1360000,
    category: 'Operasional',
    description: 'Kemasan box makanan & sendok plastik',
    paymentMethod: 'Tunai',
    notes: 'Pembelian 10 karton dus takeaway & sablon merk',
    createdAt: '2026-09-04T13:00:00Z',
    updatedAt: '2026-09-04T13:00:00Z',
  },
  {
    id: 'trx-12',
    userId: 'usr_demo_1',
    date: '2026-09-30',
    type: 'pemasukan',
    amount: 4100000,
    category: 'Penjualan',
    description: 'Omzet akhir bulan September',
    paymentMethod: 'QRIS',
    notes: 'Penjualan tumpeng ulang tahun & katering arisan',
    createdAt: '2026-09-30T17:00:00Z',
    updatedAt: '2026-09-30T17:00:00Z',
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    userId: 'usr_demo_1',
    code: 'BRG-001',
    name: 'Beras Rojolele Super 25kg',
    category: 'Bahan Pokok',
    stock: 8,
    unit: 'Karung',
    buyPrice: 325000,
    sellPrice: 350000,
    minStock: 5,
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-09-20T10:00:00Z',
  },
  {
    id: 'prod-2',
    userId: 'usr_demo_1',
    code: 'BRG-002',
    name: 'Minyak Goreng Sania 2L',
    category: 'Bahan Pokok',
    stock: 4,
    unit: 'Pouch',
    buyPrice: 34000,
    sellPrice: 38000,
    minStock: 10, // Menipis
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-09-25T14:00:00Z',
  },
  {
    id: 'prod-3',
    userId: 'usr_demo_1',
    code: 'BRG-003',
    name: 'Daging Ayam Broiler Segar',
    category: 'Daging & Unggas',
    stock: 22,
    unit: 'Kg',
    buyPrice: 32000,
    sellPrice: 37000,
    minStock: 10,
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-09-27T08:00:00Z',
  },
  {
    id: 'prod-4',
    userId: 'usr_demo_1',
    code: 'BRG-004',
    name: 'Telur Ayam Negeri',
    category: 'Bahan Pokok',
    stock: 2,
    unit: 'Peti (15kg)',
    buyPrice: 380000,
    sellPrice: 410000,
    minStock: 3, // Menipis
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-09-26T09:00:00Z',
  },
  {
    id: 'prod-5',
    userId: 'usr_demo_1',
    code: 'BRG-005',
    name: 'Kemasan Box Ramah Lingkungan L',
    category: 'Perlengkapan',
    stock: 450,
    unit: 'Pcs',
    buyPrice: 1200,
    sellPrice: 1500,
    minStock: 200,
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-09-20T11:00:00Z',
  },
  {
    id: 'prod-6',
    userId: 'usr_demo_1',
    code: 'BRG-006',
    name: 'Gas Elpiji 12 Kg (Isi Ulang)',
    category: 'Operasional Gas',
    stock: 6,
    unit: 'Tabung',
    buyPrice: 215000,
    sellPrice: 225000,
    minStock: 3,
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-09-22T15:00:00Z',
  }
];

export const INITIAL_STOCK_MOVEMENTS: StockMovement[] = [
  {
    id: 'sm-1',
    productId: 'prod-2',
    type: 'keluar',
    quantity: 6,
    date: '2026-09-28',
    notes: 'Pemakaian penggorengan dapur harian',
    createdAt: '2026-09-28T10:00:00Z',
  },
  {
    id: 'sm-2',
    productId: 'prod-3',
    type: 'masuk',
    quantity: 15,
    date: '2026-09-27',
    notes: 'Restock supplier Pak Haji Ujang',
    createdAt: '2026-09-27T08:30:00Z',
  },
  {
    id: 'sm-3',
    productId: 'prod-4',
    type: 'keluar',
    quantity: 1,
    date: '2026-09-26',
    notes: 'Bahan pembuatan rendang & telur balado',
    createdAt: '2026-09-26T09:00:00Z',
  },
  {
    id: 'sm-4',
    productId: 'prod-1',
    type: 'masuk',
    quantity: 10,
    date: '2026-09-14',
    notes: 'Pengiriman beras dari distributor Subang',
    createdAt: '2026-09-14T09:00:00Z',
  }
];

export const INITIAL_DEBTS_RECEIVABLES: DebtReceivable[] = [
  {
    id: 'dr-1',
    userId: 'usr_demo_1',
    type: 'utang',
    partyName: 'Toko Agen Beras Barokah',
    transactionDate: '2026-09-14',
    dueDate: '2026-10-14',
    initialAmount: 3250000,
    paidAmount: 1500000,
    status: 'sebagian',
    notes: 'Pembelian 10 karung beras termin 30 hari',
    payments: [
      {
        id: 'pmt-1',
        date: '2026-09-24',
        amount: 1500000,
        notes: 'DP termin pertama via transfer BCA',
        createdAt: '2026-09-24T10:00:00Z',
      }
    ],
    createdAt: '2026-09-14T09:00:00Z',
    updatedAt: '2026-09-24T10:00:00Z',
  },
  {
    id: 'dr-2',
    userId: 'usr_demo_1',
    type: 'utang',
    partyName: 'Supplier Daging Pak Bambang',
    transactionDate: '2026-09-26',
    dueDate: '2026-10-03',
    initialAmount: 850000,
    paidAmount: 0,
    status: 'belum_lunas',
    notes: 'Ayam potong & sapi untuk order katering',
    payments: [],
    createdAt: '2026-09-26T11:00:00Z',
    updatedAt: '2026-09-26T11:00:00Z',
  },
  {
    id: 'dr-3',
    userId: 'usr_demo_1',
    type: 'piutang',
    partyName: 'Kantor BPN (Ibu Rini)',
    transactionDate: '2026-09-25',
    dueDate: '2026-10-05',
    initialAmount: 2100000,
    paidAmount: 1000000,
    status: 'sebagian',
    notes: 'Pesanan nasi tumpeng box rapat koordinasi',
    payments: [
      {
        id: 'pmt-2',
        date: '2026-09-25',
        amount: 1000000,
        notes: 'Uang muka (DP 50%)',
        createdAt: '2026-09-25T14:30:00Z',
      }
    ],
    createdAt: '2026-09-25T14:30:00Z',
    updatedAt: '2026-09-25T14:30:00Z',
  },
  {
    id: 'dr-4',
    userId: 'usr_demo_1',
    type: 'piutang',
    partyName: 'Komunitas Senam Ceria Bu Endang',
    transactionDate: '2026-09-20',
    dueDate: '2026-09-27',
    initialAmount: 650000,
    paidAmount: 650000,
    status: 'lunas',
    notes: 'Snack box 35 porsi senam pagi',
    payments: [
      {
        id: 'pmt-3',
        date: '2026-09-27',
        amount: 650000,
        notes: 'Pelunasan tunai setelah kegiatan',
        createdAt: '2026-09-27T16:00:00Z',
      }
    ],
    createdAt: '2026-09-20T10:00:00Z',
    updatedAt: '2026-09-27T16:00:00Z',
  }
];

export const INITIAL_TRAINING_MATERIALS: TrainingMaterial[] = [
  {
    id: 'trn-1',
    title: 'Dasar-dasar Pencatatan Keuangan UMKM',
    description: 'Pahami pentingnya mencatat setiap rupiah yang keluar-masuk agar usaha tidak bocor dan terus berkembang.',
    category: 'Fondasi Pembukuan',
    duration: '6 menit',
    completed: true,
    iconName: 'BookOpen',
    content: `
### Mengapa UMKM Harus Mencatat Keuangan?
Banyak pelaku usaha merasa dagangannya selalu ramai, namun di akhir bulan uang kas justru habis tanpa tahu kemana perginya. Ini sering disebut fenomena **kebocoran halus**.

#### 3 Prinsip Utama Pembukuan UMKM:
1. **Disiplin Setiap Hari**: Catat transaksi sekecil apapun begitu terjadi, jangan menumpuk sampai akhir pekan.
2. **Pisahkan Dompet**: Jangan mencampur uang belanja rumah tangga dengan kas warung.
3. **Simpan Bukti Transaksi**: Simpan nota belanja, foto bukti transfer, struk pembelian bahan baku.
    `
  },
  {
    id: 'trn-2',
    title: 'Cara Mencatat Pemasukan dan Pengeluaran',
    description: 'Panduan praktis menggolongkan uang masuk dari penjualan vs pengeluaran operasional dan bahan baku.',
    category: 'Transaksi',
    duration: '8 menit',
    completed: true,
    iconName: 'Receipt',
    content: `
### Klasifikasi Transaksi yang Tepat
Agar laporan keuangan Anda akurat, kenali jenis pos transaksi:

#### 1. Pemasukan (Inflow)
- **Penjualan Harian**: Penjualan barang dagangan langsung ke konsumen.
- **Pendapatan Jasa**: Ongkos kirim pesanan, jasa katering.
- **Pemasukan Lain**: Penjualan kardus bekas, bunga bank, komisi titipan barang.

#### 2. Pengeluaran (Outflow)
- **Bahan Baku**: Beras, minyak, ayam, bumbu masak (langsung berhubungan dengan barang dagang).
- **Operasional**: Listrik, gas elpiji, air, kantong kresek, kemasan box.
- **Beban Gaji**: Upah harian atau bulanan karyawan yang membantu.
    `
  },
  {
    id: 'trn-3',
    title: 'Cara Menghitung Laba Bersih yang Tepat',
    description: 'Pelajari rumus sederhana laba kotor, beban operasional, dan menghitung keuntungan bersih riil bisnis Anda.',
    category: 'Analisis Finansial',
    duration: '7 menit',
    completed: false,
    iconName: 'TrendingUp',
    content: `
### Rumus Sederhana Laba Bersih
Laba Bersih bukanlah sekadar uang yang ada di laci kas saat warung tutup!

$$\\text{Laba Bersih} = \\text{Total Pemasukan} - \\text{Total Beban Operasional} - \\text{Biaya Bahan Baku}$$

#### Ilustrasi Warung Makan Bu Sari:
- Total Omzet September: **Rp 18.450.000**
- Total Belanja Bahan & Beban: **Rp 11.200.000**
- Maka **Laba Bersih September** = **Rp 7.250.000** (Margin Keuntungan 39%)
    `
  },
  {
    id: 'trn-4',
    title: 'Cara Mengelola Stok Barang & Mencegah Kadaluarsa',
    description: 'Strategi FIFO (First In First Out), menetapkan stok minimum (buffer), dan opname rutin.',
    category: 'Manajemen Persediaan',
    duration: '10 menit',
    completed: false,
    iconName: 'Package',
    content: `
### Mengatur Persediaan Tanpa Buntung
Stok barang yang menumpuk sama dengan "uang yang membeku di gudang".

#### Tips Mengelola Stok Warung & Toko:
1. **Terapkan Sistem FIFO (First In, First Out)**: Barang yang dibeli lebih dulu harus digunakan atau dijual lebih awal agar tidak basi atau kadaluarsa.
2. **Tentukan Batas Minimum (Safety Stock)**: Tetapkan alarm peringatan ketika minyak goreng tersisa di bawah 10 pcs agar tidak kehabisan saat pelanggan sedang ramai.
3. **Lakukan Stock Opname Mingguan**: Cocokkan catatan stok di aplikasi AkunAsisten dengan jumlah fisik di rak dapur.
    `
  },
  {
    id: 'trn-5',
    title: 'Cara Mengelola Utang dan Piutang agar Arus Kas Lancar',
    description: 'Hindari macet modal karena bon pelanggan yang belum tertagih atau denda keterlambatan supplier.',
    category: 'Arus Kas & Piutang',
    duration: '9 menit',
    completed: false,
    iconName: 'Scale',
    content: `
### Utang vs Piutang: Jangan Terbalik!
- **Utang**: Kewajiban uang yang harus KITA bayarkan kepada pemasok / distributor bahan.
- **Piutang**: Uang KITA yang masih dibawa oleh pelanggan (bon belanja).

#### 3 Aturan Emas Arus Kas:
1. Batasi waktu jatuh tempo piutang pelanggan (maksimal 7–14 hari).
2. Kirim pengingat ramah 2 hari sebelum jatuh tempo dengan rangkuman invoice.
3. Selalu prioritaskan melunasi utang supplier tepat waktu untuk menjaga reputasi dan kemudahan mendapatkan tempo kembali.
    `
  },
  {
    id: 'trn-6',
    title: 'Cara Membaca Laporan Laba Rugi & Arus Kas',
    description: 'Jangan takut dengan istilah akuntansi! Pahami arti angka-angka penting untuk mengambil keputusan bisnis.',
    category: 'Laporan Keuangan',
    duration: '8 menit',
    completed: false,
    iconName: 'FileText',
    content: `
### Membaca Laporan Tanpa Pusing
Sebagai pemilik UMKM, Anda hanya perlu fokus pada 3 indikator utama:
1. **Pendapatan Bersih**: Apakah trennya naik dibanding bulan lalu?
2. **Persentase Pengeluaran Terbesar**: Dari grafik AkunAsisten, cek apakah biaya bahan baku melebihi 60% dari omzet.
3. **Posisi Kas Riil**: Pastikan saldo kas fisik selalu mencukupi untuk operasional minggu depan.
    `
  },
  {
    id: 'trn-7',
    title: 'Tips Memisahkan Uang Pribadi dan Uang Usaha',
    description: 'Kesalahan paling fatal pemilik UMKM: mengambil uang kasir untuk belanja pribadi tanpa pencatatan gaji resmi.',
    category: 'Kebiasaan Finansial',
    duration: '5 menit',
    completed: false,
    iconName: 'Coins',
    content: `
### Amankan Kas Usaha Anda!
Penyebab utama usaha bangkrut padahal ramai pembeli adalah tercampurnya uang pribadi dan uang warung.

#### Langkah Praktis:
- Buat rekening bank khusus usaha (terpisah dari rekening keluarga).
- Tetapkan "Gaji Pemilik": Berikan gaji tetap bulanan atau mingguan untuk diri Anda sendiri dari keuntungan usaha, bukan mengambil uang harian dari laci kasir semaunya!
- Jika terpaksa mengambil uang kasir untuk keperluan darurat keluarga, catat sebagai penarikan modal (Prive) di aplikasi.
    `
  }
];

