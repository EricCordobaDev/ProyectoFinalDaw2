<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Post extends Model
{
    /** @use HasFactory<\Database\Factories\PostFactory> */
    use HasFactory;

    protected $fillable = [
        'usuario_id',
        'likes',
        'content',
        'image',
        'post_date',
    ];

    protected $casts = [
        'post_date' => 'datetime',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        return $this->image ? Storage::disk('public')->url($this->image) : null;
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
    
    public function likedBy()
    {
        return $this->belongsToMany(User::class, 'post_likes', 'post_id', 'user_id')->withTimestamps();
    }
    
    public function isLikedBy(User $user)
    {
        return $this->likedBy()->where('user_id', $user->id)->exists();
    }
}
