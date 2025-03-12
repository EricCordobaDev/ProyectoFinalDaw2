<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
     protected $table = 'games';
     
     protected $fillable = [
          'id',
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
}
