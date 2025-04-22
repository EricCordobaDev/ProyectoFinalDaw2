<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
     /**
      * Seed the application's database.
      */
     public function run(): void
     {        

            // Usuario principal
            User::factory()->create([               
                  'name' => 'eric',               
                  'birthdate' => '2005-12-05',
                  'phone' => '634461950',
                  'email' => 'cordobamataeric@gmail.com',
                  'password' => bcrypt('1234'),               
            ]);

            // Usuarios de prueba
            User::factory()->create([
                  'name' => 'testuser1',
                  'birthdate' => '1990-01-01',
                  'phone' => '600000001',
                  'email' => 'testuser1@example.com',
                  'password' => bcrypt('password1'),
            ]);

            User::factory()->create([
                  'name' => 'testuser2',
                  'birthdate' => '1992-02-02',
                  'phone' => '600000002',
                  'email' => 'testuser2@example.com',
                  'password' => bcrypt('password2'),
            ]);

            User::factory()->create([
                  'name' => 'testuser3',
                  'birthdate' => '1994-03-03',
                  'phone' => '600000003',
                  'email' => 'testuser3@example.com',
                  'password' => bcrypt('password3'),
            ]);
     }
}
