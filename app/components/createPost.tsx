"use client";
import React, { useState } from "react";
import { auth } from "../lib/auth";

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
    <div>
      <h1>Create a new post:</h1>
      <form onSubmit={handleSubmit}>
        <p>
          Descritpion of your post:{" "}
          <input
            placeholder="Description"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </p>
        <p>
          Image URL:{" "}
          <input
            placeholder="Description"
            name="image_url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </p>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Create
        </button>
      </form>
      <button type="button" onClick={handleClose}>
        Close
      </button>
    </div>
  );
}
