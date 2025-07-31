export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "AI Chat Assistant",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          messages,
        }),
      }
    );

    const data = await response.json();
    console.log("🔁 AI response:", JSON.stringify(data, null, 2));

    const aiReply = data?.choices?.[0]?.message?.content;

    return NextResponse.json({
      message: aiReply || "⚠️ No response from AI",
    });
  } catch (error) {
    console.error("❌ AI error:", error);
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
