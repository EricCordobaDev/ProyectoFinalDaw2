<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    /** @use HasFactory<\Database\Factories\MessageFactory> */
    use HasFactory;

     protected $fillable = [
          'transmitter_id',
          'receiver_id',
          'message',
     ];

     /**
      * Obtiene el usuario que envía el mensaje.
      */
      public function transmitter()
      {
           return $this->belongsTo(User::class, 'transmitter_id');
      }
 
      /**
       * Obtiene el usuario que recibe el mensaje.
       */
      public function receiver()
      {
           return $this->belongsTo(User::class, 'receiver_id');
      }


}
