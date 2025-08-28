// app/articles/page.tsx
"use client";
import { useEffect, useState } from "react";

type Article = {
  _id: string;
  title: string;
  content: string;
  link?: string;
  parent_category?: string;
  categories?: string[];
  createdAt?: string;
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState("");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = () => {
    fetch("/api/training/articles")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newArticle = {
      title,
      content,
      link,
      parent_category: parentCategory,
      categories: categories.split(",").map((c) => c.trim()),
    };

    await fetch("/api/training/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newArticle),
    });

    // refresh list
    fetchArticles();

    // clear form
    setTitle("");
    setContent("");
    setLink("");
    setParentCategory("");
    setCategories("");
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading articles...</p>;
  }

  return (
    <div className="prose max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Knowledge Base Articles</h1>

      {/* Add New Article Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 p-4 border rounded-lg bg-gray-50"
      >
        <h2 className="text-lg font-semibold mb-2">Add New Article</h2>

        <input
          type="text"
          placeholder="Title"
          className="w-full border rounded p-2 mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Content"
          className="w-full border rounded p-2 mb-2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="External Link (optional)"
          className="w-full border rounded p-2 mb-2"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        <input
          type="text"
          placeholder="Parent Category (e.g. Chatbot)"
          className="w-full border rounded p-2 mb-2"
          value={parentCategory}
          onChange={(e) => setParentCategory(e.target.value)}
        />

        <input
          type="text"
          placeholder="Categories (comma separated)"
          className="w-full border rounded p-2 mb-2"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Post Article
        </button>
      </form>

      {/* Articles List */}
      {articles.length === 0 ? (
        <p className="text-gray-500">No articles available.</p>
      ) : (
        <ul className="space-y-6">
          {articles.map((a) => (
            <li key={a._id} className="p-4 border rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold">{a.title}</h2>
              {a.parent_category && (
                <p className="text-sm text-gray-600">
                  Category: {a.parent_category}
                </p>
              )}
              {a.categories && a.categories.length > 0 && (
                <p className="text-sm text-gray-500">
                  Tags: {a.categories.join(", ")}
                </p>
              )}
              <div className="mt-2 text-gray-800">{a.content}</div>
              {a.link && (
                <a
                  href={a.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline mt-2 block"
                >
                  Read more
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
