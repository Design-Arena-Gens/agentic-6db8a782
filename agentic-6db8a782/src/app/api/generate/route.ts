import { NextRequest, NextResponse } from "next/server";
import { runContentAgent } from "@/lib/agent";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const topic = typeof body?.topic === "string" ? body.topic : "";
    const tone = typeof body?.tone === "string" ? body.tone : undefined;
    const audience =
      typeof body?.audience === "string" ? body.audience : undefined;
    const contentFormats = Array.isArray(body?.contentFormats)
      ? body.contentFormats.filter((format: unknown): format is string =>
          typeof format === "string",
        )
      : undefined;

    if (!topic.trim()) {
      return NextResponse.json(
        { error: "Please provide a topic to explore." },
        { status: 400 },
      );
    }

    const agentResponse = await runContentAgent(topic, {
      tone,
      audience,
      contentFormats,
    });

    return NextResponse.json(agentResponse);
  } catch (error) {
    console.error("Agent execution failure", error);
    return NextResponse.json(
      { error: "Failed to generate insights. Please try again." },
      { status: 500 },
    );
  }
}
