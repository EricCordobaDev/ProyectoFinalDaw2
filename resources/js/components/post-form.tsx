import { useState, useRef, FormEvent } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePage } from '@inertiajs/react';
import { Image, Loader2, X } from 'lucide-react';
import { 
    Tooltip, 
    TooltipContent, 
    TooltipProvider, 
    TooltipTrigger 
} from '@/components/ui/tooltip';

export default function PostForm() {
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { auth } = usePage().props as any;
    const user = auth.user;

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        setImageFile(file);
        
        // Crear URL para previsualizar la imagen
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        if (!content.trim() && !imageFile) {
            return; // No enviar formulario vacío
        }
        
        setIsSubmitting(true);
        
        const formData = new FormData();
        formData.append('content', content);
        if (imageFile) {
            formData.append('image', imageFile);
        }
        
        router.post('/posts', formData, {
            onSuccess: () => {
                setContent('');
                setImageFile(null);
                setImagePreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-start gap-3">
                <Avatar className="mt-1 h-10 w-10">
                    {user.image ? (
                        <AvatarImage src={`/storage/${user.image}`} alt={`${user.name} avatar`} />
                    ) : (
                        <AvatarFallback className="bg-primary/10 text-primary">
                            {user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    )}
                </Avatar>
                
                <div className="flex-1">
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="¿Qué estás pensando?"
                        className="min-h-[100px] resize-none border-none bg-muted/30 focus-visible:ring-1 focus-visible:ring-primary/20"
                    />
                    
                    {imagePreview && (
                        <div className="relative mt-3 overflow-hidden rounded-md border">
                            <img 
                                src={imagePreview} 
                                alt="Vista previa" 
                                className="max-h-[200px] w-full object-cover"
                            />
                            <Button 
                                type="button"
                                variant="destructive" 
                                size="icon" 
                                className="absolute right-2 top-2 h-7 w-7 rounded-full opacity-90 hover:opacity-100"
                                onClick={removeImage}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                    
                    <div className="mt-3 flex items-center justify-between">
                        <div>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="sm"
                                            className="text-muted-foreground hover:text-primary"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <Image className="h-5 w-5" />
                                            <span className="ml-1 sr-only sm:not-sr-only">Imagen</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Adjuntar imagen</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="hidden"
                            />
                        </div>
                        
                        <Button 
                            type="submit" 
                            disabled={isSubmitting || (!content.trim() && !imageFile)}
                            className="relative"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Publicando...
                                </>
                            ) : (
                                'Publicar'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
