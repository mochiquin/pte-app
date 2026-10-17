# PTE Speaking Practice

A web app for practising the speaking section of the PTE Academic English test.
Students pick a question type, record their answer in the browser, and review past
attempts on a personal dashboard.

> Status: work in progress. Read Aloud and Describe Image work end to end;
> Repeat Sentence and automatic scoring are not built yet.

## Features

- **Practice library** – questions grouped by PTE task type (Read Aloud, Describe Image, Repeat Sentence).
- **In-browser recording** – records the answer with the MediaRecorder API, with playback and re-record before submitting.
- **Submissions** – audio is uploaded to Supabase Storage and each attempt is saved against the user and question.
- **Dashboard** – lists a user's past submissions with a detail page for each.
- **Auth** – email and password sign-up and sign-in with Supabase Auth; server actions check the session before writing.
- **Row-level security** – users can only read and insert their own submissions (see `supabase/schema.sql`).

## Tech stack

| Layer | Tools |
| --- | --- |
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| UI | Tailwind CSS 4, shadcn/ui (Radix), lucide-react |
| Backend | Next.js server actions |
| Data | Supabase (Postgres, Auth, Storage, RLS) |

## Project structure

```
app/
  actions/        server actions: auth, questions, submissions
  practice/       practice hub and per-type question pages (ra, di)
  dashboard/      submission history and detail pages
  login/          sign-in page
components/
  practice/AudioRecorder.tsx   recording component
  ui/                          shadcn/ui primitives
lib/supabase/     browser and server Supabase clients
supabase/         schema.sql (tables, storage bucket, RLS) and seed.sql
types/            shared TypeScript types
```

## Getting started

1. Create a Supabase project, then run `supabase/schema.sql` and `supabase/seed.sql`
   in its SQL editor.
2. Create `.env.local` in the project root:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Install and run:

   ```bash
   npm install
   npm run dev
   ```

4. Open http://localhost:3000.

## Roadmap

- Repeat Sentence and the remaining speaking task types
- Speech-to-text transcript and automatic scoring (fluency, pronunciation, content)
- Make the audio bucket private and serve recordings through signed URLs
- Remove the `/test-db` debug page before deployment
