<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add business profile fields to users table if not exists
        Schema::table('users', function (Blueprint $table) {
            $table->string('business_name')->nullable()->after('name');
            $table->string('business_type')->nullable()->after('business_name');
            $table->string('phone')->nullable()->after('business_type');
            $table->text('address')->nullable()->after('phone');
            $table->decimal('initial_balance', 15, 2)->default(0)->after('address');
        });

        // Transactions table
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->enum('type', ['pemasukan', 'pengeluaran']);
            $table->decimal('amount', 15, 2);
            $table->string('category');
            $table->string('description');
            $table->string('payment_method')->default('Tunai');
            $table->text('notes')->nullable();
            $table->text('receipt_image')->nullable();
            $table->timestamps();
        });

        // Products table (Stok Barang)
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('category');
            $table->integer('stock')->default(0);
            $table->string('unit')->default('Porsi');
            $table->decimal('buy_price', 15, 2)->default(0);
            $table->decimal('sell_price', 15, 2)->default(0);
            $table->integer('min_stock')->default(5);
            $table->timestamps();
        });

        // Stock Movements table
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['masuk', 'keluar', 'penyesuaian']);
            $table->integer('quantity');
            $table->date('date');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // Debts and Receivables (Utang-Piutang)
        Schema::create('debt_receivables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['utang', 'piutang']);
            $table->string('party_name');
            $table->date('transaction_date');
            $table->date('due_date')->nullable();
            $table->decimal('initial_amount', 15, 2);
            $table->decimal('paid_amount', 15, 2)->default(0);
            $table->enum('status', ['belum_lunas', 'sebagian', 'lunas'])->default('belum_lunas');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // Debt Payments
        Schema::create('debt_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('debt_receivable_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->decimal('amount', 15, 2);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('debt_payments');
        Schema::dropIfExists('debt_receivables');
        Schema::dropIfExists('stock_movements');
        Schema::dropIfExists('products');
        Schema::dropIfExists('transactions');
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['business_name', 'business_type', 'phone', 'address', 'initial_balance']);
        });
    }
};

