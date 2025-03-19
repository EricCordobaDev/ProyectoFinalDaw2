import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { Send } from 'lucide-react';
import { FormEvent, useState } from 'react';

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
                                className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                                value={data.image}
                                onChange={(e) => setData('image', e.target.value)}
                            />
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                <div className="grid gap-2">
                        <Label htmlFor="image">Imagen de publicación</Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            tabIndex={2}
                            className="file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold"
                            disabled={processing}
                            onChange={(e) => setData('image', e.target.files?.[0] || null)}
                        />
                    </div>
                    <Button type="submit" disabled={processing || !data.content.trim()} size="sm">
                        <Send className="mr-2 h-4 w-4" />
                        Publicar
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
