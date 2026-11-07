import { NextRequest, NextResponse } from "next/server";
import { getAgent, deleteAgent, seedIfEmpty } from "@/lib/agents";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  seedIfEmpty();
  const { id } = await ctx.params;
  const agent = getAgent(id);
  if (!agent) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ agent });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const ok = deleteAgent(id);
  if (!ok) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
