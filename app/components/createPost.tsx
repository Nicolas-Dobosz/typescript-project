"use client";
import React, { useState } from "react";

export default function CreatPostModal() {
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleClose = () => {
    console.log("COUCOU")
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!content || !url) {
			setError('Tous les champs sont requis');
			return;
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
      </form>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
      >
        Se connecter
      </button>
      <button onClick={handleClose}></button>
    </div>
  );
}
