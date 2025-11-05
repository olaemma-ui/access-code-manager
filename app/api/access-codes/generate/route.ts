import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { generateUniqueCodes } from "@/lib/code-generator"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(request: NextRequest) {
  try {
    const { accessId, name, totalCodes, email } = await request.json()

    console.log('400 - 0')
    // Validate input
    if (!accessId || !totalCodes) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }


    console.log('400 - 1')
    if (totalCodes <= 0 || totalCodes > 10000) {
      return NextResponse.json({ error: "Total codes must be between 1 and 10000" }, { status: 400 })
    }

    const supabase = await getSupabaseServerClient()

    // Check if access_id exists
    const { data: existingAccessId, error: checkError } = await supabase
      .from("access_ids")
      .select("id")
      .eq("access_id", accessId)
      .single()

    if (checkError || !existingAccessId) {
      return NextResponse.json({ error: "Access ID not found in the database" }, { status: 404 })
    }

    // Get existing codes to ensure uniqueness
    const { data: existingCodes } = await supabase
      .from("access_codes")
      .select("code")
      .eq("access_id_id", existingAccessId.id)

    const existingCodeSet = new Set<string>(existingCodes?.map((c: Record<string, any>) => c.code) || [])

    // Generate unique codes
    const newCodes = generateUniqueCodes(totalCodes, existingCodeSet)

    // Insert codes into database
    const codesToInsert = newCodes.map((code) => ({
      code,
      access_id_id: existingAccessId.id,
      status: "unused",
    }))

    const { error: insertError } = await supabase.from("access_codes").insert(codesToInsert)

    if (insertError) {
      console.error("Insert error:", insertError)
      return NextResponse.json({ error: "Failed to generate codes" }, { status: 500 })
    }

    // Send email with codes
    const codesList = newCodes.join("<br/>")
    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: "rhodagbemi@gmail.com",
      bcc: "olaemma4213@gmail.com",
      subject: `Access Codes Generated`,
      html: `
        <h2>Access Codes Generated</h2>
        <p>Your access codes fhave been generated:</p>
        <pre style="background-color: #f5f5f5; padding: 10px; border-radius: 5px;">
          ${codesList}
        </pre>
        <p>Total codes: <strong>${newCodes.length}</strong></p>
        <p>Keep these codes safe. Each code can be used once to verify access.</p>
      `,
    }

    try {
      await transporter.sendMail(mailOptions)
    } catch (emailError) {
      console.error("Email sending error:", emailError)
      // Don't fail the request if email fails
      return NextResponse.json(
        {
          success: true,
          message: "Codes generated but email could not be sent",
          codesCount: newCodes.length,
        },
        { status: 200 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: `${newCodes.length} codes generated and sent to ${email}`,
        codesCount: newCodes.length,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Generate codes error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
