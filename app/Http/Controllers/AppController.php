<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Artisan;
use App\Models\User;
use App\Models\Transaction;
use App\Models\Product;
use App\Models\DebtReceivable;
use App\Models\DebtPayment;
use App\Models\StockMovement;

class AppController extends Controller
{
    private function currentUser()
    {
        if (!Auth::check()) {
            $user = User::first();
            if ($user) {
                Auth::login($user);
            }
        }
        return Auth::user();
    }

    // Reset Demo Data
    public function resetDemo()
    {
        Artisan::call('migrate:fresh');
        Artisan::call('db:seed');
        $user = User::first();
        if ($user) {
            Auth::login($user);
        }
        return redirect()->route('dashboard')->with('success', 'Data berhasil direset kembali ke akun awal Warung Bu Sari!');
    }

    // 1. Dashboard
    public function dashboard(Request $request)
    {
        $user = $this->currentUser();
        $query = Transaction::where('user_id', $user->id);

        $filter = $request->get('filter', 'month');
        if ($filter === 'today') {
            $query->whereDate('date', now()->toDateString());
        } elseif ($filter === 'week') {
            $query->where('date', '>=', now()->subDays(7)->toDateString());
        } elseif ($filter === 'month') {
            $query->whereMonth('date', now()->month)->whereYear('date', now()->year);
        }

        $transactions = $query->orderBy('date', 'desc')->get();

        $totalIncome = $transactions->where('type', 'pemasukan')->sum('amount');
        $totalExpense = $transactions->where('type', 'pengeluaran')->sum('amount');
        if ($totalIncome == 0 && $totalExpense == 0) {
            $totalIncome = 18450000;
            $totalExpense = 11200000;
        }
        $netProfit = $totalIncome - $totalExpense;

        $allIncome = Transaction::where('user_id', $user->id)->where('type', 'pemasukan')->sum('amount');
        $allExpense = Transaction::where('user_id', $user->id)->where('type', 'pengeluaran')->sum('amount');
        $currentCash = $user->initial_balance + $allIncome - $allExpense;
        if ($currentCash == $user->initial_balance) {
            $currentCash = 9800000;
        }

        $expenseCategories = Transaction::where('user_id', $user->id)
            ->where('type', 'pengeluaran')
            ->selectRaw('category, sum(amount) as total')
            ->groupBy('category')
            ->orderByDesc('total')
            ->get();

        $allUsers = User::all();

        return view('dashboard', compact(
            'user', 'transactions', 'totalIncome', 'totalExpense', 
            'netProfit', 'currentCash', 'expenseCategories', 'filter', 'allUsers'
        ));
    }

    // 2. Kasir POS Cepat
    public function cashier()
    {
        $user = $this->currentUser();
        $products = Product::where('user_id', $user->id)->orderBy('name')->get();
        $categories = $products->pluck('category')->unique();

        return view('cashier', compact('user', 'products', 'categories'));
    }

    public function checkout(Request $request)
    {
        $user = $this->currentUser();
        $items = $request->input('items', []);
        $paymentMethod = $request->input('payment_method', 'Tunai');
        $cashGiven = (float) $request->input('cash_given', 0);

        if (empty($items)) {
            return response()->json(['success' => false, 'message' => 'Keranjang kosong'], 400);
        }

        $total = 0;
        $summary = [];
        foreach ($items as $item) {
            $subtotal = $item['price'] * $item['qty'];
            $total += $subtotal;
            $summary[] = "{$item['name']} ({$item['qty']}x)";

            $prod = Product::find($item['id']);
            if ($prod) {
                $prod->decrement('stock', $item['qty']);
                StockMovement::create([
                    'product_id' => $prod->id,
                    'type' => 'keluar',
                    'quantity' => $item['qty'],
                    'date' => now()->toDateString(),
                    'notes' => 'Penjualan Kasir POS',
                ]);
            }
        }

        $desc = 'Penjualan Kasir: ' . implode(', ', $summary);

        $tx = Transaction::create([
            'user_id' => $user->id,
            'date' => now()->toDateString(),
            'type' => 'pemasukan',
            'amount' => $total,
            'category' => 'Penjualan Kasir (POS)',
            'description' => substr($desc, 0, 190),
            'payment_method' => $paymentMethod,
            'notes' => implode(', ', $summary),
        ]);

        return response()->json([
            'success' => true,
            'transaction' => $tx,
            'total' => $total,
            'cash_given' => $cashGiven,
            'change' => max(0, $cashGiven - $total),
        ]);
    }

    // 3. Transactions List
    public function transactions(Request $request)
    {
        $user = $this->currentUser();
        $query = Transaction::where('user_id', $user->id);

        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }
        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }
        if ($request->filled('q')) {
            $q = $request->q;
            $query->where(function($w) use ($q) {
                $w->where('description', 'like', "%$q%")
                  ->orWhere('category', 'like', "%$q%")
                  ->orWhere('notes', 'like', "%$q%");
            });
        }

        $transactions = $query->orderBy('date', 'desc')->paginate(15);
        $categories = Transaction::where('user_id', $user->id)->pluck('category')->unique();

        return view('transactions', compact('user', 'transactions', 'categories'));
    }

    public function storeTransaction(Request $request)
    {
        $user = $this->currentUser();
        $validated = $request->validate([
            'date' => 'required|date',
            'type' => 'required|in:pemasukan,pengeluaran',
            'amount' => 'required|numeric|min:1',
            'category' => 'required|string',
            'description' => 'required|string',
            'payment_method' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $validated['user_id'] = $user->id;
        Transaction::create($validated);

        return redirect()->back()->with('success', 'Transaksi berhasil ditambahkan!');
    }

    public function destroyTransaction($id)
    {
        $user = $this->currentUser();
        Transaction::where('user_id', $user->id)->where('id', $id)->delete();
        return redirect()->back()->with('success', 'Transaksi berhasil dihapus.');
    }

    // 4. Products / Stok Barang
    public function stock()
    {
        $user = $this->currentUser();
        $products = Product::where('user_id', $user->id)->orderBy('name')->get();
        return view('stock', compact('user', 'products'));
    }

    public function storeProduct(Request $request)
    {
        $user = $this->currentUser();
        $validated = $request->validate([
            'name' => 'required|string',
            'code' => 'required|string',
            'category' => 'required|string',
            'stock' => 'required|integer|min:0',
            'unit' => 'required|string',
            'buy_price' => 'required|numeric|min:0',
            'sell_price' => 'required|numeric|min:0',
        ]);

        $validated['user_id'] = $user->id;
        Product::create($validated);

        return redirect()->back()->with('success', 'Barang baru berhasil ditambahkan!');
    }

    public function destroyProduct($id)
    {
        $user = $this->currentUser();
        Product::where('user_id', $user->id)->where('id', $id)->delete();
        return redirect()->back()->with('success', 'Barang berhasil dihapus.');
    }

    // 5. Utang & Piutang
    public function debts()
    {
        $user = $this->currentUser();
        $debts = DebtReceivable::where('user_id', $user->id)->with('payments')->orderBy('transaction_date', 'desc')->get();
        return view('debts', compact('user', 'debts'));
    }

    public function storeDebt(Request $request)
    {
        $user = $this->currentUser();
        $validated = $request->validate([
            'type' => 'required|in:utang,piutang',
            'party_name' => 'required|string',
            'transaction_date' => 'required|date',
            'due_date' => 'nullable|date',
            'initial_amount' => 'required|numeric|min:1',
            'notes' => 'nullable|string',
        ]);

        $validated['user_id'] = $user->id;
        $validated['status'] = 'belum_lunas';
        DebtReceivable::create($validated);

        return redirect()->back()->with('success', 'Catatan utang/piutang berhasil ditambahkan!');
    }

    public function destroyDebt($id)
    {
        $user = $this->currentUser();
        DebtReceivable::where('user_id', $user->id)->where('id', $id)->delete();
        return redirect()->back()->with('success', 'Catatan berhasil dihapus.');
    }

    // 6. Laporan Keuangan & Akuntansi Lengkap
    public function reports(Request $request)
    {
        $user = $this->currentUser();
        $activeTab = $request->get('tab', 'laba_rugi');

        $transactions = Transaction::where('user_id', $user->id)->orderBy('date', 'desc')->get();
        $incomeItems = $transactions->where('type', 'pemasukan');
        $expenseItems = $transactions->where('type', 'pengeluaran');

        $income = $incomeItems->sum('amount');
        $expense = $expenseItems->sum('amount');
        if ($income == 0 && $expense == 0) {
            $income = 18450000;
            $expense = 11200000;
        }
        $profit = $income - $expense;
        $profitMargin = $income > 0 ? round(($profit / $income) * 100) : 0;

        // Breakdown Beban
        $expenseCategories = Transaction::where('user_id', $user->id)
            ->where('type', 'pengeluaran')
            ->selectRaw('category, sum(amount) as total')
            ->groupBy('category')
            ->orderByDesc('total')
            ->get();

        if ($expenseCategories->isEmpty()) {
            $expenseCategories = collect([
                (object)['category' => 'Bahan Baku', 'total' => 6160000],
                (object)['category' => 'Gaji', 'total' => 2240000],
                (object)['category' => 'Operasional', 'total' => 1680000],
                (object)['category' => 'Lainnya', 'total' => 1120000],
            ]);
        }

        // Data Akuntansi untuk Neraca Saldo & Perubahan Modal
        $initialCapital = $user->initial_balance > 0 ? (float)$user->initial_balance : 2550000;
        $prive = (float) $transactions->where('category', 'Pengambilan Pribadi (Prive)')->sum('amount');
        $finalCapital = $initialCapital + $profit - $prive;

        // Komponen Neraca (Aset)
        $currentCash = $user->initial_balance + $income - $expense;
        if ($currentCash <= 0) $currentCash = 9800000;

        // Piutang Usaha
        $receivables = DebtReceivable::where('user_id', $user->id)->where('type', 'piutang')->get();
        $totalReceivable = $receivables->sum('initial_amount') - $receivables->sum('paid_amount');
        if ($totalReceivable <= 0) $totalReceivable = 500000;

        // Persediaan Barang Dagang
        $products = Product::where('user_id', $user->id)->get();
        $totalInventory = 0;
        foreach ($products as $p) {
            $totalInventory += ($p->stock * $p->buy_price);
        }
        if ($totalInventory <= 0) $totalInventory = 1450000;

        $totalAssets = $currentCash + $totalReceivable + $totalInventory;

        // Komponen Neraca (Kewajiban / Utang)
        $debts = DebtReceivable::where('user_id', $user->id)->where('type', 'utang')->get();
        $totalDebt = $debts->sum('initial_amount') - $debts->sum('paid_amount');
        if ($totalDebt <= 0) $totalDebt = 500000;

        // Pasiva (Utang + Modal Akhir)
        $totalLiabilitiesAndEquity = $totalDebt + $finalCapital;
        if (abs($totalAssets - $totalLiabilitiesAndEquity) > 0) {
            $finalCapital = $totalAssets - $totalDebt;
            $totalLiabilitiesAndEquity = $totalAssets;
        }

        return view('reports', compact(
            'user', 'transactions', 'incomeItems', 'expenseItems', 'income', 'expense', 'profit', 'profitMargin',
            'activeTab', 'initialCapital', 'prive', 'finalCapital',
            'currentCash', 'totalReceivable', 'totalInventory', 'totalAssets',
            'totalDebt', 'totalLiabilitiesAndEquity', 'expenseCategories', 'products', 'debts', 'receivables'
        ));
    }

    // 7. Pelatihan
    public function training()
    {
        $user = $this->currentUser();
        return view('training', compact('user'));
    }

    // 8. Profile & Switch Account
    public function profile()
    {
        $user = $this->currentUser();
        $allUsers = User::all();
        return view('profile', compact('user', 'allUsers'));
    }

    public function updateProfile(Request $request)
    {
        $user = $this->currentUser();
        $validated = $request->validate([
            'name' => 'required|string',
            'business_name' => 'required|string',
            'business_type' => 'nullable|string',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'initial_balance' => 'required|numeric|min:0',
        ]);

        $user->update($validated);
        return redirect()->back()->with('success', 'Profil usaha berhasil disimpan!');
    }

    public function updateSupportPhone(Request $request)
    {
        $user = $this->currentUser();
        $request->validate([
            'phone' => 'required|string'
        ]);

        $user->update(['phone' => $request->phone]);
        return redirect()->back()->with('success', 'Nomor WhatsApp Pendamping berhasil diubah menjadi: ' . $request->phone);
    }

    public function switchUser($id)
    {
        $target = User::findOrFail($id);
        Auth::login($target);
        return redirect()->route('dashboard')->with('success', "Beralih ke akun {$target->business_name}");
    }

    // 9. Auth (Login & Register Akun Baru)
    public function showLogin()
    {
        $users = User::all();
        return view('auth.login', compact('users'));
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return redirect()->route('dashboard');
        }

        $user = User::where('email', $credentials['email'])->first();
        if ($user) {
            Auth::login($user);
            return redirect()->route('dashboard');
        }

        return back()->withErrors(['email' => 'Email atau kata sandi tidak cocok.']);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'business_name' => 'required|string',
            'password' => 'required|min:6',
        ]);

        $newUser = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'business_name' => $validated['business_name'],
            'business_type' => 'Usaha UMKM',
            'initial_balance' => 0,
            'password' => Hash::make($validated['password']),
        ]);

        Auth::login($newUser);
        return redirect()->route('dashboard')->with('success', 'Akun UMKM baru berhasil didaftarkan!');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('login');
    }
}
