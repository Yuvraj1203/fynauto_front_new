import { NextResponse } from "next/server";

// GET API example
export async function GET() {
  const data = {
    success: true,
    message: "Hello from Next.js GET API ",
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(data, { status: 200 });
}
