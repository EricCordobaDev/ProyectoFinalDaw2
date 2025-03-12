<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    /** @use HasFactory<\Database\Factories\PostFactory> */
    use HasFactory;


    protected $fillable = [
     'usuario_id',
     'likes',
     'contenido',
     'imagen',
     'post_date',
 ];

 protected $casts = [
     'post_date' => 'datetime',
 ];

 public function user()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}
