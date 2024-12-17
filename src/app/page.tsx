"use client";

import { useState } from "react";
import SearchForm from "../components/SearchForm";
import ResultsTable from "../components/ResultsTable";

export default function Home() {
  const [results, setResults] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);


  const handleSearch = async (query: string) => {
    setLoading(true); // Start loading
    setError(null); // Reset any existing errors
    setHint(null);

    try {
      const res = await fetch(`/api/search?query=${query}`);
      if (!res.ok) {
        throw new Error("Failed to fetch data. Please try again later.");
      }

      const data = await res.json();
      if (data.error) {
        setError(data.message);
        setHint(data.hint || null);
        setResults(null);
      } else {
        setResults(data);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setResults(null);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Texas Business Filing Tracker</h1>
      <SearchForm onSearch={handleSearch} />

      {loading && (
        <div className="mt-6 text-center">
          <p>Loading results...</p>
        </div>
      )}

      {error && (
        <div className="mt-6 text-center text-red-600">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && results !== null && <ResultsTable results={results} />}
    </div>
  );
}
