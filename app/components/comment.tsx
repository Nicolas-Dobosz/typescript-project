"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../lib/auth";

import { Trash } from 'lucide-react';


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

export default function Comment({ postData }: PostDetailProps) {
    const router = useRouter();
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

    const handleSubmit = async () => {
        if (!content.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/comment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    postId: postData.id,
                    userId: auth.getUser().id,
                    content: content,
                }),
            });

            if (res.ok) {
                setContent("");
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const confirmDelete = async () => {
        if (!commentToDelete) return;

        try {
            const res = await fetch(`/api/comment/${commentToDelete}`, {
                headers: { "Content-Type": "application/json" },
                method: "DELETE",
            });

            if (res.ok) {
                setCommentToDelete(null);
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    Commentaires
                    <p className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                        {postData.comments.length}
                    </p>
                </h1>
            </div>

            <div className="mb-10 flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                    MOI
                </div>
                <div className="flex-1 space-y-3">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Écrire un commentaire..."
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm resize-none"
                        rows={3}
                        disabled={isSubmitting}
                    />
                    <div className="flex justify-end">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !content.trim()}
                            className="px-5 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-indigo-600 disabled:opacity-50 transition-colors"
                        >
                            {isSubmitting ? "Publication..." : "Publier"}
                        </button>
                    </div>
                </div>
            </div>

            <ul className="space-y-6">
                {[...postData.comments]
                    .sort(
                        (a, b) =>
                            new Date(b.creationDate).getTime() -
                            new Date(a.creationDate).getTime(),
                    )
                    .map((comment) => (
                        <li key={comment.id}>
                            <div className="flex gap-4">
                                <div className="shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                                    {comment.commenterName
                                        ?.charAt(0)
                                        .toUpperCase()}
                                </div>
                                <div className="flex-1 bg-gray-50 rounded-2xl rounded-tl-none p-4 min-w-0">
                                    {" "}
                                    <div className="flex items-start justify-between gap-4 mb-1">
                                        <p className="font-bold text-sm text-gray-900 truncate">
                                            {comment.commenterName}
                                        </p>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <p className="text-[10px] text-gray-400 whitespace-nowrap">
                                                {comment.creationDate}
                                            </p>
                                            {comment.userId ==
                                                auth.getUser().id && (
                                                <button onClick={() => setCommentToDelete(comment.id)}>
                                                    <Trash size={18} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"/>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed wrap-break-word">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))}
            </ul>

            {postData.comments.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-gray-400 italic text-sm">
                        Aucun commentaire pour le moment.
                    </p>
                </div>
            )}
            {commentToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Supprimer le commentaire ?</h3>
                        <div className="flex gap-3 justify-end">
                            <button 
                                onClick={() => setCommentToDelete(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Annuler
                            </button>
                            <button 
                                onClick={confirmDelete}
                                className="px-4 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
