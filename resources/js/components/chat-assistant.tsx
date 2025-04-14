import { useState, useEffect, FormEvent, useRef, ReactNode } from 'react';

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
        content: 'Hola, soy tu asistente especializado en videojuegos. ¿En qué puedo ayudarte hoy?'
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
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
               "Authorization": "Bearer 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",
                
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "google/gemma-3-4b-it:free",
                messages: [
                    {
                        role: "system",
                        content: "Eres un asistente especializado en videojuegos. Proporciona respuestas útiles sobre el mundo de los videojuegos."
                    },
                    ...messages.map(msg => ({
                        role: msg.role,
                        content: msg.content
                    })),
                    {
                        role: "user",
                        content: userInput
                    }
                ]
            })
        });

        const data = await response.json();
        const assistantMessage = data.choices[0].message.content;
        setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
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

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
        <span className="ml-2 group-hover:opacity-100 transition-opacity duration-300 hidden sm:inline">Asistente IA</span>
      </button>

      {/* Chat window */}
      <div
        className={`fixed bottom-6 right-6 w-full sm:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden transition-all duration-500 ease-in-out transform ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        } flex flex-col`}
        style={{ 
          maxWidth: "calc(100vw - 32px)", 
          maxHeight: "min(90vh, calc(100vh - 12rem))" // Ajusta proporcionalmente según el tamaño de la pantalla
        }}
      >
        <div className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center">
            <div className="bg-white rounded-full p-1 mr-3">
              <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                <path fill="currentColor" d="M192 64C86 64 0 150 0 256S86 448 192 448h85.2c7 0 13.7-3 18.5-8.2l15.2-16.8c14.3-15.8 43.5-15.8 57.8 0l15.2 16.8c4.8 5.2 11.5 8.2 18.5 8.2H448c106 0 192-86 192-192S554 64 448 64H192zm128 64c0 8.8-7.2 16-16 16s-16-7.2-16-16s7.2-16 16-16s16 7.2 16 16zm-96 0c0 8.8-7.2 16-16 16s-16-7.2-16-16s7.2-16 16-16s16 7.2 16 16zm288 0c0 8.8-7.2 16-16 16s-16-7.2-16-16s7.2-16 16-16s16 7.2 16 16zm-96 0c0 8.8-7.2 16-16 16s-16-7.2-16-16s7.2-16 16-16s16 7.2 16 16z"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold">Asistente Gamer IA</h2>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="text-white hover:text-gray-200 p-1 rounded-full hover:bg-indigo-500 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        
        <div className="h-80 overflow-y-auto p-4 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 flex-grow">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`mb-4 flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className={`rounded-xl p-3 max-w-[85%] shadow-sm ${
                message.role === 'user' 
                  ? 'bg-indigo-100 dark:bg-indigo-900 rounded-tr-none' 
                  : 'bg-white dark:bg-gray-800 rounded-tl-none border border-gray-200 dark:border-gray-700'
              }`}>
                <div className="flex items-center mb-1">
                  <span className="inline-block mr-2">
                    {message.role === 'user' 
                      ? <span className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs">👤</span> 
                      : <span className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs">🤖</span>}
                  </span>
                  <span className="font-medium text-xs text-gray-500 dark:text-gray-400">
                    {message.role === 'user' ? 'Tú' : 'Asistente IA'}
                  </span>
                </div>
                <div className="pl-8">
                  {/* Reemplazamos el texto plano con el formateado */}
                  <div className="whitespace-pre-wrap">
                    {formatMessageText(message.content)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="mb-4 flex justify-start">
              <div className="rounded-xl p-3 max-w-[85%] shadow-sm bg-white dark:bg-gray-800 rounded-tl-none border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-1">
                  <span className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs mr-2">🤖</span>
                  <span className="font-medium text-xs text-gray-500 dark:text-gray-400">Asistente IA</span>
                </div>
                <div className="pl-8 flex items-center">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enviar un mensaje..."            
              className="flex-grow px-4 py-3 bg-transparent focus:outline-none text-gray-800 dark:text-gray-200"
            />
            <button
              type="submit"
              className={`bg-indigo-600 text-white p-2.5 rounded-lg mr-1 transition duration-300 ease-in-out ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
              disabled={isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}