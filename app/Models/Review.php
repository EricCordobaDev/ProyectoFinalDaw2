<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    /** @use HasFactory<\Database\Factories\ReviewFactory> */
    use HasFactory;

     protected $fillable = [
          'user_id',
          'game_id',
          'rating',
          'comment',
     ];

     /**
      * Obtiene el usuario que creó esta review
      */
      public function user()
      {
           return $this->belongsTo(User::class);
      }
 
      /**
       * Obtiene el juego al que pertenece esta review
       */
      public function game()
      {
           return $this->belongsTo(Game::class);
      }
}
