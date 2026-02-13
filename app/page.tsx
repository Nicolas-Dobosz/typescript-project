"use client";

import {useCallback, useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {auth} from '@/app/lib/auth';
import CreatPostModal from './components/createPost';
import MyButton from './components/Button';
import PostCard from './components/PostCard';
import {User} from "@/app/models";
import {EnrichPost} from "@/app/models/Post";

export default function Page() {
    const router = useRouter();
    
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [filter, setFilter] = useState<'following' | 'for-you' | 'recent'>('for-you');

    const [users, setUsers] = useState<User[]>([]);
    const [posts, setPosts] = useState<EnrichPost[]>([]);

    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const[refreshing, setRefreshing] = useState<boolean>(false);
    const isFetching = useRef(false);

    const displayModal = () => setModalOpen(true);
    const closeModal = () => {
        setModalOpen(false);
        setRefreshing(true);
      };
    
    const calculatePostPoints = (post: EnrichPost): number => {
        const basePoints = 10;
        const likePoints = (post.likeCount || 0) * 2;
        const ageInHours = (Date.now() - new Date(post.creationDate).getTime()) / (1000 * 60 * 60);
        const agePoints = Math.max(0, 20 - ageInHours);
        return basePoints + likePoints + agePoints;
    };

    const fetchPosts = useCallback(async (pageNum: number, currentFilter: string) => {
        if (isFetching.current) return;
        
        isFetching.current = true;
        setLoading(true);
		setRefreshing(false);

        try {
            let url = `/api/posts?page=${pageNum}`;
            if (currentFilter === 'following') {
                url = `/api/posts/following/${auth.getUser()?.id}?page=${pageNum}`;
            }

            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${auth.getToken()}` }
            });

            if (!res.ok) throw new Error('Erreur serveur');
            
            const data = await res.json();
            const newPosts = data.posts || [];

            setPosts(prev => pageNum === 1 ? newPosts : [...prev, ...newPosts]);
            setHasMore(newPosts.length === 10);
        } catch (error) {
            console.error("Erreur de fetch :", error);
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    }, [refreshing]);

    useEffect(() => {
        if (!auth.isAuthenticated()) {
            router.push('/login');
            return;
        }

        setPage(1);
        fetchPosts(1, filter);

        fetch('/api/users')
            .then(res => res.json())
            .then(data => setUsers(data.users || []))
            .catch(err => console.error(err));
            
    }, [filter, router, fetchPosts]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPosts(nextPage, filter);
    };

    const renderFilterBtn = (id: typeof filter, label: string) => (
        <button
            onClick={() => setFilter(id)}
            className={`transition-all rounded-lg px-4 py-2 text-sm font-medium ${
                filter === id 
                    ? 'bg-white text-indigo-900 border-2 border-indigo-500 shadow-sm' 
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50">  
            {isModalOpen && <CreatPostModal onClose={closeModal} />}
            
            <div className="p-6 flex flex-col items-center gap-6">
                <MyButton onClick={displayModal} label="New Post" />

                <div className="flex flex-row items-center w-full max-w-md justify-center gap-4">
                    {renderFilterBtn('following', 'Suivis')}
                    {renderFilterBtn('for-you', 'Pour toi')}
                    {renderFilterBtn('recent', 'Récents')}
                </div>

                <div className="flex flex-col justify-center items-center gap-6 w-full pb-10">
                    {posts
                        .sort((a, b) => {
                            if (filter === 'recent') {
                                return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
                            }
                            return calculatePostPoints(b) - calculatePostPoints(a);
                        })
                        .map((post, index) => (
                            <div key={`${post.id}-${index}`} className="w-full flex flex-col items-center">
                                <PostCard 
                                    postId={post.id}
                                    authorId={post.userId}
                                    author={post.username}
                                    iconUser={post.iconUser}
                                    title={post.content}
                                    image={post.image || 'https://media.istockphoto.com/id/1500645450/...'}
                                    likes={post.likeCount}
                                    isLiked={post.isLikedByUser}
                                    isAuthorFollowed={post.isAuthorFollowed}                                    
                                />
                            </div>
                        ))}

                    {hasMore && (
                        <button
                            onClick={handleLoadMore}
                            disabled={loading}
                            className={`mt-4 px-8 py-3 rounded-full font-semibold transition ${
                                loading ? 'bg-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            {loading ? 'Chargement...' : 'Afficher plus'}
                        </button>
                    )}

                    {!hasMore && posts.length > 0 && (
                        <p className="text-gray-400 text-sm italic">Fin du flux</p>
                    )}
                </div>
            </div>
        </div>
    );
}