import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          error: "Missing environment variables",
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey,
        },
        { status: 500 }
      )
    }

    // Try to create client and fetch courses
    const supabase = await createClient()
    const { data, error, status, statusText } = await supabase
      .from("courses")
      .select("*")
      .eq("is_active", true)
      .limit(5)

    return NextResponse.json({
      success: !error,
      environment: {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey,
        urlPrefix: supabaseUrl?.substring(0, 20) + "...",
      },
      query: {
        dataCount: data?.length || 0,
        error: error
          ? {
              message: error.message,
              details: error.details,
              hint: error.hint,
              code: error.code,
            }
          : null,
        status,
        statusText,
      },
      sampleData: data?.[0] ? {
        id: data[0].id,
        title: data[0].title,
        is_active: data[0].is_active,
      } : null,
    })
  } catch (err) {
    return NextResponse.json(
      {
        error: "Unexpected error",
        message: err instanceof Error ? err.message : "Unknown error",
        stack: err instanceof Error ? err.stack : undefined,
      },
      { status: 500 }
    )
  }
}

