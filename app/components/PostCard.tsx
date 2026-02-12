'use client';

import {useState} from 'react';
import {auth} from "@/app/lib/auth";
import {useRouter} from "next/navigation";

interface PostCardProps {
    postId?: number;
    authorId?: number;
    title: string;
    author: string;
    image?: string;
    iconUser?: string;
    category?: string;
    likes?: number;
    isLiked?: boolean;
    isAuthorFollowed?: boolean;
}

export default function PostCard({
    postId,
    authorId,
    title,
    author,
    iconUser = "https://www.recyclivre.com/blog/wp-content/uploads/2025/03/couvsiteluffy.jpeg",
    image = "/docs/images/blog/image-1.jpg",
    likes = 0,
    isLiked = false,
    isAuthorFollowed = false,
}: PostCardProps) {
    const [likesCount, setLikesCount] = useState(likes);
    const [liked, setLiked] = useState(isLiked);
    const [followed, setFollowed] = useState(isAuthorFollowed);
    const router = useRouter();
    const handleLike = () => {
        fetch('/api/like/' + postId, {
            method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getToken()}`
                }
        })
            .then(res => {
                if (!res.ok) throw new Error('Réponse serveur non-JSON');
                return res.json();
            })
            .then(data => {
                setLiked(Boolean(data.isLikedByUser));
                setLikesCount(Number(data.likeCount ?? likesCount));
            })
            .catch(error => {
                console.error("Erreur de fetch :", error);
            });
    }

    const handleImageError = (e) => {
        e.target.src = 'https://media.istockphoto.com/id/1500645450/fr/photo/image-floue-de-mouvement-de-la-circulation-sur-lautoroute.jpg?s=1024x1024&w=is&k=20&c=Kk2o63jL7LXfCs1MGT7NdeKldSQ-PXEAZYu0TJ_peH4=';
      };

    const handleFollow = () => {
        fetch('/api/follow/' + authorId, {
            method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getToken()}`
                }
        })
            .then(res => {
                if (!res.ok) throw new Error('Réponse serveur non-JSON');
                return res.json();
            })
            .then(data => {
                setFollowed(data.following);
                router.refresh();
                
            })
            .catch(error => {
                console.error("Erreur de fetch :", error);
            });
    }
    return (
        <div className="max-w-md bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="flex items-center gap-3 p-3">
                <img
                    src={iconUser}
                    alt={author}
                    className="h-10 w-10 rounded-full object-cover border border-gray-100"
                />
                <span className="font-bold text-sm text-gray-900 hover:underline cursor-pointer">
                    {author}
                </span>
                <button
                    className={`transition-all duration-200 px-3 py-1 rounded-lg font-semibold text-xs ml-auto ${
                        followed
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
                    }`}
                    onClick={() => handleFollow()}
                >
                    {followed ? 'Suivi' : 'Suivre'}
                </button>
            </div>

            <div className="relative aspect-square bg-gray-100">
                <img 
                    className="w-full h-full object-cover" 
                    src={image} 
                    onError={handleImageError}
                    alt="Post content" 
                />
            </div>

            <div className="px-4 pt-3 pb-1 flex space-x-4">
                <button
                    onClick={() => handleLike()}
                    className={`transition-colors ${liked ? 'text-red-500' : 'text-gray-700 hover:text-gray-400'}`}
                >
                    <svg className="w-7 h-7" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>

                <button className="text-gray-700 hover:text-gray-400">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </button>
            </div>

            <div className="px-4 pb-4">
                <p className="font-bold text-sm mb-1 text-gray-800">
                    {likesCount} J'aimes
                </p>
                <div className="text-sm">
                    <span className="font-bold mr-2 text-gray-800">{author}</span>
                    <span className="text-gray-800">{title}</span>
                </div>
                <button className="text-gray-500 text-xs mt-2 hover:underline">
                    Voir les commentaires...
                </button>
            </div>
        </div>
    );
}