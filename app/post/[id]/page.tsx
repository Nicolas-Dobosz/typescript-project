import {redirect} from 'next/navigation';

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {

    //const del = await PostModel.delete(5);

    const { id } = await params;

    console.log("post id: ", id);

    const res = await fetch(`http://localhost:3000/api/post/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    const post_data = await res.json();
    console.log("post data: ", post_data);

    if (!res.ok) {
        redirect('/feed');
    }

    return (
        <div>

        </div>
    );
}
