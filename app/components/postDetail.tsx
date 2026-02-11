import Link from "next/link";
import React from "react";
import Image from 'next/image'

interface PostDetailProps {
    postData: {
        id: number;
        content: string;
        image: string | null;
        creationDate: string;
        author: {
            name: string;
            picture: string | null;
        };
        comments: {
            id: number;
            userId: number;
            postId: number;
            content: string;
            creationDate: string;
            commenterName: string;
        }[];
    };
}           

export default function PostDetail({ postData }: PostDetailProps) {
    return (
        <div>
            <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 mr-2 rounded-full bg-black text-white font-bold uppercase">
                    {postData.author.picture ? (
                        <img src={postData.author.picture} alt={postData.author.name} className="rounded-full" />
                    ) : (
                        postData.author.name.charAt(0) // Récupère la 1ère lettre pour faire le logo si pas de photo de profil
                    )}
                </div>
                <p>name : {postData.author.name}</p>
            </div>
            <div>
                {postData.image && (
                    <Image 
                        src={postData.image} 
                        alt="Content image" 
                        width={500} 
                        height={500}
                        className="rounded-lg"
                    />
                )}
                <p>{postData.content}</p>
            </div>
        </div>
    );
}