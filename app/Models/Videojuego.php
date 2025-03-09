<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Videojuego extends Model
{
    /** @use HasFactory<\Database\Factories\VideojuegoFactory> */
    use HasFactory;

   protected $fillable = [
        'api_id',
        'nombre',
        'imagen',       
        'fecha_lanzamiento',
        'metacritic',
        'datos_json'
    ];    
   

}
