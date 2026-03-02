# CLAUDE.md — LCR GAMERS Collection Vault

## Project Overview
PWA para gestão de coleção de consoles clássicos e jogos raros. Stack: Next.js 14 (App Router), TypeScript, Tailwind CSS, Shadcn UI, Supabase, Cloudflare Pages.

Leia sempre o `CONTEXT.md` antes de qualquer tarefa. É a fonte de verdade do projeto.

---

## 🤖 Agent Team Structure

### @pm — Project Manager Agent
**Responsabilidade:** Revisar e revalidar TODO o trabalho antes de finalizar. Sempre verifica:
- O código implementado bate com os requisitos do CONTEXT.md?
- A paleta de cores foi respeitada (#000000-#121212 bg, #00e6e6 cyan, #ff1a75 magenta, #e0e0e0 text)?
- A UI está mobile-first e responsiva?
- RLS está ativo no Supabase?
- Compressão de imagem < 500KB está implementada?
- PWA manifest e service worker estão corretos?

**Prompt para acionar:** "Como @pm, revisite [componente/página/feature] e valide contra o CONTEXT.md. Liste o que está correto e o que precisa corrigir."

---

### @ui — UI/UX Agent
**Responsabilidade:** Criar e manter componentes, páginas e layout visual.
**Regras críticas:**
- Background: `bg-[#0a0a0a]` ou `bg-[#111111]` para cards
- Cyan neon: `text-[#00e6e6]`, `border-[#00e6e6]`, `shadow-[0_0_20px_#00e6e6]`
- Magenta neon: `text-[#ff1a75]`, `border-[#ff1a75]`, `shadow-[0_0_20px_#ff1a75]`
- Inputs focus: `focus:border-[#00e6e6] focus:shadow-[0_0_15px_#00e6e6]`
- Botões primários: gradient `from-[#00e6e6] to-[#ff1a75]`
- Fontes: monospace para códigos/IDs, sans-serif bold para títulos
- Sempre usar Shadcn UI como base, sobrescrever com tema neon
- Mobile-first: sidebar colapsa em bottom nav no mobile

**Prompt para acionar:** "Como @ui, crie [componente/página] seguindo o tema neon LCR GAMERS."

---

### @db — Database Agent
**Responsabilidade:** Supabase schema, migrações, RLS policies, Storage buckets.
**Schema principal:**
```sql
-- Table: items
id uuid PK | type text | title text | description text
release_year int | platform text | condition text
purchase_price numeric | image_urls text[] (max 3)
user_id uuid FK auth.users | created_at | updated_at
```
**RLS obrigatório:** Usuário só vê/edita seus próprios items.
**Storage:** Bucket `item-images`, policies por user_id.

**Prompt para acionar:** "Como @db, crie/atualize [migration/policy/schema] para [feature]."

---

### @auth — Auth Agent
**Responsabilidade:** Fluxo de autenticação, middleware de proteção de rotas, sessão.
**Regras:**
- Usar Supabase Auth (email/senha ou magic link)
- Middleware em `/src/middleware.ts` protege todas as rotas exceto `/login`
- Redirecionar para `/login` se não autenticado
- Após login bem-sucedido, redirecionar para `/`

**Prompt para acionar:** "Como @auth, implemente/corrija [feature de auth]."

---

### @feat — Features Agent
**Responsabilidade:** Lógica de negócio, CRUD de items, compressão de imagens, search/filter.
**Regras críticas:**
- Usar `browser-image-compression` antes de qualquer upload
- Comprimir para < 500KB e formato WebP
- CRUD via Supabase client (Server Actions no App Router)
- Busca por nome: `ilike('%query%')` no Supabase
- Filtros: platform, condition, release_year, type

**Prompt para acionar:** "Como @feat, implemente [feature/lógica] para [componente/página]."

---

### @infra — Infrastructure Agent
**Responsabilidade:** GitHub setup, Cloudflare Pages deploy, variáveis de ambiente, CI/CD.
**Configurações:**
- Build command: `npm run build`
- Output directory: `.next`
- Node version: 18
- Env vars no Cloudflare: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `.gitignore` adequado para Next.js + Supabase
- `wrangler.toml` para Cloudflare Pages com Next.js adapter

**Prompt para acionar:** "Como @infra, configure/corrija [infra/deploy/CI]."

---

## 📋 PM Checklist (rodar antes de qualquer commit)

```
[ ] Paleta de cores neon LCR GAMERS respeitada em todos os componentes
[ ] Mobile-first: testado em 375px, 768px, 1280px
[ ] Supabase RLS ativo em todas as tabelas
[ ] Imagens comprimidas < 500KB antes do upload
[ ] PWA: manifest.json correto com ícones e nome "LCR GAMERS"
[ ] Middleware protege todas as rotas autenticadas
[ ] TypeScript sem erros (npx tsc --noEmit)
[ ] Build de produção sem erros (npm run build)
[ ] Variáveis de ambiente em .env.local.example (nunca no .env.local)
[ ] .gitignore inclui .env.local e node_modules
```

---

## 🎨 Design Tokens

```typescript
// tailwind.config.ts
colors: {
  neon: {
    cyan: '#00e6e6',
    magenta: '#ff1a75',
    bg: '#0a0a0a',
    surface: '#111111',
    border: '#1e1e1e',
    text: '#e0e0e0',
    muted: '#666666',
  }
}
```

---

## 📁 Estrutura de Arquivos

```
lcr_games_dashboard/
├── src/
│   ├── app/
│   │   ├── (auth)/login/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── page.tsx               # Dashboard
│   │   │   ├── collection/
│   │   │   │   ├── page.tsx           # Lista
│   │   │   │   └── [id]/page.tsx      # Detalhe
│   │   │   └── add/page.tsx           # Formulário
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                        # Shadcn temático
│   │   ├── layout/                    # Sidebar, Navbar, BottomNav
│   │   └── collection/                # ItemCard, ItemTable, FilterBar
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   └── server.ts
│   │   ├── image-compression.ts
│   │   └── utils.ts
│   ├── types/index.ts
│   └── middleware.ts
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── public/
│   ├── logo.webp
│   ├── manifest.json
│   └── icons/
├── .env.local.example
├── wrangler.toml
├── next.config.ts
├── tailwind.config.ts
└── CONTEXT.md
```

---

## 🚀 Deploy

- **Hosting:** Cloudflare Pages
- **DB/Auth/Storage:** Supabase
- **Repo:** GitHub
- **CI:** Cloudflare Pages auto-deploy on push to `main`
