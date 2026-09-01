import { arrayMove } from "@dnd-kit/sortable";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { BentoGrid } from "@/components/BentoGrid";
import { Button } from "@/components/ui/button";
import { initialWidgets, type Widget } from "@/lib/widgets";

const title = "Contadores Linked — perfil link-in-bio de contadores";
const description =
  "Monte seu perfil link-in-bio em blocos: redes sociais, conteúdos, newsletter e localização, tudo em um layout Bento dark.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);
  const [editing, setEditing] = useState(false);

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 pb-32 pt-10 sm:px-6 sm:pt-16">
      <header className="mb-8 flex items-center justify-between gap-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Contadores Linked
        </p>
        <span className="text-xs text-muted-foreground">
          {editing ? "Modo criador" : "contadoreslinked.com/rafael"}
        </span>
      </header>

      <BentoGrid
        widgets={widgets}
        editing={editing}
        onReorder={(from, to) => setWidgets((prev) => arrayMove(prev, from, to))}
        onRemove={(id) => setWidgets((prev) => prev.filter((w) => w.id !== id))}
      />

      <div className="fixed inset-x-0 bottom-6 z-30 flex justify-center px-4">
        <Button
          size="lg"
          variant={editing ? "secondary" : "default"}
          className="rounded-full px-6 shadow-[0_18px_50px_-16px_oklch(0.606_0.226_292.5/0.8)]"
          onClick={() => {
            setEditing((v) => !v);
            if (editing) toast.success("Perfil salvo!");
          }}
        >
          {editing ? <Check className="mr-2 size-4" /> : <Pencil className="mr-2 size-4" />}
          {editing ? "Concluir edição" : "Editar perfil"}
        </Button>
      </div>
    </main>
  );
}
