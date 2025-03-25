<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    /** @use HasFactory<\Database\Factories\ReviewFactory> */
    use HasFactory;

     protected $fillable = [
          'content',
          'user_id',
          'post_id',        
          
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
      public function post()
      {
           return $this->belongsTo(Post::class);
      }
}
