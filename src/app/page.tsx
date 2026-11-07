"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Agent = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  author: string;
};

export default function Home() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load(query = "") {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/agents?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("failed to load");
      const data = await res.json();
      setAgents(data.agents || []);
    } catch (e: any) {
      setError(e?.message || "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    load(q);
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Agent Hub</h1>
        <Link href="/new" className="rounded bg-black px-3 py-2 text-sm text-white">
          Register agent
        </Link>
      </header>

      <form onSubmit={onSearch} className="mb-6 flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search agents by name or tag"
          className="flex-1 rounded border px-3 py-2"
        />
        <button type="submit" className="rounded border px-3 py-2">
          Search
        </button>
      </form>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && agents.length === 0 && (
        <p className="text-gray-500">No agents yet. Register one.</p>
      )}

      <ul className="grid gap-4 sm:grid-cols-2">
        {agents.map((a) => (
          <li key={a.id} className="rounded border p-4">
            <Link href={`/agents/${a.id}`} className="text-lg font-semibold hover:underline">
              {a.name}
            </Link>
            <p className="mt-1 text-sm text-gray-600">{a.description}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {a.tags.map((t) => (
                <span key={t} className="rounded bg-gray-100 px-2 py-0.5 text-xs">
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-400">by {a.author}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
