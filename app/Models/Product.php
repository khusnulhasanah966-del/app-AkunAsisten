<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'user_id',
        'code',
        'name',
        'category',
        'stock',
        'unit',
        'buy_price',
        'sell_price',
        'min_stock',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function movements()
    {
        return $this->hasMany(StockMovement::class);
    }
}

