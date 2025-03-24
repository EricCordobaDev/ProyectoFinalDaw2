<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMessageRequest;
use App\Http\Requests\UpdateMessageRequest;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Obtener usuarios con los que el usuario actual ha intercambiado mensajes
        $userId = Auth::id();
        
        $contacts = User::whereIn('id', function($query) use ($userId) {
            $query->select('transmitter_id')
                ->from('messages')
                ->where('receiver_id', $userId)
                ->union(
                    Message::select('receiver_id')
                    ->where('transmitter_id', $userId)
                );
        })
        ->where('id', '!=', $userId)
        ->get();

        // Obtener todos los usuarios para poder iniciar nuevas conversaciones
        $allUsers = User::where('id', '!=', $userId)->get();
        
        return inertia('messages', [
            'contacts' => $contacts,
            'allUsers' => $allUsers
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMessageRequest $request)
    {
        $message = Message::create([
            'transmitter_id' => Auth::id(),
            'receiver_id' => $request->receiver_id,
            'message' => $request->message,
        ]);

        return response()->json(['success' => true, 'message' => $message]);
    }

    /**
     * Get conversation messages between current user and another user
     */
    public function getConversation($userId)
    {
        $currentUser = Auth::id();
        
        $messages = Message::where(function($query) use ($currentUser, $userId) {
            $query->where('transmitter_id', $currentUser)
                ->where('receiver_id', $userId);
        })->orWhere(function($query) use ($currentUser, $userId) {
            $query->where('transmitter_id', $userId)
                ->where('receiver_id', $currentUser);
        })
        ->with(['transmitter', 'receiver'])
        ->orderBy('created_at')
        ->get();
        
        return response()->json(['messages' => $messages]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Message $message)
    {
        // Verificar que el usuario actual sea el transmisor o receptor
        if (Auth::id() == $message->transmitter_id || Auth::id() == $message->receiver_id) {
            $message->delete();
            return response()->json(['success' => true]);
        }
        
        return response()->json(['success' => false, 'message' => 'No autorizado'], 403);
    }
}