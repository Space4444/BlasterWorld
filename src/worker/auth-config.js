import { betterAuth } from 'better-auth'
import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync(":memory:");

export const auth = betterAuth({
    baseURL: 'http://127.0.0.1:5173',
    database: db,
    // Allow requests from the frontend development server
    emailAndPassword: {
        enabled: true,
    },
//   socialProviders: {
//     github: {
//       clientId: env.GITHUB_CLIENT_ID,
//       clientSecret: env.GITHUB_CLIENT_SECRET,
//     },
//     google: {
//       clientId: env.GOOGLE_CLIENT_ID,
//       clientSecret: env.GOOGLE_CLIENT_SECRET,
//     },
//   },
})
