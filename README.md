# Contabilizei Hub

Crie uma aplicação web "Link-in-Bio" estilo linktree, chamada "Contadores linked". A plataforma permite que usuários criem uma página de perfil modular composta por "blocos" de diferentes tamanhos, organizados em uma grade. O design deve ser Dark Mode Imersivo, seguindo estritamente a identidade visual da Contabilizei.com, utilizando Shadcn/UI e Tailwind CSS. Arquitetura Mobile-First.

🎨 Identidade Visual (Contabilizei Theme)

Conceito: "Glassmorphism Dark". Blocos translúcidos sobre um fundo escuro com glows sutis.

Fundo: #020617 (Slate 950) com um gradiente radial muito sutil no topo central (Roxo/Azul) para dar profundidade.

Blocos (Bento Boxes): Fundo #0F172A (Slate 900) com 40% de opacidade ou efeito de vidro (backdrop-blur-md), bordas finas #1E293B, rounded-3xl (bordas bem arredondadas são essenciais para o estilo Bento).

Acentuação: #8B5CF6 (Violet 600) para ícones ativos e botões principais.

Tipografia: Fonte Inter ou Plus Jakarta Sans. Títulos em negrito, brancos. Subtítulos em Slate 400.

Hover Effects: Ao passar o mouse sobre um bloco, ele deve ter um leve scale-105 e a borda deve brilhar sutilmente em roxo.

📱 Estrutura e Layout (Bento Grid) O layout deve ser uma Grade CSS (CSS Grid) que se adapta:

Mobile: 1 coluna (pilha vertical).

Tablet: 2 colunas.

Desktop: 4 colunas.

Componentes (Os "Bento Widgets") Crie variações de componentes que ocupam espaços diferentes na grade (col-span-1, col-span-2, row-span-2):

Profile Card (Grande - 2x2): Foto do usuário (círculo ou squircle), Nome, Bio curta e Tags de skills (ex: "Bubble", "React").

Social Links (Pequeno - 1x1): Botões quadrados grandes com ícones (Instagram, LinkedIn, GitHub, YouTube) centralizados. Ao clicar, abre o link.

Content Showcase (Largo - 2x1): Um card retangular exibindo uma imagem de capa de um projeto ou vídeo, com título sobreposto na parte inferior.

Newsletter/Lead Capture (Largo - 2x1): Input de email + botão "Assinar" integrado no card (estilo minimalista).

Map Card (Pequeno - 1x1): Um mapa estático estilizado (dark map) mostrando a localização da pessoa.

⚙️ Funcionalidades de Edição (Modo "Criador")

Adicione um botão flutuante "Editar Perfil" (visível apenas para o dono).

Quando ativo, os cards devem "tremer" levemente (estilo iOS) ou mostrar ícones de "Arrastar" (Drag Handle) e "Editar/Excluir" no canto.

Simulação de Drag & Drop: Utilize uma biblioteca como dnd-kit ou react-beautiful-dnd para permitir reordenar os blocos. Se for muito complexo inicialmente, crie botões de setas para mover os cards.

🛠 Estrutura de Dados (Supabase)

Tabela profiles: id, username (url única), full_name, bio, avatar_url.

Tabela widgets: id, profile_id, type (social, link, photo, map), content (JSONB para guardar urls, textos, etc), position_index (integer), size (enum: '1x1', '2x1', '2x2').

🚨 Detalhes de Polimento (UX)

Animação de Entrada: Quando a página carrega, os blocos devem aparecer com um efeito de "Staggered Fade-in" (um após o outro vindo de baixo para cima).

Responsividade: No celular, garanta que os cards grandes (2x2) se ajustem para ocupar a largura total, mantendo a proporção visual agradável.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d774e83c-f45e-447e-9bda-bbd154315beb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
