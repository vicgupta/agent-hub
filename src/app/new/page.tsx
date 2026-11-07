"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewAgent() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    tags: "",
    endpoint: "",
    author: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags,
          author: form.author || "anonymous",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(data?.error || "failed"));
      router.push(`/agents/${data.agent.id}`);
    } catch (e: any) {
      setError(e?.message || "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <Link href="/" className="text-sm text-gray-500 hover:underline">
        ← Back
      </Link>
      <h1 className="mt-2 text-2xl font-bold">Register an agent</h1>
      <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
        <input
          required
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded border px-3 py-2"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="rounded border px-3 py-2"
          rows={3}
        />
        <input
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          className="rounded border px-3 py-2"
        />
        <input
          placeholder="Endpoint URL (optional, for external agents)"
          value={form.endpoint}
          onChange={(e) => setForm({ ...form, endpoint: e.target.value })}
          className="rounded border px-3 py-2"
        />
        <input
          placeholder="Author"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          className="rounded border px-3 py-2"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-black px-3 py-2 text-sm text-white disabled:opacity-50"
        >
          {submitting ? "Registering..." : "Register"}
        </button>
      </form>
    </main>
  );
}
