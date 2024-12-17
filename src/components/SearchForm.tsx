"use client";

import { useState } from "react";

export default function SearchForm({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter all or part of entity name"
        className="input w-full"
      />
      <button type="submit" className="btn btn-primary w-full">
        Search
      </button>
    </form>
  );
}
