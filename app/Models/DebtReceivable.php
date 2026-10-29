<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DebtReceivable extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'party_name',
        'transaction_date',
        'due_date',
        'initial_amount',
        'paid_amount',
        'status',
        'notes',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function payments()
    {
        return $this->hasMany(DebtPayment::class);
    }
}

