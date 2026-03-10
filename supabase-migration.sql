-- ============================================
-- MIGRAÇÃO: Adicionar user_id às tabelas existentes
-- Execute APENAS se as tabelas já foram criadas sem user_id
-- ============================================

-- 1. Remover políticas antigas
drop policy if exists "Permitir tudo em projects" on projects;
drop policy if exists "Permitir tudo em tasks" on tasks;

-- 2. Adicionar coluna user_id
alter table projects add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table tasks add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- 3. Criar índices
create index if not exists idx_tasks_user_id on tasks(user_id);
create index if not exists idx_projects_user_id on projects(user_id);

-- 4. Novas políticas RLS
create policy "Users can manage their own projects" on projects
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage their own tasks" on tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
