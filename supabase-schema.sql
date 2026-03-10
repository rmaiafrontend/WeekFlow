-- ============================================
-- Weekflow Plan — SQL para Supabase
-- Execute no SQL Editor do Supabase Dashboard
-- ============================================

-- Tabela de Projetos
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  color text not null default 'indigo',
  description text,
  created_at timestamptz default now()
);

-- Tabela de Tasks
create table if not exists tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  project_id uuid references projects(id) on delete cascade,
  scheduled_date date,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  notes text,
  completed boolean default false,
  created_at timestamptz default now()
);

-- Índices para buscas frequentes
create index if not exists idx_tasks_scheduled_date on tasks(scheduled_date);
create index if not exists idx_tasks_project_id on tasks(project_id);
create index if not exists idx_tasks_user_id on tasks(user_id);
create index if not exists idx_projects_user_id on projects(user_id);

-- Habilitar RLS (Row Level Security)
alter table projects enable row level security;
alter table tasks enable row level security;

-- Políticas RLS — cada usuário só vê/edita seus próprios dados
create policy "Users can manage their own projects" on projects
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage their own tasks" on tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
