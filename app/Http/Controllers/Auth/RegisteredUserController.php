<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
     /**
      * Show the registration page.
      */
     public function create(): Response
     {
          return Inertia::render('auth/register');
     }

     /**
      * Handle an incoming registration request.
      *
      * @throws \Illuminate\Validation\ValidationException
      */
      public function store(Request $request): RedirectResponse
      {
           $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',                
           ]);     
          
           $userData = [
               'name' => $request->name,
               'email' => $request->email,
               'password' => Hash::make($request->password),               
          ];
      
           // Procesar la imagen solo si se ha subido una
           if ($request->hasFile('image')) {
                $image = $request->file('image');
                // Generar un nombre único para la imagen
                $nombreImagen = time() . '.' . $image->getClientOriginalExtension();
                // Guardar la imagen en el disco 'public' dentro de la carpeta 'avatarImages'
                $userData['image'] = $image->storeAs('avatarImages', $nombreImagen, 'public');
           }

           $user = User::create($userData);
      
           event(new Registered($user));
      
           Auth::login($user);
      
           return to_route('dashboard');
      }
}
