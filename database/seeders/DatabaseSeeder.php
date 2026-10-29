<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Transaction;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\DebtReceivable;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Akun Awal Bu Sari
        $buSari = User::updateOrCreate(
            ['email' => 'busari.warung@gmail.com'],
            [
                'name' => 'Bu Sari',
                'password' => Hash::make('password123'),
                'business_name' => 'Warung Makan Bu Sari',
                'business_type' => 'Kuliner & Rumah Makan',
                'phone' => '081234567890',
                'address' => 'Jl. Melati No. 14, Sukajadi, Bandung',
                'initial_balance' => 2550000,
            ]
        );

        // 2. Data Transaksi Awal
        $transactions = [
            [
                'user_id' => $buSari->id,
                'date' => '2026-09-28',
                'type' => 'pemasukan',
                'amount' => 1250000,
                'category' => 'Penjualan',
                'description' => 'Penjualan harian',
                'payment_method' => 'Tunai',
                'notes' => 'Omzet warung hari ini (makan siang & katering)',
            ],
            [
                'user_id' => $buSari->id,
                'date' => '2026-09-27',
                'type' => 'pengeluaran',
                'amount' => 450000,
                'category' => 'Bahan Baku',
                'description' => 'Beli ayam & sayur',
                'payment_method' => 'Tunai',
                'notes' => 'Pasar induk pagi: 15kg ayam potong, sayuran segar',
            ],
            [
                'user_id' => $buSari->id,
                'date' => '2026-09-26',
                'type' => 'pengeluaran',
                'amount' => 320000,
                'category' => 'Operasional',
                'description' => 'Pembayaran listrik',
                'payment_method' => 'Transfer Bank',
                'notes' => 'Tagihan PLN pascabayar bulan September',
            ],
            [
                'user_id' => $buSari->id,
                'date' => '2026-09-25',
                'type' => 'pemasukan',
                'amount' => 2100000,
                'category' => 'Penjualan',
                'description' => 'Pesanan katering arisan Bu RT',
                'payment_method' => 'Transfer Bank',
                'notes' => 'Paket nasi kotak 60 porsi ayam bakar',
            ],
            [
                'user_id' => $buSari->id,
                'date' => '2026-09-24',
                'type' => 'pengeluaran',
                'amount' => 280000,
                'category' => 'Bahan Baku',
                'description' => 'Beli beras 2 karung',
                'payment_method' => 'Tunai',
                'notes' => 'Beras pandan wangi @ 25kg di Toko Sembako Barokah',
            ],
            [
                'user_id' => $buSari->id,
                'date' => '2026-09-22',
                'type' => 'pengeluaran',
                'amount' => 150000,
                'category' => 'Gas & Bahan Bakar',
                'description' => 'Isi ulang gas LPG 3kg',
                'payment_method' => 'Tunai',
                'notes' => '6 tabung melon @ Rp 25.000',
            ],
            [
                'user_id' => $buSari->id,
                'date' => '2026-09-20',
                'type' => 'pemasukan',
                'amount' => 980000,
                'category' => 'Penjualan',
                'description' => 'Penjualan makan siang',
                'payment_method' => 'Tunai',
                'notes' => 'Ramai pegawai kantor sekitar',
            ],
        ];

        foreach ($transactions as $t) {
            Transaction::create($t);
        }

        // 3. Produk & Menu Kasir
        $products = [
            [
                'user_id' => $buSari->id,
                'code' => 'BRG-001',
                'name' => 'Paket Nasi Ayam Bakar Madu',
                'category' => 'Makanan Utama',
                'stock' => 45,
                'unit' => 'Porsi',
                'buy_price' => 14000,
                'sell_price' => 25000,
                'min_stock' => 10,
            ],
            [
                'user_id' => $buSari->id,
                'code' => 'BRG-002',
                'name' => 'Nasi Goreng Spesial Telur',
                'category' => 'Makanan Utama',
                'stock' => 60,
                'unit' => 'Porsi',
                'buy_price' => 9000,
                'sell_price' => 18000,
                'min_stock' => 10,
            ],
            [
                'user_id' => $buSari->id,
                'code' => 'BRG-003',
                'name' => 'Ayam Goreng Lengkuas',
                'category' => 'Lauk Pauk',
                'stock' => 30,
                'unit' => 'Potong',
                'buy_price' => 10000,
                'sell_price' => 17000,
                'min_stock' => 8,
            ],
            [
                'user_id' => $buSari->id,
                'code' => 'BRG-004',
                'name' => 'Es Teh Manis Jumbo',
                'category' => 'Minuman',
                'stock' => 120,
                'unit' => 'Gelas',
                'buy_price' => 1500,
                'sell_price' => 5000,
                'min_stock' => 20,
            ],
            [
                'user_id' => $buSari->id,
                'code' => 'BRG-005',
                'name' => 'Jus Alpukat Kocok',
                'category' => 'Minuman',
                'stock' => 25,
                'unit' => 'Gelas',
                'buy_price' => 6000,
                'sell_price' => 12000,
                'min_stock' => 5,
            ],
            [
                'user_id' => $buSari->id,
                'code' => 'BRG-006',
                'name' => 'Kerupuk Kaleng Putih',
                'category' => 'Pelengkap',
                'stock' => 80,
                'unit' => 'Biji',
                'buy_price' => 800,
                'sell_price' => 2000,
                'min_stock' => 15,
            ],
        ];

        foreach ($products as $p) {
            Product::create($p);
        }

        // 4. Utang & Piutang Awal
        DebtReceivable::create([
            'user_id' => $buSari->id,
            'type' => 'piutang',
            'party_name' => 'Kantor Kelurahan (Pak Lurah)',
            'transaction_date' => '2026-09-20',
            'due_date' => '2026-10-05',
            'initial_amount' => 750000,
            'paid_amount' => 250000,
            'status' => 'sebagian',
            'notes' => 'Katering rapat koordinasi bulanan',
        ]);

        DebtReceivable::create([
            'user_id' => $buSari->id,
            'type' => 'utang',
            'party_name' => 'Agen Telur & Sembako Bu Hj. Ani',
            'transaction_date' => '2026-09-22',
            'due_date' => '2026-10-02',
            'initial_amount' => 500000,
            'paid_amount' => 0,
            'status' => 'belum_lunas',
            'notes' => 'Pengambilan telur ayam 2 peti bayar tempo',
        ]);
    }
}
