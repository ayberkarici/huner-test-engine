import { NextRequest, NextResponse } from "next/server";

const SUT_ENGINE_URL = "https://sut-engine.hunerai.com";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("[/api/jsonize] Request body:", JSON.stringify(body).slice(0, 200));

    const response = await fetch(`${SUT_ENGINE_URL}/jsonize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("[/api/jsonize] Response status:", response.status);

    // Get response text first
    const responseText = await response.text();
    console.log("[/api/jsonize] Response text:", responseText.slice(0, 500));

    if (!response.ok) {
      return NextResponse.json(
        { error: `Jsonize API Error: ${response.status}`, details: responseText },
        { status: response.status }
      );
    }

    // Try to parse as JSON
    if (!responseText || responseText.trim() === "") {
      return NextResponse.json(
        { error: "Empty response from Jsonize API", details: "The API returned an empty response" },
        { status: 500 }
      );
    }

    try {
      const data = JSON.parse(responseText);
      return NextResponse.json(data);
    } catch (parseError) {
      console.error("[/api/jsonize] JSON parse error:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON response from Jsonize API", details: responseText.slice(0, 500) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[/api/jsonize] Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to proxy jsonize request", details: String(error) },
      { status: 500 }
    );
  }
}
