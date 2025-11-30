-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. QUESTIONS TABLE
create table questions (
  id uuid default uuid_generate_v4() primary key,
  type text not null, -- 'RA', 'DI', 'RS', etc.
  title text,
  content text, -- The text to read or prompt
  audio_url text, -- For listening questions
  image_url text, -- For Describe Image
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. SUBMISSIONS TABLE
create table submissions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  question_id uuid references questions(id),
  audio_url text, -- User's recording
  transcript text, -- STT result (optional for now)
  score jsonb, -- Store detailed AI score
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. STORAGE SETUP
-- Create a new bucket for practice audio
insert into storage.buckets (id, name, public)
values ('practice_audio', 'practice_audio', true)
on conflict (id) do nothing;

-- 4. ROW LEVEL SECURITY (RLS)

-- Questions: Everyone can read
alter table questions enable row level security;

create policy "Questions are viewable by everyone"
  on questions for select
  using (true);

-- Submissions: Users can only see/insert their own
alter table submissions enable row level security;

create policy "Users can see their own submissions"
  on submissions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own submissions"
  on submissions for insert
  with check (auth.uid() = user_id);

-- Storage Policies
create policy "Public Access to Audio"
  on storage.objects for select
  using ( bucket_id = 'practice_audio' );

create policy "Authenticated users can upload audio"
  on storage.objects for insert
  with check (
    bucket_id = 'practice_audio' and
    auth.role() = 'authenticated'
  );

