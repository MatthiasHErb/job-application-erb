import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_NAME_LENGTH = 100;
const PDF_MAGIC_BYTES = Buffer.from("%PDF-", "utf8");
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 3; // Max 3 submissions per IP per hour

function isPdf(buffer: Buffer): boolean {
  return buffer.length >= 5 && buffer.subarray(0, 5).equals(PDF_MAGIC_BYTES);
}

// In-memory rate limit store (use Redis/Upstash in production for multi-instance)
const rateLimitStore = new Map<string, number[]>();

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitStore.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX) {
    return false;
  }

  recent.push(now);
  rateLimitStore.set(ip, recent);
  return true;
}

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Supabase credentials not configured");
    return NextResponse.json(
      { error: "Server configuration error. Please contact the administrator." },
      { status: 500 }
    );
  }

  const ip = getClientIP(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const firstName = (formData.get("firstName") as string)?.trim() || "";
    const lastName = (formData.get("lastName") as string)?.trim() || "";

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "First name and last name are required." },
        { status: 400 }
      );
    }

    if (firstName.length > MAX_NAME_LENGTH || lastName.length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { error: "First name and last name must not exceed 100 characters each." },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are accepted." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size must not exceed 10 MB." },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const safeFirstName = firstName.replace(/[^a-zA-Z0-9\s\-äöüÄÖÜàáâãäåèéêëìíîïòóôõöùúûüýÿñç]/g, "").trim();
    const safeLastName = lastName.replace(/[^a-zA-Z0-9\s\-äöüÄÖÜàáâãäåèéêëìíîïòóôõöùúûüýÿñç]/g, "").trim();
    const fileName = `${safeFirstName || "First"} ${safeLastName || "Last"}.pdf`;
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filePath = `applications/${timestamp}_${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!isPdf(buffer)) {
      return NextResponse.json(
        { error: "Invalid file. Only PDF files are accepted." },
        { status: 400 }
      );
    }

    const { error: uploadError } = await supabase.storage
      .from("job-applications")
      .upload(filePath, buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { error: "Upload failed. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, path: filePath });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
