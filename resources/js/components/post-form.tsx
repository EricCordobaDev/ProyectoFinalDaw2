import { useState, useRef, FormEvent } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePage } from '@inertiajs/react';
import { Image, Loader2, X, ImagePlus, Send } from 'lucide-react';
import { 
    Tooltip, 
    TooltipContent, 
    TooltipProvider, 
    TooltipTrigger 
} from '@/components/ui/tooltip';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Definir esquema de validación con zod
const formSchema = z.object({
    content: z.string().max(1000, {
        message: "La publicación no puede tener más de 1000 caracteres.",
    }),
    image: z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function PostForm() {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { auth } = usePage().props as any;
    const user = auth.user;

    // Inicializar React Hook Form con zod
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "",
        },
    });

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        setImageFile(file);
        form.setValue("image", file);
        
        // Crear URL para previsualizar la imagen
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        form.setValue("image", undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const onSubmit = (values: FormValues) => {
        if (!values.content.trim() && !imageFile) {
            return; // No enviar formulario vacío
        }
        
        setIsSubmitting(true);
        setUploadProgress(0);
        
        const formData = new FormData();
        formData.append('content', values.content);
        if (imageFile) {
            formData.append('image', imageFile);
        }
        
        // Simular progreso de carga
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 95) {
                    clearInterval(progressInterval);
                    return prev;
                }
                return prev + 5;
            });
        }, 100);
        
        router.post('/posts', formData, {
            onSuccess: () => {
                clearInterval(progressInterval);
                setUploadProgress(100);
                form.reset();
                setImageFile(null);
                setImagePreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                
                // Esperar a que termine la animación de progreso
                setTimeout(() => {
                    setIsSubmitting(false);
                    setUploadProgress(0);
                }, 500);
            },
            onError: () => {
                clearInterval(progressInterval);
                setIsSubmitting(false);
                setUploadProgress(0);
            }
        });
    };

    const contentLength = form.watch("content")?.length || 0;
    const maxLength = 1000;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
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
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="¿Qué estás pensando?"
                                            className="min-h-[100px] resize-none border-none bg-muted/30 focus-visible:ring-1 focus-visible:ring-primary/20"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        {contentLength > 0 && (
                            <div className="mt-1 flex justify-end">
                                <Badge 
                                    variant={contentLength > maxLength ? "destructive" : "outline"}
                                    className="text-xs"
                                >
                                    {contentLength}/{maxLength}
                                </Badge>
                            </div>
                        )}
                        
                        {imagePreview && (
                            <Card className="relative mt-3 overflow-hidden border">
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
                            </Card>
                        )}
                        
                        {isSubmitting && (
                            <Progress 
                                value={uploadProgress}
                                className="mt-3 h-1 w-full" 
                            />
                        )}
                        
                        <div className="mt-3 flex items-center justify-between">
                            <div>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                size="sm"
                                                className="text-muted-foreground hover:text-primary"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <ImagePlus className="mr-1 h-4 w-4" />
                                                <span className="sr-only sm:not-sr-only">Imagen</span>
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
                                disabled={isSubmitting || ((!form.watch("content") || !form.watch("content").trim()) && !imageFile)}
                                className="relative gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Publicando
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        Publicar
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
}
