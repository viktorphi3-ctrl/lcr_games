# CONTEXT.md - LCR GAMERS Collection Vault

## Project Summary
Sistema PWA (Progressive Web App) para gestão rápida, privada e ultra-estilizada de uma coleção de consoles clássicos e jogos raros, sob a identidade visual da marca LCR GAMERS. O foco é a fricção zero no input de dados via Mobile (para quando o cliente estiver viajando/em obras) e visualização limpa em massa no Desktop. A estética deve ser de elite de eSports, agressiva e baseada em neon, inspirada na logo fornecida.

## Visual Identity & Palette (CRÍTICO)
A interface deve seguir rigorosamente a estética da logo "LCR GAMERS" (image_0.png).
- **Style:** Modern eSports Mascote / Modern Neon.
- **Colors:**
  - **Background (Main):** Preto profundo ou Cinza-Carvão profundo (`#000000` a `#121212`).
  - **Accent 1 (Primary Neon):** Ciano Neon (`#00e6e6`).
  - **Accent 2 (Secondary Neon):** Magenta/Rosa Neon (`#ff1a75`).
  - **Text:** Prata Metálico / Branco Brilhante (`#e0e0e0`).
  - **Mascote Tone (Grays):** Usar os cinzas e pretos da pele/roupa do lobo para elementos de UI de fundo.
- **UI Element Rules:** Use debrum e contornos com gradientes de neon (Ciano para Magenta, ou contornos simples) para botões, cabeçalhos, cartões e barra de busca. Os focos de inputs devem ter efeito de luz ciano neon.

## Functional Scope
- **In Scope (MVP):**
  - Autenticação segura (apenas o dono/membro LCR GAMERS acessa).
  - CRUD completo de Consoles e Jogos.
  - Upload de até 3 fotos por item com compressão automática (Client-Side) para WebP.
  - Categorização de condição (CIB, Loose, Sealed, etc.).
  - Busca por nome e filtro rápido por plataforma/ano.
  - Dashboard com métricas base (Total de itens, Valor investido).
- **Out of Scope (MVP):**
  - APIs de precificação externa, perfis públicos, e-commerce, múltiplas coleções.

## Non-Functional Requirements
- **Performance:** Imagens originais (10MB+) DEVEM ser comprimidas no frontend para < 500KB antes do upload.
- **UX/UI:** Mobile-first, responsivo, suportar instalação via navegador (PWA). A UI deve ser temática e baseada em neon.
- **Segurança:** Valores financeiros protegidos por autenticação e Row Level Security (RLS) no banco de dados.

## Architecture Overview
- **Frontend:** Next.js (App Router), React, Tailwind CSS (com paleta LCR GAMERS).
- **UI Components:** Shadcn UI (estilizado para o tema neon), Lucide Icons.
- **Backend/DB/Auth/Storage:** Supabase (PostgreSQL).
- **Image Processing:** `browser-image-compression` (Frontend).

## Data Model (Alto Nível)
**Table: `items`**
- `id` (uuid, PK)
- `type` (text: 'console' ou 'game')
- `title` (text, obrigatório)
- `description` (text, opcional)
- `release_year` (int, opcional)
- `platform` (text, obrigatório)
- `condition` (text: 'CIB', 'Loose', 'Sealed', 'Damaged', 'Restored')
- `purchase_price` (numeric, default 0)
- `image_urls` (text array, max 3)
- `user_id` (uuid, FK para auth.users)
- `created_at`, `updated_at` (timestamp)

## API/Routes
- `/` - Dashboard (Resumo, Total investido, Últimos itens).
- `/login` - Tela de acesso.
- `/collection` - Lista geral com abas/filtros.
- `/collection/[id]` - Detalhes do item.
- `/add` - Formulário unificado de cadastro.

## Folder Structure (Ideal)
```text
/src
  /app
    /(auth)/login/page.tsx
    /(dashboard)/page.tsx
    /(dashboard)/collection/page.tsx
    /(dashboard)/add/page.tsx
  /components
    /ui (shadcn - temático neon)
    /forms
    /layout
  /lib
    supabase.ts
    utils.ts
    image-compression.ts
  /types
    index.ts