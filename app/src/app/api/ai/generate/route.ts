import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, files } = await req.json();
    if (!prompt)
      return NextResponse.json({ error: "prompt required" }, { status: 400 });

    // Stub: echo back a simple component based on prompt
    const name = (prompt.match(/[A-Za-z]+/g)?.join("") || "Generated").slice(
      0,
      20
    );
    const code = `import React from 'react';\nexport default function ${name}(){\n  return (<div style={{padding:12}}>${prompt.replace(
      /`/g,
      "`"
    )}</div>);\n}`;

    const out = [{ filename: "index.tsx", code }];

    return NextResponse.json({ files: out });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "failed" },
      { status: 500 }
    );
  }
}
