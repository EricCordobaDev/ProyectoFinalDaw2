import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface PostCardProps {
  post: {
    id: number;
    content: string;
    image?: string;
    likes: number;
    created_at: string;
    post_date: string;
    liked_by_user?: boolean;
    user: {
      id: number;
      name: string;
      image?: string;      
    };
  };
  currentUserId?: number;
  onDelete?: (id: number) => void;
  onLike?: (id: number) => void;
}

export default function PostCard({ post, onLike }: PostCardProps) {

  
  const handleLike = () => {
    if (!onLike) return;
    onLike(post.id);
  };

  return (
    <Card className="mb-4 overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="h-10 w-10 rounded-full overflow-hidden">
           {/*Si el usuario tiene foto de perfil */}
          {post.user.image ? (
            <img 
              src={`/storage/${post.user.image}`} 
              alt={`${post.user.name} avatar`}
              className="h-full w-full object-cover"
            />            
          ) : (
               
            <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">
              {post.user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <p className="font-medium">{post.user.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: es })}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">{post.content}</p>
        {post.image && (
            <div className="mt-3 rounded-md overflow-hidden max-w-md mx-auto">
               <img src={`/storage/${post.image}`} className="w-full h-auto max-h-80 object-cover" />
            </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLike} 
          className={`flex gap-1 ${post.liked_by_user ? 'text-red-500' : ''}`}
        >
          <Heart 
            className={`h-4 w-4 ${post.liked_by_user ? 'fill-red-500 text-red-500' : ''}`} 
          />
          <span>{post.likes || 0}</span>
        </Button>       
      </CardFooter>
    </Card>
  );
}