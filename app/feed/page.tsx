'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/lib/auth';
import CreatPostModal from '../components/createPost';
import MyButton from '../components/Button';
import PostCard from '../components/PostCard';
import { Post, User } from "@/app/models";

export default function Page() {
    const router = useRouter();
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);

    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const isFetching = useRef(false);

    const displayModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const fetchPosts = useCallback(async (pageNum: number) => {
        if (isFetching.current) return;
        
        isFetching.current = true;
        setLoading(true);

        try {
            const res = await fetch(`/api/posts?page=${pageNum}`, {
				headers: {
					'Authorization': `Bearer ${auth.getToken()}`
				}
			});
            if (!res.ok) throw new Error('Erreur serveur');
            
            const data = await res.json();
            const newPosts = data.posts || [];

            if (pageNum === 1) {
                setPosts(newPosts); 
            } else {
                setPosts(prev => [...prev, ...newPosts]);
            }
            
            setHasMore(newPosts.length === 10);
        } catch (error) {
            console.error("Erreur lors du fetch des posts :", error);
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    }, []); 

    useEffect(() => {
        if (!auth.isAuthenticated()) {
            router.push('/login');
            return;
        }

        fetchPosts(1);

        fetch('/api/users')
            .then(res => res.json())
            .then(data => setUsers(data.users || []))
            .catch(err => console.error("Users fetch error:", err));
            
    }, [router, fetchPosts]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPosts(nextPage);
    };

    return (
        <>  
            {isModalOpen && <CreatPostModal onClose={closeModal} />}
            
            <div className="p-4 flex flex-col items-center">
                <MyButton onClick={displayModal} label="new post" />
            </div>

            <div className="flex flex-col justify-center items-center gap-6 pb-10">
                {posts.map((post, index) => (
                    <PostCard 
                        key={`${post.id}-${index}`} 
                        postId={post.id}
                        author={post.username}
                        title={post.content}
                        image={post.image || 'https://media.istockphoto.com/id/1500645450/fr/photo/image-floue-de-mouvement-de-la-circulation-sur-lautoroute.jpg?s=1024x1024&w=is&k=20&c=Kk2o63jL7LXfCs1MGT7NdeKldSQ-PXEAZYu0TJ_peH4='}
                        likes={post.likeCount}
                        isLiked={post.isLikedByUser}
                    />
                ))}

                {hasMore && (
                    <button
                        onClick={handleLoadMore}
                        disabled={loading}
                        className={`mt-4 px-8 py-3 rounded-full font-semibold transition
                            ${loading 
                                ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                            }`}
                    >
                        {loading ? 'Chargement...' : 'Afficher plus de posts'}
                    </button>
                )}

                {!hasMore && posts.length > 0 && (
                    <p className="text-gray-500 mt-4 italic">Vous avez vu tous les posts !</p>
                )}
            </div>
        </>
    );
}