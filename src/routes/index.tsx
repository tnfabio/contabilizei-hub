import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Contadores Linked — perfis link-in-bio modulares" },
      {
        name: "description",
        content:
          "Monte seu perfil link-in-bio em blocos: links, imagens, textos, mapas e vídeos, tudo em um layout Bento dark.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Contadores Linked
        </h1>
        <p className="text-lg text-muted-foreground">
          Perfis <span className="text-primary">link-in-bio</span> modulares para contadores. Crie
          sua página em blocos e compartilhe com seus clientes.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="rounded-full px-6">
            <Link to="/login">Criar meu perfil</Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="rounded-full px-6">
            <Link to="/demo">Ver exemplo</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Acesse <span className="font-mono text-foreground">/demo</span> para ver um perfil de
          exemplo.
        </p>
      </div>
    </div>
  );
}
