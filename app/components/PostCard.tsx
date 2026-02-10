'use client'; // On ajoute ça pour pouvoir gérer le clic sur le bouton Like plus tard

import { useState } from 'react';

interface PostCardProps {
    title: string;
    author: string;
    image?: string;
    iconUser?: string;
    category?: string;
    likes?: number;
}

export default function PostCard({ 
    title, 
    author,
    iconUser = "https://www.recyclivre.com/blog/wp-content/uploads/2025/03/couvsiteluffy.jpeg", 
    image = "/docs/images/blog/image-1.jpg", 
    likes = 0
}: PostCardProps) {
    const [isLiked, setIsLiked] = useState(false);

    return (
        <div className="max-w-md bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="flex items-center p-3 space-x-3">
                <img 
                    src={iconUser} 
                    alt={author} 
                    className="h-10 w-10 rounded-full object-cover border border-gray-100"
                />
                <span className="font-bold text-sm text-gray-900 hover:underline cursor-pointer">
                    {author}
                </span>
            </div>

            <div className="relative aspect-square bg-gray-100">
                <img 
                    className="w-full h-full object-cover" 
                    src={image} 
                    alt="Post content" 
                />
            </div>

            <div className="px-4 pt-3 pb-1 flex space-x-4">
                <button 
                    onClick={() => setIsLiked(!isLiked)}
                    className={`transition-colors ${isLiked ? 'text-red-500' : 'text-gray-700 hover:text-gray-400'}`}
                >
                    <svg className="w-7 h-7" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
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
                    {isLiked ? likes + 1 : likes} J'aime
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