import { NextRequest, NextResponse } from "next/server";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CX = process.env.GOOGLE_CX;
const GOOGLE_SEARCH_URL = "https://www.googleapis.com/customsearch/v1";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || typeof q !== "string") {
    return new NextResponse(
      JSON.stringify({
        message: 'Query parameter "q" is required and must be a string.',
      }),
      { status: 400 }
    );
  }

  if (!GOOGLE_API_KEY || !GOOGLE_CX) {
    console.error("Google API key or CX is undefined. Please check your .env.local file.");
    return new NextResponse(
      JSON.stringify({ message: "Google API key or CX is not configured." }),
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `${GOOGLE_SEARCH_URL}?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&q=${encodeURIComponent(q)}`
    );

    if (!response.ok) {
      throw new Error(`Google API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ message: "Success", data });
  } catch (error) {
    console.error("Google API request error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
