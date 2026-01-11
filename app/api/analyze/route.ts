import { NextRequest, NextResponse } from "next/server";

// External API - endpoints are /analyze (no /api prefix)
const SUT_ENGINE_URL = "https://sut-engine.hunerai.com";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("[Proxy /analyze] Calling:", `${SUT_ENGINE_URL}/analyze`);

    const response = await fetch(`${SUT_ENGINE_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("[Proxy /analyze] Response status:", response.status);

    const responseText = await response.text();
    console.log("[Proxy /analyze] Response:", responseText.slice(0, 500));

    if (!response.ok) {
      return NextResponse.json(
        { error: `API Error: ${response.status}`, details: responseText },
        { status: response.status }
      );
    }

    if (!responseText || responseText.trim() === "") {
      return NextResponse.json(
        { error: "Empty response", details: "API returned empty response" },
        { status: 500 }
      );
    }

    try {
      const data = JSON.parse(responseText);
      return NextResponse.json(data);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON", details: responseText.slice(0, 500) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[Proxy /analyze] Error:", error);
    return NextResponse.json(
      { error: "Proxy error", details: String(error) },
      { status: 500 }
    );
  }
}
