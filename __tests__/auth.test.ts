import { hashPassword, verifyPassword, createToken } from "../lib/auth"
import jwt from "jsonwebtoken"

describe("Auth Utilities", () => {
  describe("Password Hashing", () => {
    it("should hash a password", async () => {
      const password = "testpassword"
      const hashedPassword = await hashPassword(password)

      expect(hashedPassword).toBeDefined()
      expect(hashedPassword).not.toBe(password)
      expect(hashedPassword.length).toBeGreaterThan(20)
    })

    it("should verify a correct password", async () => {
      const password = "testpassword"
      const hashedPassword = await hashPassword(password)

      const isValid = await verifyPassword(password, hashedPassword)
      expect(isValid).toBe(true)
    })

    it("should reject an incorrect password", async () => {
      const password = "testpassword"
      const wrongPassword = "wrongpassword"
      const hashedPassword = await hashPassword(password)

      const isValid = await verifyPassword(wrongPassword, hashedPassword)
      expect(isValid).toBe(false)
    })
  })

  describe("Token Generation", () => {
    it("should create a valid JWT token", () => {
      const userId = "123"
      const token = createToken(userId)

      expect(token).toBeDefined()

      // Verify token contents
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret")
      expect(decoded).toHaveProperty("userId", userId)
      expect(decoded).toHaveProperty("exp")
    })
  })
})
