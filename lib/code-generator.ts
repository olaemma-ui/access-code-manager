export function generateAccessCode(): string {
  const digits = "0123456789"
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

  // First part: 4 digits
  const part1 = Array.from({ length: 4 }, () => digits[Math.floor(Math.random() * digits.length)]).join("")

  // Second part: 4 uppercase letters
  const part2 = Array.from({ length: 4 }, () => letters[Math.floor(Math.random() * letters.length)]).join("")

  // Third part: 4 digits
  // const part3 = Array.from({ length: 4 }, () => digits[Math.floor(Math.random() * digits.length)]).join("")

  return `${part1}-${part2}`
}

// Generate multiple unique codes
export function generateUniqueCodes(count: number, existingCodes: Set<string>): string[] {
  const codes: string[] = []
  const maxAttempts = count * 10 // Prevent infinite loops

  for (let i = 0; i < count && i < maxAttempts; i++) {
    let code = generateAccessCode()
    let attempts = 0

    // Retry if code already exists
    while (existingCodes.has(code) && attempts < 100) {
      code = generateAccessCode()
      attempts++
    }

    if (!existingCodes.has(code)) {
      codes.push(code)
      existingCodes.add(code)
    }
  }

  return codes
}
