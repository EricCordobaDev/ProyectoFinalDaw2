<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
     protected $table = 'games';
     
     protected $fillable = [
          'idApi',
          'name',
          'released',
          'background_image',
          'rating',         
          'metacritic',
          'platforms',
          'genres',                 
          
     ];
     
     public $timestamps = false;
     
     protected $casts = [
          'platforms' => 'array',
          'genres' => 'array',          
     ];

     /**
      * Los usuarios tienen muchos juegos (relación muchos a muchos)
      */
     public function users()
     {
          return $this->belongsToMany(User::class);
     }

      /**
      * Obtiene todas las reviews que tiene este juego
      */
     public function reviews()
     {
          return $this->hasMany(Review::class);
     }
}
