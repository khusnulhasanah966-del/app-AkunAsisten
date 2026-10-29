<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AppController;

Route::get('/login', [AppController::class, 'showLogin'])->name('login');
Route::post('/login', [AppController::class, 'login'])->name('login.post');
Route::post('/register', [AppController::class, 'register'])->name('register');
Route::post('/logout', [AppController::class, 'logout'])->name('logout');
Route::get('/reset-demo', [AppController::class, 'resetDemo'])->name('reset.demo');

Route::get('/', [AppController::class, 'dashboard'])->name('dashboard');
Route::get('/kasir', [AppController::class, 'cashier'])->name('cashier');
Route::post('/kasir/checkout', [AppController::class, 'checkout'])->name('cashier.checkout');

Route::get('/transaksi', [AppController::class, 'transactions'])->name('transactions');
Route::post('/transaksi', [AppController::class, 'storeTransaction'])->name('transactions.store');
Route::delete('/transaksi/{id}', [AppController::class, 'destroyTransaction'])->name('transactions.destroy');

Route::get('/stok', [AppController::class, 'stock'])->name('stock');
Route::post('/stok', [AppController::class, 'storeProduct'])->name('stock.store');
Route::delete('/stok/{id}', [AppController::class, 'destroyProduct'])->name('stock.destroy');

Route::get('/utang-piutang', [AppController::class, 'debts'])->name('debts');
Route::post('/utang-piutang', [AppController::class, 'storeDebt'])->name('debts.store');
Route::delete('/utang-piutang/{id}', [AppController::class, 'destroyDebt'])->name('debts.destroy');

Route::get('/laporan', [AppController::class, 'reports'])->name('reports');
Route::get('/pelatihan', [AppController::class, 'training'])->name('training');
Route::get('/profil', [AppController::class, 'profile'])->name('profile');
Route::post('/profil', [AppController::class, 'updateProfile'])->name('profile.update');
Route::post('/support-phone', [AppController::class, 'updateSupportPhone'])->name('support.phone.update');
Route::get('/switch-user/{id}', [AppController::class, 'switchUser'])->name('user.switch');
