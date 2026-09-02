import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BentoGrid } from "@/components/BentoGrid";
import { Pencil, Plus } from "lucide-react";

import {
  useCriarPerfil,
  useCriarBloco,
  type Bloco,
  type WidgetTipo,
  type WidgetConteudo,
} from "@/hooks/useApi";
import { widgetSizeFromColsLinhas } from "@/lib/widgets";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Demo — Contadores Linked" },
      { name: "description", content: "Perfil de exemplo." },
    ],
  }),
  component: Demo,
});

function Demo() {
  const criarPerfil = useCriarPerfil();
  const criarBloco = useCriarBloco(0);
  const [perfilId, setPerfilId] = useState<number | null>(null);
  const [blocos, setBlocos] = useState<Bloco[]>([]);
  const [editing, setEditing] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    criarPerfil.mutate(
      {
        usuario_id: "00000000-0000-0000-0000-000000000000",
        slug: "demo",
        nome_completo: "Rafael Andrade",
        bio: "Contador digital ajudando founders a abrirem CNPJ, pagarem menos imposto e dormirem tranquilos.",
        avatar_url: null,
      },
      {
        onSuccess: (p) => {
          if (!mounted.current) return;
          setPerfilId(p.id);
          const demos: {
            tipo: WidgetTipo;
            titulo?: string;
            conteudo: WidgetConteudo;
            colunas: number;
            linhas: number;
          }[] = [
            {
              tipo: "link",
              titulo: "Site",
              conteudo: { url: "https://example.com", rotulo: "Acesse o Site" },
              colunas: 1,
              linhas: 1,
            },
            {
              tipo: "texto",
              titulo: "Chave Pix",
              conteudo: { texto: "contato@exemplo.com", tipo_copia: true },
              colunas: 1,
              linhas: 1,
            },
            {
              tipo: "mapa",
              titulo: "Local",
              conteudo: { lat: -23.55, lng: -46.63, endereco: "Av Paulista, 1000" },
              colunas: 1,
              linhas: 1,
            },
            {
              tipo: "video",
              titulo: "Aula",
              conteudo: {
                url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                rotulo: "Guia CNPJ",
              },
              colunas: 2,
              linhas: 1,
            },
            {
              tipo: "imagem",
              titulo: "Projeto",
              conteudo: {
                url: "https://picsum.photos/seed/contador/800/600",
                rotulo: "Cases de sucesso",
              },
              colunas: 2,
              linhas: 1,
            },
          ];
          demos.forEach((d, idx) => {
            setTimeout(() => {
              if (mounted.current) {
                criarBloco.mutate({ ...d, ordem: idx, perfil_id: p.id });
              }
            }, idx * 200);
          });
        },
      },
    );
  }, [criarPerfil, criarBloco]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 pb-32 pt-10 sm:px-6 sm:pt-16">
      <header className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarFallback>RA</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="truncate text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Rafael Andrade
            </h1>
            <p className="truncate text-sm text-muted-foreground">@demo</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/">Voltar</Link>
          </Button>
        </div>
      </header>

      <p className="mb-2 text-sm text-muted-foreground">
        Contador digital ajudando founders a abrirem CNPJ, pagarem menos imposto e dormirem
        tranquilos.
      </p>

      {!perfilId && (
        <div className="py-20 text-center text-muted-foreground">Carregando exemplo...</div>
      )}

      {perfilId && blocos.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">
          Carregando blocos de exemplo...
        </div>
      )}

      {perfilId && blocos.length > 0 && (
        <BentoGrid
          widgets={blocos.map((w) => ({
            ...w,
            size: widgetSizeFromColsLinhas(w.colunas, w.linhas),
          }))}
          editing={editing}
          onReorder={(from, to) => {
            const novos = arrayMove(blocos, from, to);
            setBlocos(novos);
          }}
          onRemove={(id) => setBlocos((prev) => prev.filter((b) => b.id !== id))}
        />
      )}

      {editing && (
        <div className="fixed inset-x-0 bottom-6 z-30 flex justify-center px-4">
          <Button
            size="lg"
            className="rounded-full px-6 shadow-[0_18px_50px_-16px_oklch(0.606_0.226_292.5/0.8)]"
          >
            <Plus className="mr-2 size-4" /> Adicionar bloco
          </Button>
        </div>
      )}
    </main>
  );
}
