<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
     /** @use HasFactory<\Database\Factories\UserFactory> */
     use HasFactory, Notifiable;

     /**
      * The attributes that are mass assignable.
      *
      * @var list<string>
      */
     protected $fillable = [
          'name',
          'birthdate',
          'phone',
          'email',
          'password',
     ];

     public function posts()
     {
          return $this->hasMany(Post::class, 'usuario_id');
     }
     // Un usuario puede tener muchos juegos (relación muchos a muchos)
     public function games()
     {
          return $this->belongsToMany(Game::class);
     }

     /**
      * Posts que le gustan a este usuario
      */
     public function likedPosts()
     {
          return $this->belongsToMany(Post::class, 'post_likes', 'user_id', 'post_id')->withTimestamps();
     }

     /**
      * The attributes that should be hidden for serialization.
      *
      * @var list<string>
      */
     protected $hidden = [
          'password',
          'remember_token',
     ];

     /**
      * Get the attributes that should be cast.
      *
      * @return array<string, string>
      */
     protected function casts(): array
     {
          return [
               'email_verified_at' => 'datetime',
               'password' => 'hashed',
          ];
     }
}