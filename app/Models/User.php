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
          'image',
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
      * Obtiene todas las reviews creadas por este usuario
      */
      public function reviews()
      {
           return $this->hasMany(Review::class);
      }

     /**
      * Posts que le gustan a este usuario
      */
     public function likedPosts()
     {
          return $this->belongsToMany(Post::class, 'post_likes', 'user_id', 'post_id')->withTimestamps();
     }

     /**
      * Obtiene todos los usuarios que siguen a este usuario
      */
     public function followers()
     {
          return $this->hasMany(Follower::class, 'followed_id');
     }

     /**
      * Obtiene todos los usuarios a los que este usuario sigue
      */
     public function following()
     {
          return $this->hasMany(Follower::class, 'follower_id');
     }

     /**
      * Comprueba si este usuario sigue a otro usuario específico
      */
     public function isFollowing(User $user)
     {
          return $this->following()->where('followed_id', $user->id)->exists();
     }

     /**
      * Seguir a otro usuario
      */
     public function follow(User $user)
     {
          if ($this->id !== $user->id && !$this->isFollowing($user)) {
               return Follower::create([
                    'follower_id' => $this->id,
                    'followed_id' => $user->id
               ]);
          }
          return false;
     }

     /**
      * Dejar de seguir a un usuario
      */
     public function unfollow(User $user)
     {
          return Follower::where('follower_id', $this->id)
               ->where('followed_id', $user->id)
               ->delete();
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