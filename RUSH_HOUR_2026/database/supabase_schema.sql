-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  name text not null,
  email text not null,
  role text not null check (role in ('Citizen', 'Startup Founder', 'Admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- 2. Problems Table
create table if not exists public.problems (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  category text,
  location text not null,
  image_url text,
  status text default 'Pending' check (status in ('Pending', 'Verified', 'Resolved', 'Rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.problems enable row level security;

create policy "Problems are viewable by everyone." on problems for select using (true);
create policy "Authenticated users can create problems." on problems for insert with check (auth.uid() = user_id);
create policy "Users can update their own problems." on problems for update using (auth.uid() = user_id);
create policy "Admins can update all problems." on problems for update using (
  exists (
    select 1 from public.profiles where id = auth.uid() and role = 'Admin'
  )
);

-- 3. AI Analysis Table
create table if not exists public.ai_analysis (
  id uuid primary key default uuid_generate_v4(),
  problem_id uuid references public.problems(id) on delete cascade not null,
  severity_score integer check (severity_score >= 1 and severity_score <= 10),
  priority text check (priority in ('High', 'Medium', 'Low')),
  category_prediction text,
  startup_potential text,
  solution text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (problem_id) -- Assuming one AI analysis per problem
);

alter table public.ai_analysis enable row level security;

create policy "AI Analysis is viewable by everyone." on ai_analysis for select using (true);
-- Insert rule removed; backend will handle insertion via Service Role Key bypassing RLS.

-- 4. Votes Table
create table if not exists public.votes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  problem_id uuid references public.problems(id) on delete cascade not null,
  vote_type text not null check (vote_type in ('upvote', 'downvote')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, problem_id) -- Prevent duplicate voting
);

alter table public.votes enable row level security;

create policy "Votes are viewable by everyone." on votes for select using (true);
create policy "Users can cast votes." on votes for insert with check (auth.uid() = user_id);
create policy "Users can change their votes." on votes for update using (auth.uid() = user_id);
create policy "Users can delete their votes." on votes for delete using (auth.uid() = user_id);

-- 5. Comments Table
create table if not exists public.comments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  problem_id uuid references public.problems(id) on delete cascade not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.comments enable row level security;

create policy "Comments are viewable by everyone." on comments for select using (true);
create policy "Users can add comments." on comments for insert with check (auth.uid() = user_id);
create policy "Users can delete their comments." on comments for delete using (auth.uid() = user_id);
create policy "Users can update their comments." on comments for update using (auth.uid() = user_id);

-- 6. Performance Indexes
create index if not exists idx_problems_status on public.problems(status);
create index if not exists idx_problems_category on public.problems(category);
