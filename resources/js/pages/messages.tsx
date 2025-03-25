import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Trash2, Send, UserPlus } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mensajes',
        href: '/messages',
    },
];

interface Contact {
    id: number;
    name: string;
    email: string;
    profile_photo_url?: string;
    image?: string;
}

interface Message {
    id: number;
    transmitter_id: number;
    receiver_id: number;
    message: string;
    created_at: string;
    transmitter: {
        id: number;
        name: string;
        profile_photo_url?: string;
    };
    receiver: {
        id: number;
        name: string;
        profile_photo_url?: string;
    };
}

export default function Messages() {
    const { props } = usePage<{ contacts: Contact[], allUsers: Contact[] }>();
    const { contacts, allUsers } = props;
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [showNewMessage, setShowNewMessage] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Cargar mensajes cuando se selecciona un contacto
    useEffect(() => {
        if (selectedContact) {
            fetchMessages(selectedContact.id);
        }
    }, [selectedContact]);

    const fetchMessages = async (userId: number) => {
        try {
            const response = await axios.get(`/messages/conversation/${userId}`);
            setMessages(response.data.messages);
            // Hacer scroll al último mensaje
            setTimeout(() => {
                const messagesContainer = document.getElementById('messages-container');
                if (messagesContainer) {
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
            }, 100);
        } catch (error) {
            console.error('Error al cargar los mensajes:', error);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedContact) return;

        try {
            const response = await axios.post('/messages', {
                receiver_id: selectedContact.id,
                message: newMessage
            });
            
            // Agregar el mensaje enviado a la lista
            setMessages([...messages, response.data.message]);
            setNewMessage('');
            
            // Hacer scroll al último mensaje
            setTimeout(() => {
                const messagesContainer = document.getElementById('messages-container');
                if (messagesContainer) {
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
            }, 100);
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
        }
    };

    const handleDeleteMessage = async (messageId: number) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este mensaje?')) return;
        
        try {
            await axios.delete(`/messages/${messageId}`);
            setMessages(messages.filter(msg => msg.id !== messageId));
        } catch (error) {
            console.error('Error al eliminar el mensaje:', error);
        }
    };

    const filteredUsers = allUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const { auth } = usePage().props as any;
    const currentUser = auth.user;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mensajes">
                <link rel="icon" href="icono.png" type="image/x-icon" />
            </Head>

            <div className="flex h-full flex-1 flex-col rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[calc(100vh-200px)]">
                    {/* Panel de contactos */}
                    <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Contactos</h2>
                            <button 
                                onClick={() => setShowNewMessage(!showNewMessage)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                                title="Nuevo mensaje"
                            >
                                <UserPlus size={20} />
                            </button>
                        </div>
                        
                        {showNewMessage && (
                            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                                <input
                                    type="text"
                                    placeholder="Buscar usuario..."
                                    className="w-full p-2 border rounded"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className="mt-2 max-h-40 overflow-y-auto">
                                    {filteredUsers.map(user => (
                                        <div 
                                            key={user.id} 
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center"
                                            onClick={() => {
                                                setSelectedContact(user);
                                                setShowNewMessage(false);
                                            }}
                                        >
                                            {user.image ? (
                                                <img 
                                                    src={`/storage/${user.image}`} 
                                                    alt={`${user.name} avatar`}
                                                    className="w-8 h-8 rounded-full mr-2 object-cover" 
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <div className="overflow-y-auto h-[calc(100%-56px)]">
                            {contacts.length > 0 ? (
                                contacts.map(contact => (
                                    <div 
                                        key={contact.id} 
                                        className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center ${
                                            selectedContact?.id === contact.id ? 'bg-blue-50 dark:bg-blue-900' : ''
                                        }`}
                                        onClick={() => setSelectedContact(contact)}
                                    >
                                        {contact.image ? (
                                            <img 
                                                src={`/storage/${contact.image}`} 
                                                alt={`${contact.name} avatar`}
                                                className="w-10 h-10 rounded-full mr-3 object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                                                {contact.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-semibold">{contact.name}</div>
                                            <div className="text-sm text-gray-500">{contact.email}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-gray-500">
                                    No hay contactos disponibles
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Panel de mensajes */}
                    <div className="md:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col">
                        {selectedContact ? (
                            <>
                                {/* Cabecera del chat */}
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
                                    {selectedContact.image ? (
                                        <img 
                                            src={`/storage/${selectedContact.image}`} 
                                            alt={`${selectedContact.name} avatar`}
                                            className="w-10 h-10 rounded-full mr-3 object-cover" 
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                                            {selectedContact.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-semibold">{selectedContact.name}</div>
                                        <div className="text-sm text-gray-500">{selectedContact.email}</div>
                                    </div>
                                </div>
                                
                                {/* Área de mensajes */}
                                <div id="messages-container" className="flex-1 p-4 overflow-y-hidden">
                                    {messages.length > 0 ? (
                                        messages.map(message => (
                                            <div 
                                                key={message.id} 
                                                className={`mb-4 flex ${
                                                    message.transmitter_id === currentUser.id ? 'justify-end' : 'justify-start'
                                                }`}
                                            >
                                                <div className={`relative max-w-3/4 p-3 rounded-lg ${
                                                    message.transmitter_id === currentUser.id 
                                                        ? 'bg-blue-500 text-white' 
                                                        : 'bg-gray-100 dark:bg-gray-700'
                                                }`}>
                                                    <p>{message.message}</p>
                                                    <div className="text-xs mt-1 text-right">
                                                        {new Date(message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </div>
                                                    
                                                    {message.transmitter_id === currentUser.id && (
                                                        <button 
                                                            onClick={() => handleDeleteMessage(message.id)}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 hover:opacity-100 transition-opacity"
                                                            title="Eliminar mensaje"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-gray-500 my-4">
                                            No hay mensajes aún. ¡Comienza la conversación!
                                        </div>
                                    )}
                                </div>
                                
                                {/* Formulario para enviar mensajes */}
                                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Escribe un mensaje..."
                                            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                                        />
                                        <button 
                                            type="submit"
                                            className="bg-blue-500 text-white p-2 rounded-lg"
                                            disabled={!newMessage.trim()}
                                        >
                                            <Send size={20} />
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="flex items-center justify-center flex-1">
                                <div className="text-center text-gray-500">
                                    <div className="text-xl mb-2">Selecciona un contacto</div>
                                    <p>Elige un contacto para iniciar una conversación o crea uno nuevo.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        
        </AppLayout>
    );
}