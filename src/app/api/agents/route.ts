import { NextRequest, NextResponse } from "next/server";
import { listAgents, createAgent, AgentSchema, seedIfEmpty } from "@/lib/agents";

export async function GET(req: NextRequest) {
  seedIfEmpty();
  const q = req.nextUrl.searchParams.get("q") || "";
  const agents = listAgents(q);
  return NextResponse.json({ agents });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const parsed = AgentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const agent = createAgent(parsed.data);
  return NextResponse.json({ agent }, { status: 201 });
}
