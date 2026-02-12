"use client";
import React, { useState } from "react";
import { auth } from "../lib/auth";
import MyButton from "./Button";
interface CreatPostModalProps {
  onClose: () => void;
}

export default function CreatPostModal({ onClose }: CreatPostModalProps) {
  const [content, setContent] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const user: number = auth.getUser().id;
  const handleClose = () => {
    onClose();
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!content || !url) {
      setError("Tous les champs sont requis");
      return;
    }
    try {
      const res = await fetch("/api/createPost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user, content, url }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      handleClose();
    } catch {
      setError("Erreur serveur");
    }
  };

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm p-4">
    
    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md relative">
      <div className="mt-4 flex justify-end">
        <MyButton onClick={handleClose} label="Close" />
      </div>
      <h1 className="text-2xl font-bold mb-6 text-black">Create a new post:</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-black">Description of your post:</label>
          <input
            placeholder="What's on your mind?"
            name="content"
            value={content}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none text-black"
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-black">Image URL:</label>
          <input
            placeholder="https://example.com/image.jpg"
            name="image_url"
            value={url}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none text-black"
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg"
        >
          Create Post
        </button>
      </form>

      
      
    </div>
  </div>
  );
}
