import Cors from 'cors'

// Initialize CORS with wildcard for all origins
const cors = Cors({
  methods: ['GET', 'POST', 'OPTIONS'],
  origin: '*', // Allow all origins (be cautious in production)
  credentials: true, // Allow cookies if necessary
})

// Helper function to run middleware
export function runCorsMiddleware(req: any, res: any) {
  return new Promise((resolve, reject) => {
    cors(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}
