import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { log } from "node:console"

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 })
    }

    const supabase = await getSupabaseServerClient()

    // Find the code
    const { data: accessCode, error: findError } = await supabase
      .from("access_codes")
      .select("*, access_ids(name)")
      .eq("code", code)
      .single()

    if (findError || !accessCode) {
      return NextResponse.json(
        {
          success: false,
          message: "Code not found",
          status: "invalid",
        },
        { status: 200 },
      )
    }

    // Check if code has been used
    if (accessCode.status === "used") {
      return NextResponse.json(
        {
          success: false,
          message: "Code has already been used (expired)",
          status: "expired",
        },
        { status: 200 },
      )
    }

    // Mark code as used
    const { error: updateError } = await supabase
      .from("access_codes")
      .update({
        status: "used",
        used_at: new Date().toISOString(),
      })
      .eq("id", accessCode.id)

      log(updateError)

    if (updateError) {
      return NextResponse.json({ error: "Failed to verify code" }, { status: 500 })
    }

    return NextResponse.json(
      {
        success: true,
        message: "Code verified successfully",
        status: "valid",
        accessName: accessCode.access_ids?.name,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Verify code error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
