# WeekFlow

Organize sua semana com simplicidade. Planejador semanal com projetos, tarefas e hábitos recorrentes.

## Features

- **Planner semanal** — visualize e organize tarefas por dia da semana com drag-and-drop
- **Projetos** — agrupe tarefas por projeto com cores customizáveis
- **Hábitos recorrentes** — defina hábitos diários, marque nos dias e acompanhe com heatmap estilo GitHub
- **Responsivo** — funciona em desktop e mobile
- **Dark mode** — tema claro e escuro

## Stack

- React 18 + Vite
- Tailwind CSS
- Supabase (Auth + PostgreSQL)
- TanStack React Query
- Radix UI / Shadcn

## Setup

1. Clone o repositório
2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` com as variáveis do Supabase:

```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon
```

4. Rode o app:

```bash
npm run dev
```
