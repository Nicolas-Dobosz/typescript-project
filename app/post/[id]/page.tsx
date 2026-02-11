import { redirect } from "next/navigation";
import PostDetail from "@/app/components/postDetail";
import Comment from "@/app/components/comment";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const res = await fetch(`http://localhost:3000/api/post/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    const postData = await res.json();

    if (!res.ok) {
        redirect("/feed");
    }

    return (
        <div className="flex flex-col gap-10 items-center min-h-screen w-full py-10 px-4 bg-gray-50">
            <PostDetail postData={postData} />
            <Comment postData={postData} />
        </div>
    );
}
