<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DebtPayment extends Model
{
    protected $fillable = [
        'debt_receivable_id',
        'date',
        'amount',
        'notes',
    ];

    public function debtReceivable()
    {
        return $this->belongsTo(DebtReceivable::class);
    }
}

