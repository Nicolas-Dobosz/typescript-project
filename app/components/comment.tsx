import Link from "next/link";
import React from "react";
import Image from 'next/image'

interface DetailProps {
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

export default function Comment({ postData }: DetailProps) {
    return (
        <div>
            <h1 className="mb-5">Commentaires</h1>
            <ul>
                {postData.comments.map((comment, index) => (
                    <li key={index}>
                        <div className="flex gap-2">
                            <p>{comment.commenterName}:</p>
                            <p>{comment.content}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}