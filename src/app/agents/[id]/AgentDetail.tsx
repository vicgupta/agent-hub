"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Agent = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  endpoint: string;
  author: string;
};

export default function AgentDetail({ id }: { id: string }) {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/agents/${id}`);
        if (!res.ok) throw new Error("not found");
        const data = await res.json();
        setAgent(data.agent);
      } catch (e: any) {
        setError(e?.message || "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function run(e: React.FormEvent) {
    e.preventDefault();
    setRunning(true);
    setReply("");
    try {
      const res = await fetch(`/api/agents/${id}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "run failed");
      setReply(data.reply ?? JSON.stringify(data));
    } catch (e: any) {
      setReply(`Error: ${e?.message || "failed"}`);
    } finally {
      setRunning(false);
    }
  }

  async function remove() {
    if (!confirm("Delete this agent?")) return;
    const res = await fetch(`/api/agents/${id}`, { method: "DELETE" });
    if (res.ok) window.location.href = "/";
  }

  if (loading) return <main className="p-8">Loading...</main>;
  if (error || !agent) return <main className="p-8 text-red-600">{error || "not found"}</main>;

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/" className="text-sm text-gray-500 hover:underline">
        ← Back
      </Link>
      <h1 className="mt-2 text-2xl font-bold">{agent.name}</h1>
      <p className="mt-2 text-gray-600">{agent.description}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {agent.tags.map((t) => (
          <span key={t} className="rounded bg-gray-100 px-2 py-0.5 text-xs">
            {t}
          </span>
        ))}
      </div>
      <p className="mt-2 text-xs text-gray-400">by {agent.author}</p>
      {agent.endpoint && (
        <p className="mt-2 text-xs text-gray-400">endpoint: {agent.endpoint}</p>
      )}

      <section className="mt-6 rounded border p-4">
        <h2 className="font-semibold">Run</h2>
        <form onSubmit={run} className="mt-3 flex flex-col gap-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message to the agent"
            className="rounded border px-3 py-2"
            rows={3}
          />
          <button
            type="submit"
            disabled={running}
            className="self-start rounded bg-black px-3 py-2 text-sm text-white disabled:opacity-50"
          >
            {running ? "Running..." : "Run"}
          </button>
        </form>
        {reply && (
          <pre className="mt-3 whitespace-pre-wrap rounded bg-gray-50 p-3 text-sm">{reply}</pre>
        )}
      </section>

      <button onClick={remove} className="mt-6 text-sm text-red-600 hover:underline">
        Delete agent
      </button>
    </main>
  );
}
