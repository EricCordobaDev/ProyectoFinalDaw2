<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
          $table->id();
          $table->foreignId('user_id')->constrained()->onDelete('cascade');
          $table->foreignId('game_id')->constrained('games')->onDelete('cascade');
          $table->double('rating')->comment('Valoración del 1 al 5');
          $table->text('comment')->nullable();
          $table->timestamps();

          // Índices para mejorar el rendimiento en búsquedas
          $table->index('user_id');
          $table->index('game_id');
          
          // Una restricción única para evitar que un usuario haga múltiples reviews del mismo juego
          $table->unique(['user_id', 'game_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
