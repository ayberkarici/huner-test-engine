import { NextRequest, NextResponse } from "next/server";

const SUT_ENGINE_URL = "https://sut-engine.hunerai.com";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${SUT_ENGINE_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `API Error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to proxy request", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const response = await fetch(`${SUT_ENGINE_URL}/health`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Health check failed", details: String(error) },
      { status: 500 }
    );
  }
}

