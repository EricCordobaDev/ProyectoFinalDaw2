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

          User::factory()->create([               
               'name' => 'eric',               
               'birthdate' => '2005-12-05',
               'phone' => '634461950',
               'email' => 'cordobamataeric@gmail.com',
               'password' => bcrypt('1234'),
          ]);
     }
}
