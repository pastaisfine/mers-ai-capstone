# MERS-AI

AI-powered 999 emergency dispatch assistant built for Malaysia. Professional real-time tactical dashboard and simulator.

## Run locally

**Prerequisites:** Node.js 18+

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables: (Skip for now)

   ```bash
   cp .env.example .env.local
   ```

   Set `GEMINI_API_KEY` in `.env.local` when using Gemini API routes.

3. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Description            |
| --------------- | ---------------------- |
| `npm run dev`   | Next.js dev server     |
| `npm run build` | Production build       |
| `npm run start` | Serve production build |
| `npm run lint`  | Run ESLint (Next.js)   |

## Stack

- [Next.js](https://nextjs.org/) 15 (App Router)
- React 19
- Tailwind CSS 4
- TypeScript
