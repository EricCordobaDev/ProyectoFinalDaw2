import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { Send, Image } from 'lucide-react';
import { useState, FormEvent } from 'react';

export default function PostForm() {
  const { data, setData, post, processing, reset } = useForm({
    content: '',
    image: '',
  });

  const [showImageInput, setShowImageInput] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    post(route('posts.store'), {
      onSuccess: () => {
        reset();
        setShowImageInput(false);
      },
    });
  };

  return (
    <Card className="mb-6">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-lg">Crear nueva publicación</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="¿Qué estás pensando?"
            className="min-h-[100px]"
            value={data.content}
            onChange={(e) => setData('content', e.target.value)}
            required
          />
          {showImageInput && (
            <div className="mt-3">
              <input
                type="url"
                placeholder="URL de la imagen"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={data.image}
                onChange={(e) => setData('image', e.target.value)}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => setShowImageInput(!showImageInput)}
          >
            <Image className="h-4 w-4 mr-2" />
            {showImageInput ? "Ocultar imagen" : "Añadir imagen"}
          </Button>
          <Button 
            type="submit" 
            disabled={processing || !data.content.trim()}
            size="sm"
          >
            <Send className="h-4 w-4 mr-2" />
            Publicar
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}