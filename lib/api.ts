// lib/api.ts
export async function authorizedFetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token") // Get token
  
    if (!token) {
      throw new Error("No token found. Please login first.")
    }
  
    const headers = new Headers(options.headers || {})
    headers.set("Authorization", `Bearer ${token}`)
    headers.set("Content-Type", "application/json")
  
    const response = await fetch(url, {
      ...options,
      headers,
    })
  
    return response
  }
  