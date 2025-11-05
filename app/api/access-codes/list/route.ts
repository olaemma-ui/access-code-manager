import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const accessId = searchParams.get("accessId")
    const search = searchParams.get("search")

    const supabase = await getSupabaseServerClient()

    // Build query
    let query = supabase.from("access_codes").select("*, access_ids(name, access_id)")

    if (accessId) {
      query = query.eq("access_ids.access_id", accessId)
    }

    const { data: codes, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("List codes error:", error)
      return NextResponse.json({ error: "Failed to fetch codes" }, { status: 500 })
    }

    // Filter by search if provided
    let filteredCodes = codes || []
    if (search) {
      filteredCodes = filteredCodes.filter(
        (code: Record<string, any>) =>
          code.code.toLowerCase().includes(search.toLowerCase()) ||
          code.access_ids?.name?.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Calculate stats
    const total = filteredCodes.length
    const used = filteredCodes.filter((c : Record<string, any>) => c.status === "used").length
    const available = total - used

    return NextResponse.json(
      {
        codes: filteredCodes,
        stats: {
          total,
          used,
          available,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Get codes error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
