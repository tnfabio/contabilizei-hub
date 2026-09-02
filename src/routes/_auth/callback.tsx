import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/_auth/callback")({
  component: Callback,
});

function Callback() {
  useEffect(() => {
    const handleCallback = async () => {
      const { error } = await supabase.auth.getSessionFromUrl({
        storeSession: true,
        redirectTo: window.location.origin,
      });
      if (error) {
        toast.error("Erro ao autenticar", { description: error.message });
      } else {
        toast.success("Login realizado!");
      }
      window.history.replaceState({}, "", "/");
      window.location.href = "/";
    };
    handleCallback();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <p className="text-sm text-muted-foreground">Autenticando...</p>
    </div>
  );
}
