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
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
                <div className="flex items-center mb-6">
                    <div className="flex items-center justify-center w-12 h-12 mr-4 rounded-full bg-linear-to-tr from-blue-500 to-indigo-600 text-white font-bold text-lg uppercase">
                        {postData.author.picture ? (
                            <img src={postData.author.picture} alt={postData.author.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                            postData.author.name.charAt(0)
                        )}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 text-lg">{postData.author.name}</p>
                        <p className="text-xs text-gray-400">{new Date(postData.creationDate).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {postData.image && (
                        <div className="relative overflow-hidden rounded-xl border border-gray-100">
                            <Image 
                                src={postData.image} 
                                alt="Content image" 
                                width={800} 
                                height={500}
                                className="w-full object-cover hover:scale-[1.02] transition-transform duration-500"
                            />
                        </div>
                    )}
                    <p className="text-gray-700 text-lg px-2">
                        {postData.content}
                    </p>
                </div>
            </div>
        </div>
    );
}