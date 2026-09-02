# Plano de Implementação — PRD NoCode Folio (Contadores Linked)

## Decisão fixada

Autenticação via **Magic Link do Supabase Auth** (mais simples/configurável que Google para este cenário). Não exibe OAuth extra, basta habilitar no Supabase e usar o client JS.

## Escopo

Transformar o app atual (somente layout/demo com dados hardcoded) em um app real com:

- Perfil público por slug (`/:slug`)
- Modo de edição do dono (login por Magic Link)
- CRUD de blocos em JSONB
- Integração Supabase + Storage

## Tarefas

### 1. Dependências

- Instalar `@supabase/supabase-js` e `@supabase/ssr` (para uso seguro no SSR/hybrid).
- Validar Tipagem: atualizar `src/lib/types.ts` com interfaces do Supabase se necessário.

### 2. Cliente Supabase

- Criar `src/lib/supabase.ts` com cliente browser usando `createBrowserClient` ou `createClient` do `@supabase/ssr`.
- Garantir uso apenas no cliente para esta versão (sem rotas SSR protegidas ainda).

### 3. Banco (Supabase SQL)

- Executar SQL no Supabase para criar tabelas `perfis` e `blocos` conforme PRD (PK int8 identity, JSONB, RLS).
- Habilitar Supabase Auth com provider Email (Magic Link) no painel.

### 4. Onboarding (Perfil)

- Na primeira entrada do usuário logado, criar linha em `perfis` se não existir (`usuario_id` vindo de `auth.uid()`).
- Armazenar `slug`, `nome_completo`, `bio`, `avatar_url`.

### 5. Rota pública `/:slug`

- Nova rota file-based em `src/routes/$slug.tsx` (ou equivalente para TanStack Router).
- Carregar `perfis` por `slug`, então carregar `blocos` relacionados, ordenar por `ordem` e filtrar `visivel = true`.
- Renderizar header do perfil + BentoGrid com os blocos reais.
- Esconder controles de edição quando o visitante não for o dono.

### 6. Modo edição (dono logado)

- Adicionar botão flutuante "Editar Grid" apenas quando `auth.uid() === perfis.usuario_id`.
- Implementar Query Keys no React Query: `['perfis', slug]`, `['blocos', perfilId]`.
- Operações com optimistic updates no React Query para reordenar, adicionar, editar e excluir blocos.

### 7. Modal CRUD de blocos

- Modal para escolher tipo: `link`, `imagem`, `texto`, `mapa`, `video`.
- Formulários dinâmicos por tipo, salvando conteúdo em JSONB e ajustando `colunas`, `linhas`, `ordem`, `visivel`.

### 8. Upload de avatar

- Utilizar Supabase Storage (`avatars`) com upload direto do frontend.

### 9. Ajustes visuais

- Atualizar widgets existentes para consumir dados reais via props tipadas do JSONB.
- Garantir classes condicionais de grid (`clsx`/`tailwind-merge`) para `colunas`/`linhas`.

### 10. Validação

- `bun run lint`
- `bun run build` (verificar se roda)
