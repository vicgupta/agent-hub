import { NextRequest, NextResponse } from "next/server";
import { getAgent } from "@/lib/agents";

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const agent = getAgent(id);
  if (!agent) return NextResponse.json({ error: "not found" }, { status: 404 });

  let message = "";
  try {
    const body = await req.json();
    message = String(body?.message ?? "");
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!message.trim()) return NextResponse.json({ error: "message required" }, { status: 400 });

  // External endpoint: proxy
  if (agent.endpoint && /^https?:\/\//.test(agent.endpoint)) {
    try {
      const r = await fetch(agent.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, agent: agent.name }),
      });
      const text = await r.text();
      return NextResponse.json({ reply: text, status: r.status });
    } catch (e: any) {
      return NextResponse.json({ error: "endpoint unreachable", detail: String(e?.message || e) }, { status: 502 });
    }
  }

  // Built-in mock runner based on agent name
  const reply = mockRun(agent.name, message);
  return NextResponse.json({ reply });
}

function mockRun(name: string, message: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("summar")) {
    const words = message.split(/\s+/).filter(Boolean);
    return `Summary (${words.length} words): ${message.slice(0, 120)}${message.length > 120 ? "..." : ""}`;
  }
  if (lower.includes("translat")) {
    return `[translated] ${message}`;
  }
  if (lower.includes("review") || lower.includes("code")) {
    return `Review of snippet:\n- Looks reasonable.\n- Consider adding tests.\n- Watch for edge cases.\nInput: ${message.slice(0, 80)}`;
  }
  return `Agent "${name}" received: ${message}`;
}
