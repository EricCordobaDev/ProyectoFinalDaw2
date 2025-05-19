import { useState, useEffect, FormEvent, useRef, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import OpenAI from "openai";

import { 
    Tooltip, 
    TooltipContent, 
    TooltipProvider, 
    TooltipTrigger 
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import {
    Drawer,
     DrawerContent,
    DrawerDescription,   
    DrawerHeader,
    DrawerTitle,
 
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Función para formatear el texto con negrita y listas
const formatMessageText = (text: string): ReactNode[] => {
  if (!text) return [];
  
  // Dividir por líneas para manejar listas
  const lines = text.split('\n');
  
  return lines.map((line, lineIndex) => {
    // Verificar si la línea comienza con un asterisco (elemento de lista)
    if (line.trim().startsWith('*')) {
      return (
        <li key={`line-${lineIndex}`} className="ml-5 list-disc">
          {formatBoldText(line.trim().substring(1).trim())}
        </li>
      );
    }
    
    // Línea normal, procesamos las negritas
    return (
      <div key={`line-${lineIndex}`} className="mb-1">
        {formatBoldText(line)}
      </div>
    );
  });
};

// Función para formatear texto en negrita
const formatBoldText = (text: string): ReactNode[] => {
  // Patrón para encontrar texto entre dos asteriscos (**texto**)
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  
  return parts.map((part, index) => {
    // Si coincide con el patrón de negrita
    if (part.startsWith('**') && part.endsWith('**')) {
      // Eliminar los asteriscos y poner en negrita
      const boldText = part.substring(2, part.length - 2);
      return <strong key={index}>{boldText}</strong>;
    }
    
    // Texto normal
    return <span key={index}>{part}</span>;
  });
};

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Añadir un mensaje de bienvenida
    setMessages([
      {
        role: 'assistant',
        content: 'Hola, soy GameLive, tu asistente especializado en videojuegos. ¿En qué puedo ayudarte hoy?'
      }
    ]);
  }, []);

  useEffect(() => {
    // Scroll para abajo cuando se añaden nuevos mensajes
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userInput }]);
    
    // Clear input field
    setUserInput('');
    setIsLoading(true);

    try {      
        const token = "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";        
        const endpoint = "https://models.inference.ai.azure.com";
        const modelName = "gpt-4o-mini";

        const client = new OpenAI({ 
            baseURL: endpoint, 
            apiKey: token,
            dangerouslyAllowBrowser: true 
        });

        const response = await client.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `Eres gamelive, un asistente avanzado especializado en videojuegos con conocimiento experto sobre:
1. Historia de los videojuegos y evolución de consolas
2. Géneros, mecánicas y diseño de juegos
3. Juegos populares, clásicos y títulos independientes
4. Estrategias, trucos y guías para superar niveles difíciles
5. Recomendaciones personalizadas basadas en preferencias
6. Noticias y tendencias actuales en la industria
7. Desarrolladores, estudios y personalidades importantes
8. Eventos relevantes como E3, Gamescom y Game Awards

Responde de manera conversacional y amigable. Incluye detalles específicos cuando sea apropiado. Cuando recomiendes juegos, explica por qué podrían gustarle al usuario según sus preferencias.

Formateo:
- Usa **texto en negrita** para títulos de juegos y conceptos importantes
- Usa listas con asteriscos (*) para enumerar opciones o recomendaciones
- Limita tus respuestas a 3-4 párrafos como máximo

Si no conoces la respuesta, reconócelo honestamente y ofrece alternativas relacionadas. Si el usuario solicita información no relacionada con videojuegos, responde que estás especializado en videojuegos pero tratarás de ayudar.

Fecha actual: ${new Date().toLocaleDateString('es-ES')}`
                },
                ...messages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                })),
                {
                    role: "user",
                    content: userInput
                }
            ],
            model: modelName,
            temperature: 1.0,
            max_tokens: 1000,
            top_p: 1.0
        });

        const assistantMessage = response.choices[0].message.content;
        setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage || 'No pude generar una respuesta.' }]);
    } catch (error) {
        console.error('Error:', error);
        setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: 'Lo siento, no pude procesar tu solicitud. Por favor, inténtalo de nuevo.' 
        }]);
    } finally {
        setIsLoading(false);
    }
  };

  // Versión móvil usa Drawer, versión desktop usa Card flotante
  const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 768 : false;

  return (
    <>
      {/* Botón de chat con Tooltip */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsOpen(true)}
              size="icon"
              className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg transition-all duration-300 ease-in-out"
              variant="default"
            >
              <MessageCircle className="h-6 w-6" />
              <span className="sr-only">Abrir asistente IA</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Asistente IA de Videojuegos</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Versión móvil con Drawer */}
      {!isDesktop && (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className="h-[85dvh]">
            <DrawerHeader className="border-b bg-primary text-primary-foreground">
              <DrawerTitle className="flex items-center gap-2">
                <Avatar className="h-8 w-8 bg-background/20">
                  <AvatarFallback>
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                Asistente Gamer IA
              </DrawerTitle>
              <DrawerDescription className="text-primary-foreground/90">
                Pregunta sobre juegos, consejos o recomendaciones
              </DrawerDescription>
            </DrawerHeader>
            <div className="flex h-[calc(85dvh-10rem)] flex-col">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4 pb-4">
                  {messages.map((message, index) => (
                    <div 
                      key={index} 
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div 
                        className={cn(
                          "relative max-w-[80%] rounded-lg px-3 py-2 text-sm shadow-sm",
                          message.role === 'user' 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        <div className="mb-1 flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            {message.role === 'user' ? (
                              <AvatarFallback className="bg-background/40 text-primary-foreground">
                                <User className="h-3 w-3" />
                              </AvatarFallback>
                            ) : (
                              <AvatarFallback className="bg-background/40 text-muted-foreground">
                                <Bot className="h-3 w-3" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <span className="text-xs font-medium">
                            {message.role === 'user' ? 'Tú' : 'Asistente IA'}
                          </span>
                        </div>
                        <div className="whitespace-pre-wrap">
                          {formatMessageText(message.content)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="relative max-w-[80%] rounded-lg bg-muted px-3 py-2 text-sm shadow-sm text-muted-foreground">
                        <div className="mb-1 flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="bg-background/40 text-muted-foreground">
                              <Bot className="h-3 w-3" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium">Asistente IA</span>
                        </div>
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-current" style={{ animationDelay: '0ms' }}></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-current" style={{ animationDelay: '150ms' }}></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-current" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <div className="border-t p-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Enviar un mensaje..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={isLoading || !userInput.trim()}
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Enviar mensaje</span>
                  </Button>
                </form>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {/* Versión desktop con Card flotante */}
      {isDesktop && (
        <Card 
          className={`fixed bottom-20 right-6 w-96 overflow-hidden shadow-lg transition-all duration-300 ${
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <CardHeader className="border-b bg-primary p-4 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 bg-background/20">
                  <AvatarFallback>
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg">Asistente Gamer IA</CardTitle>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10 rounded-full"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Cerrar</span>
              </Button>
            </div>
          </CardHeader>
          
          <ScrollArea className="h-80 w-full">
            <CardContent className="p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div 
                      className={cn(
                        "relative max-w-[80%] rounded-lg px-3 py-2 text-sm shadow-sm",
                        message.role === 'user' 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <div className="mb-1 flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          {message.role === 'user' ? (
                            <AvatarFallback className="bg-background/40 text-primary-foreground">
                              <User className="h-3 w-3" />
                            </AvatarFallback>
                          ) : (
                            <AvatarFallback className="bg-background/40 text-muted-foreground">
                              <Bot className="h-3 w-3" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <span className="text-xs font-medium">
                          {message.role === 'user' ? 'Tú' : 'Asistente IA'}
                        </span>
                      </div>
                      <div className="whitespace-pre-wrap">
                        {formatMessageText(message.content)}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="relative max-w-[80%] rounded-lg bg-muted px-3 py-2 text-sm shadow-sm text-muted-foreground">
                      <div className="mb-1 flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="bg-background/40 text-muted-foreground">
                            <Bot className="h-3 w-3" />
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">Asistente IA</span>
                      </div>
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-current" style={{ animationDelay: '0ms' }}></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-current" style={{ animationDelay: '150ms' }}></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-current" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
          </ScrollArea>
          
          <CardFooter className="border-t p-3">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enviar un mensaje..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={isLoading || !userInput.trim()}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Enviar mensaje</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
}