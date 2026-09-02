import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMagicLink, useAuth } from "@/hooks/useApi";

export const Route = createFileRoute("/_auth/login")({
  head: () => ({
    meta: [
      { title: "Entrar — Contadores Linked" },
      { name: "description", content: "Acesse seu perfil com Magic Link." },
    ],
  }),
  component: Login,
});

function Login() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const magicLink = useMagicLink();
  const auth = useAuth();

  if (auth.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <p className="mb-4 text-sm text-muted-foreground">
            Você já está logado como {auth.data.email}
          </p>
          <Button asChild>
            <Link to="/">Ir para meu perfil</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    magicLink.mutate(
      { email, redirectTo: `${window.location.origin}/login/callback` },
      {
        onSuccess: () => {
          setEnviado(true);
          toast.success("Link enviado!", { description: `Enviamos um link mágico para ${email}.` });
        },
        onError: (err) => {
          toast.error("Erro ao enviar link", { description: String(err.message) });
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Entrar</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Acesse seu perfil com um Magic Link por e-mail.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={magicLink.isPending || enviado}>
            {enviado ? "Link enviado" : "Enviar Magic Link"}
          </Button>
        </form>
        {enviado && (
          <p className="text-center text-xs text-muted-foreground">
            Verifique sua caixa de entrada e clique no link para entrar.
          </p>
        )}
        <p className="text-center text-sm text-muted-foreground">
          <Link to="/" className="text-primary underline">
            Voltar para a página inicial
          </Link>
        </p>
      </div>
    </div>
  );
}
