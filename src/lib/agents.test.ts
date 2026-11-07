import { describe, it, expect, beforeEach } from "vitest";
process.env.DB_PATH = ":memory:";

import { listAgents, getAgent, createAgent, deleteAgent, AgentSchema, seedIfEmpty } from "./agents";
import { resetDb } from "./db";

beforeEach(() => resetDb());

describe("agents", () => {
  it("seeds demo agents when empty", () => {
    seedIfEmpty();
    const agents = listAgents();
    expect(agents.length).toBe(3);
  });

  it("creates and retrieves an agent", () => {
    const a = createAgent({ name: "Bot", description: "desc", tags: "x,y", endpoint: "", author: "me" });
    expect(a.id).toBeTruthy();
    const got = getAgent(a.id);
    expect(got?.name).toBe("Bot");
    expect(got?.tags).toEqual(["x", "y"]);
  });

  it("lists and searches", () => {
    createAgent({ name: "Alpha", description: "first", tags: "a", endpoint: "", author: "u" });
    createAgent({ name: "Beta", description: "second", tags: "b", endpoint: "", author: "u" });
    expect(listAgents().length).toBe(2);
    expect(listAgents("Alpha").length).toBe(1);
    expect(listAgents("zzz").length).toBe(0);
  });

  it("deletes", () => {
    const a = createAgent({ name: "Tmp", description: "", tags: "", endpoint: "", author: "u" });
    expect(deleteAgent(a.id)).toBe(true);
    expect(getAgent(a.id)).toBeNull();
    expect(deleteAgent("nope")).toBe(false);
  });

  it("validates input", () => {
    expect(AgentSchema.safeParse({ name: "" }).success).toBe(false);
    expect(AgentSchema.safeParse({ name: "ok" }).success).toBe(true);
  });
});
