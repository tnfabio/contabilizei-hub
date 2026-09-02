import { arrayMove } from "@dnd-kit/sortable";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BentoGrid } from "@/components/BentoGrid";
import { BlocoFormDialog } from "@/components/BlocoFormDialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Plus, Check, LogIn, LogOut } from "lucide-react";

import {
  usePerfil,
  useBlocos,
  useTodosBlocos,
  useCriarBloco,
  useAtualizarBloco,
  useExcluirBloco,
  useReordenarBlocos,
  useAtualizarPerfil,
  useAuth,
  useLogout,
  useUploadAvatar,
  widgetFromBloco,
  type Bloco,
  type WidgetTipo,
  type WidgetConteudo,
} from "@/hooks/useApi";
import { widgetSizeFromColsLinhas } from "@/lib/widgets";

export const Route = createFileRoute("/$slug")({
  head: () => ({
    meta: [
      { title: "Perfil — Contadores Linked" },
      { name: "description", content: "Perfil link-in-bio modular." },
    ],
  }),
  component: SlugPage,
});

function SlugPage() {
  const { slug } = Route.useParams();
  const { data: perfil, isLoading: perfilLoading, error: perfilError } = usePerfil(slug);
  const { data: blocosPublicos, isLoading: blocosPublicosLoading } = useBlocos(perfil?.id);
  const { data: blocosTodos, isLoading: blocosTodosLoading } = useTodosBlocos(perfil?.id);
  const auth = useAuth();
  const logout = useLogout();

  const isOwner = !!auth.data && !!perfil && auth.data.id === perfil.usuario_id;
  const blocosRaw = isOwner ? blocosTodos : blocosPublicos;
  const blocosLoading = isOwner ? blocosTodosLoading : blocosPublicosLoading;

  const criarBloco = useCriarBloco(perfil?.id ?? 0);
  const atualizarBloco = useAtualizarBloco(perfil?.id ?? 0);
  const excluirBloco = useExcluirBloco(perfil?.id ?? 0);
  const reordenar = useReordenarBlocos(perfil?.id ?? 0);
  const atualizarPerfil = useAtualizarPerfil(slug);
  const uploadAvatar = useUploadAvatar(perfil?.id ?? 0);

  const [editing, setEditing] = useState(false);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [blocoEditando, setBlocoEditando] = useState<Bloco | null>(null);
  const [nome, setNome] = useState("");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const initialized = useRef(false);

  useEffect(() => {
    if (perfil && !initialized.current) {
      initialized.current = true;
      setNome(perfil.nome_completo);
      setBio(perfil.bio);
      setAvatarPreview(perfil.avatar_url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perfil?.id]);

  const blocos = (blocosRaw ?? []).map(widgetFromBloco);

  const handleReorder = (from: number, to: number) => {
    const novos = arrayMove(blocos, from, to);
    reordenar.mutate(novos, {
      onError: (err) => toast.error("Erro ao reordenar", { description: String(err.message) }),
    });
  };

  const handleSaveBloco = (values: {
    tipo: WidgetTipo;
    titulo?: string;
    colunas: number;
    linhas: number;
    ordem: number;
    conteudo: WidgetConteudo;
  }) => {
    if (blocoEditando) {
      atualizarBloco.mutate(
        { id: blocoEditando.id, ...values },
        {
          onSuccess: () => toast.success("Bloco atualizado!"),
          onError: (err) => toast.error("Erro ao atualizar", { description: String(err.message) }),
        },
      );
    } else {
      criarBloco.mutate(values, {
        onSuccess: () => toast.success("Bloco criado!"),
        onError: (err) => toast.error("Erro ao criar", { description: String(err.message) }),
      });
    }
    setBlocoEditando(null);
  };

  const handleRemove = (id: number) => {
    excluirBloco.mutate(id, {
      onSuccess: () => toast.success("Bloco removido!"),
      onError: (err) => toast.error("Erro ao remover", { description: String(err.message) }),
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSalvarPerfil = () => {
    let avatarUrl = avatarPreview;
    if (avatarFile && perfil?.id) {
      uploadAvatar.mutate(avatarFile, {
        onSuccess: (url) => {
          avatarUrl = url;
          atualizarPerfil.mutate(
            { nome_completo: nome, bio, avatar_url: avatarUrl },
            { onSuccess: () => toast.success("Perfil atualizado!") },
          );
        },
        onError: (err) => toast.error("Erro no upload", { description: String(err.message) }),
      });
      return;
    }
    atualizarPerfil.mutate(
      { nome_completo: nome, bio, avatar_url: avatarUrl },
      { onSuccess: () => toast.success("Perfil atualizado!") },
    );
  };

  if (perfilError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-foreground">Perfil não encontrado</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            O perfil que você procura não existe ou foi removido.
          </p>
          <Button asChild className="mt-4">
            <Link to="/">Voltar</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (perfilLoading || blocosLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-foreground">Perfil não encontrado</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            O perfil que você procura não existe ou foi removido.
          </p>
          <Button asChild className="mt-4">
            <Link to="/">Voltar</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 pb-32 pt-10 sm:px-6 sm:pt-16">
      <header className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage src={avatarPreview ?? undefined} alt={perfil.nome_completo} />
            <AvatarFallback>{perfil.nome_completo.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="truncate text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              {perfil.nome_completo}
            </h1>
            <p className="truncate text-sm text-muted-foreground">@{perfil.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isOwner && !editing && (
            <Button onClick={() => setEditing(true)} variant="default">
              <Pencil className="mr-2 size-4" /> Editar Grid
            </Button>
          )}
          {isOwner && editing && (
            <Button onClick={() => setEditing(false)} variant="secondary">
              <Check className="mr-2 size-4" /> Concluir edição
            </Button>
          )}
          {auth.data ? (
            <Button variant="ghost" size="sm" onClick={() => logout.mutate()}>
              <LogOut className="mr-2 size-4" /> Sair
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">
                <LogIn className="mr-2 size-4" /> Entrar
              </Link>
            </Button>
          )}
        </div>
      </header>

      {isOwner && editing && (
        <div className="mb-6 rounded-2xl border border-border/70 bg-background/40 p-4">
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Foto de perfil
              </label>
              <Input type="file" accept="image/*" onChange={handleAvatarChange} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Nome</label>
              <Input value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Bio</label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSalvarPerfil}>Salvar perfil</Button>
            </div>
          </div>
        </div>
      )}

      <p className="mb-2 text-sm text-muted-foreground">{perfil.bio}</p>
      <div className="mb-8 flex flex-wrap gap-2">
        {isOwner && editing && (
          <Button
            onClick={() => {
              setBlocoEditando(null);
              setDialogAberto(true);
            }}
            size="sm"
          >
            <Plus className="mr-2 size-4" /> Novo bloco
          </Button>
        )}
      </div>

      {blocos.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          {isOwner && editing
            ? "Nenhum bloco. Clique em 'Novo bloco' para começar."
            : "Este perfil ainda não tem blocos."}
        </div>
      ) : (
        <BentoGrid
          widgets={blocos.map((w) => ({
            ...w,
            size: widgetSizeFromColsLinhas(w.colunas, w.linhas),
          }))}
          editing={editing && isOwner}
          onReorder={handleReorder}
          onRemove={(id) => handleRemove(Number(id))}
          onEdit={(widget) => {
            const bloco = blocos.find((b) => b.id === widget.id);
            if (bloco) {
              setBlocoEditando(bloco);
              setDialogAberto(true);
            }
          }}
        />
      )}

      {isOwner && editing && (
        <div className="fixed inset-x-0 bottom-6 z-30 flex justify-center px-4">
          <Button
            size="lg"
            className="rounded-full px-6 shadow-[0_18px_50px_-16px_oklch(0.606_0.226_292.5/0.8)]"
            onClick={() => setDialogAberto(true)}
          >
            <Plus className="mr-2 size-4" /> Adicionar bloco
          </Button>
        </div>
      )}

      <BlocoFormDialog
        open={dialogAberto}
        onOpenChange={(open) => {
          setDialogAberto(open);
          if (!open) setBlocoEditando(null);
        }}
        onSubmit={handleSaveBloco}
        initial={
          blocoEditando
            ? {
                tipo: blocoEditando.tipo,
                titulo: blocoEditando.titulo,
                colunas: blocoEditando.colunas,
                linhas: blocoEditando.linhas,
                ordem: blocoEditando.ordem,
                conteudo: blocoEditando.conteudo,
              }
            : null
        }
      />
    </main>
  );
}
