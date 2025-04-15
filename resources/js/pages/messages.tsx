import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Trash2, Send, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { 
    Card, 
    CardContent, 
    CardFooter,
    CardHeader
} from '@/components/ui/card';
import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle,
} from '@/components/ui/dialog';
import { 
    Tooltip, 
    TooltipContent, 
    TooltipProvider, 
    TooltipTrigger 
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import AiChatBot from '@/components/chat-assistant';

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
    const [dialogOpen, setDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<Contact[]>([]);
    
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

            <div className="flex h-full flex-1 flex-col p-4">
                <Card className="h-[calc(100vh-200px)]">
                    <CardHeader className="flex flex-row items-center border-b p-4">
                        <div className="flex items-center space-x-4">
                            {selectedContact ? (
                                <>
                                    <Avatar>
                                        {selectedContact.image ? (
                                            <AvatarImage 
                                                src={`/storage/${selectedContact.image}`} 
                                                alt={`${selectedContact.name} avatar`} 
                                            />
                                        ) : (
                                            <AvatarFallback>{selectedContact.name[0].toUpperCase()}</AvatarFallback>
                                        )}
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium leading-none">{selectedContact.name}</p>
                                        <p className="text-sm text-muted-foreground">{selectedContact.email}</p>
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <p className="text-sm font-medium leading-none">Mensajes</p>
                                    <p className="text-sm text-muted-foreground">Selecciona un contacto para chatear</p>
                                </div>
                            )}
                        </div>
                        <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="ml-auto rounded-full"
                                        onClick={() => setDialogOpen(true)}
                                    >
                                        <Plus />
                                        <span className="sr-only">Nuevo mensaje</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent sideOffset={10}>Nuevo mensaje</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardHeader>
                    
                    <CardContent className="flex flex-col md:flex-row p-0 h-[calc(100%-140px)]">
                        {/* Lista de contactos - Solo visible en pantallas medianas y grandes */}
                        <div className="hidden md:flex flex-col w-1/3 border-r h-full overflow-y-auto">
                            {contacts.length > 0 ? (
                                contacts.map(contact => (
                                    <div 
                                        key={contact.id} 
                                        className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center ${
                                            selectedContact?.id === contact.id ? 'bg-blue-50 dark:bg-blue-900' : ''
                                        }`}
                                        onClick={() => setSelectedContact(contact)}
                                    >
                                        <Avatar className="mr-3">
                                            {contact.image ? (
                                                <AvatarImage 
                                                    src={`/storage/${contact.image}`} 
                                                    alt={`${contact.name} avatar`}
                                                />
                                            ) : (
                                                <AvatarFallback>{contact.name.charAt(0).toUpperCase()}</AvatarFallback>
                                            )}
                                        </Avatar>
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
                        
                        {/* Área de mensajes */}
                        <div className="flex-1 flex flex-col h-full">
                            <ScrollArea className="flex-1 p-4" id="messages-container">
                                <div className="space-y-4">
                                    {messages.length > 0 ? (
                                        messages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={cn(
                                                    "group relative flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                                                    message.transmitter_id === currentUser.id
                                                        ? "ml-auto bg-primary text-primary-foreground"
                                                        : "bg-muted"
                                                )}
                                            >
                                                {message.message}
                                                <div className="text-xs text-right opacity-70">
                                                    {new Date(message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </div>
                                                
                                                {message.transmitter_id === currentUser.id && (
                                                    <button 
                                                        onClick={() => handleDeleteMessage(message.id)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        title="Eliminar mensaje"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-muted-foreground my-4">
                                            {selectedContact ? 
                                                "No hay mensajes aún. ¡Comienza la conversación!" : 
                                                "Selecciona un contacto para ver los mensajes"}
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </div>
                    </CardContent>
                    
                    <CardFooter className="border-t p-3">
                        <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                            <Input
                                id="message"
                                placeholder="Escribe tu mensaje..."
                                className="flex-1"
                                autoComplete="off"
                                value={newMessage}
                                onChange={(event) => setNewMessage(event.target.value)}
                                disabled={!selectedContact}
                            />
                            <Button 
                                type="submit" 
                                size="icon" 
                                disabled={!newMessage.trim() || !selectedContact}
                            >
                                <Send />
                                <span className="sr-only">Enviar</span>
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            </div>
            
            {/* Dialog para nuevo mensaje */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Nuevo mensaje</DialogTitle>
                        <DialogDescription>
                            Busca usuarios para iniciar una nueva conversación.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="flex flex-col">
                        <div className="py-2">
                            <Input
                                placeholder="Buscar usuario..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="mb-2"
                            />
                        </div>
                        
                        <ScrollArea className="h-60">
                            <div className="space-y-1">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer"
                                            onClick={() => {
                                                setSelectedContact(user);
                                                setDialogOpen(false);
                                            }}
                                        >
                                            <div className="flex items-center">
                                                <Avatar className="mr-2">
                                                    {user.image ? (
                                                        <AvatarImage 
                                                            src={`/storage/${user.image}`}
                                                            alt={`${user.name} avatar`}
                                                        />
                                                    ) : (
                                                        <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
                                                    )}
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center p-4 text-muted-foreground">
                                        No se encontraron usuarios
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                    
                    <DialogFooter className="sm:justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                        >
                            Cancelar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <AiChatBot />
        </AppLayout>
    );
}