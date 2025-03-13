import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useInitials } from '@/hooks/use-initials';
import { formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';
import { Heart, Trash2 } from 'lucide-react';
import { useState } from 'react';

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
      avatar?: string;
    };
  };
  currentUserId?: number;
  onDelete?: (id: number) => void;
  onLike?: (id: number) => void;
}

export default function PostCard({ post, currentUserId, onDelete, onLike }: PostCardProps) {
  const getInitials = useInitials();
  const [isDeleting, setIsDeleting] = useState(false);
  const isOwner = currentUserId === post.user.id;
  const date = new Date(post.post_date || post.created_at);
  
  const handleDelete = async () => {
    if (isDeleting || !onDelete) return;
    setIsDeleting(true);
    
    try {
      onDelete(post.id);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleLike = () => {
    if (!onLike) return;
    onLike(post.id);
  };

  return (
    <Card className="mb-4 overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.user.avatar} alt={post.user.name} />
          <AvatarFallback>{getInitials(post.user.name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="font-medium">{post.user.name}</p>
          <p className="text-xs text-muted-foreground">
          {post.post_date}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">{post.content}</p>
        {post.image && (
          <div className="mt-3 rounded-md overflow-hidden">
            <img src={post.image} alt="Post image" className="w-full h-auto object-cover" />
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
        {isOwner && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}