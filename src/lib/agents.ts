import { z } from "zod";
import { getDb } from "./db";
import { randomUUID } from "node:crypto";

export const AgentSchema = z.object({
  name: z.string().trim().min(1, "name is required").max(80),
  description: z.string().trim().max(500).default(""),
  tags: z.string().trim().max(200).default(""),
  endpoint: z.string().trim().max(500).default(""),
  author: z.string().trim().max(80).default("anonymous"),
});

export type AgentInput = z.infer<typeof AgentSchema>;

export type Agent = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  endpoint: string;
  author: string;
  created_at: string;
};

function rowToAgent(r: any): Agent {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    tags: r.tags ? r.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
    endpoint: r.endpoint,
    author: r.author,
    created_at: r.created_at,
  };
}

export function listAgents(query?: string): Agent[] {
  const db = getDb();
  const rows = query && query.trim()
    ? db.prepare("SELECT * FROM agents WHERE name LIKE ? OR description LIKE ? OR tags LIKE ? ORDER BY created_at DESC")
        .all(`%${query}%`, `%${query}%`, `%${query}%`)
    : db.prepare("SELECT * FROM agents ORDER BY created_at DESC").all();
  return (rows as any[]).map(rowToAgent);
}

export function getAgent(id: string): Agent | null {
  const db = getDb();
  const r = db.prepare("SELECT * FROM agents WHERE id = ?").get(id);
  return r ? rowToAgent(r) : null;
}

export function createAgent(input: AgentInput): Agent {
  const db = getDb();
  const id = randomUUID();
  const created_at = new Date().toISOString();
  db.prepare(
    "INSERT INTO agents (id,name,description,tags,endpoint,author,created_at) VALUES (?,?,?,?,?,?,?)"
  ).run(id, input.name, input.description, input.tags, input.endpoint, input.author, created_at);
  return getAgent(id)!;
}

export function deleteAgent(id: string): boolean {
  const db = getDb();
  const info = db.prepare("DELETE FROM agents WHERE id = ?").run(id);
  return info.changes > 0;
}

export function searchAgents(q: string): Agent[] {
  return listAgents(q);
}

const SEED: AgentInput[] = [
  {
    name: "Summarizer",
    description: "Summarizes long text into a few bullet points.",
    tags: "text,summarization",
    endpoint: "",
    author: "agent-hub",
  },
  {
    name: "Translator",
    description: "Translates text between common languages.",
    tags: "text,translation",
    endpoint: "",
    author: "agent-hub",
  },
  {
    name: "Code Reviewer",
    description: "Reviews a code snippet and suggests improvements.",
    tags: "code,review",
    endpoint: "",
    author: "agent-hub",
  },
];

export function seedIfEmpty() {
  const db = getDb();
  const count = (db.prepare("SELECT COUNT(*) as c FROM agents").get() as any).c;
  if (count === 0) {
    for (const s of SEED) createAgent(s);
  }
}
