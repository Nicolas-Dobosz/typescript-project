"use client";

import {useRouter} from "next/navigation";
import {CircleUserRoundIcon, LucideHome} from "lucide-react";

export default function NavBar() {
	const router = useRouter();

	return (
		<div className="fixed top-0 w-[5vw] bg-black h-screen flex flex-col items-center py-4 justify-between py-[10vh]">
			<button
				className="flex flex-col hover:bg-white/10 focus:outline-none transition-all rounded-xl w-[4vw] h-[4vw] items-center justify-center"
				onClick={() => router.push("/")}
			>
				<LucideHome size={24} color="white" />
				<p className="text-white">Feed</p>
			</button>

			<button
				className="flex flex-col hover:bg-white/10 focus:outline-none transition-all rounded-xl w-[4vw] h-[4vw] items-center justify-center"
				onClick={() => router.push("/profile/me")}
			>
				<CircleUserRoundIcon size={24} color="white" />
				<p className="text-white">Profil</p>
			</button>
		</div>
	);
}