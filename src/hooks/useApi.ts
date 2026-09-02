import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Bloco, Perfil, Widget, WidgetTipo, WidgetConteudo } from "@/lib/widgets";

const PERFIS_KEY = (slug: string) => ["perfis", slug] as const;
const BLOCOS_KEY = (perfilId: number) => ["blocos", perfilId] as const;

export function usePerfil(slug: string) {
  return useQuery({
    queryKey: PERFIS_KEY(slug),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("perfis")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data as Perfil | null;
    },
    enabled: slug.length > 0,
  });
}

export function useBlocos(perfilId: number | undefined) {
  return useQuery({
    queryKey: perfilId ? BLOCOS_KEY(perfilId) : ["blocos", "none"],
    queryFn: async () => {
      if (!perfilId) return [];
      const { data, error } = await supabase
        .from("blocos")
        .select("*")
        .eq("perfil_id", perfilId)
        .eq("visivel", true)
        .order("ordem", { ascending: true });
      if (error) throw error;
      return data as Bloco[];
    },
    enabled: !!perfilId,
  });
}

export function useTodosBlocos(perfilId: number | undefined) {
  return useQuery({
    queryKey: perfilId ? ["blocos-todos", perfilId] : ["blocos-todos", "none"],
    queryFn: async () => {
      if (!perfilId) return [];
      const { data, error } = await supabase
        .from("blocos")
        .select("*")
        .eq("perfil_id", perfilId)
        .order("ordem", { ascending: true });
      if (error) throw error;
      return data as Bloco[];
    },
    enabled: !!perfilId,
  });
}

export function useCriarBloco(perfilId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (novo: {
      tipo: WidgetTipo;
      titulo?: string;
      conteudo: WidgetConteudo;
      colunas?: number;
      linhas?: number;
      ordem?: number;
    }) => {
      const { data, error } = await supabase
        .from("blocos")
        .insert({
          perfil_id: perfilId,
          tipo: novo.tipo,
          titulo: novo.titulo ?? null,
          conteudo: novo.conteudo,
          colunas: novo.colunas ?? 1,
          linhas: novo.linhas ?? 1,
          ordem: novo.ordem ?? 0,
          visivel: true,
        })
        .select("*")
        .single();
      if (error) throw error;
      return data as Bloco;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BLOCOS_KEY(perfilId) });
      qc.invalidateQueries({ queryKey: ["blocos-todos", perfilId] });
    },
  });
}

export function useAtualizarBloco(perfilId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...patch }: Partial<Bloco> & { id: number }) => {
      const { data, error } = await supabase
        .from("blocos")
        .update(patch)
        .eq("id", id)
        .select("*")
        .single();
      if (error) throw error;
      return data as Bloco;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BLOCOS_KEY(perfilId) });
      qc.invalidateQueries({ queryKey: ["blocos-todos", perfilId] });
    },
  });
}

export function useExcluirBloco(perfilId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("blocos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BLOCOS_KEY(perfilId) });
      qc.invalidateQueries({ queryKey: ["blocos-todos", perfilId] });
    },
  });
}

export function useReordenarBlocos(perfilId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (blocos: Bloco[]) => {
      const updates = blocos.map((b, idx) =>
        supabase.from("blocos").update({ ordem: idx }).eq("id", b.id),
      );
      const results = await Promise.all(updates);
      for (const r of results) {
        if (r.error) throw r.error;
      }
    },
    onMutate: async (novos) => {
      await qc.cancelQueries({ queryKey: BLOCOS_KEY(perfilId) });
      const anterior = qc.getQueryData<Bloco[]>(BLOCOS_KEY(perfilId)) ?? [];
      qc.setQueryData<Bloco[]>(BLOCOS_KEY(perfilId), novos);
      return { anterior };
    },
    onError: (_err, _novos, ctx) => {
      if (ctx?.anterior) qc.setQueryData(BLOCOS_KEY(perfilId), ctx.anterior);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: BLOCOS_KEY(perfilId) });
    },
  });
}

export function useAtualizarPerfil(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<Perfil>) => {
      const { data, error } = await supabase
        .from("perfis")
        .update(patch)
        .eq("slug", slug)
        .select("*")
        .single();
      if (error) throw error;
      return data as Perfil;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PERFIS_KEY(slug) });
    },
  });
}

export function useCriarPerfil() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (novo: {
      usuario_id: string;
      slug: string;
      nome_completo: string;
      bio: string;
      avatar_url?: string | null;
    }) => {
      const { data, error } = await supabase
        .from("perfis")
        .insert({
          usuario_id: novo.usuario_id,
          slug: novo.slug,
          nome_completo: novo.nome_completo,
          bio: novo.bio,
          avatar_url: novo.avatar_url ?? null,
        })
        .select("*")
        .single();
      if (error) throw error;
      return data as Perfil;
    },
  });
}

export function useAuth() {
  return useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    },
    staleTime: Infinity,
  });
}

export function useMagicLink() {
  return useMutation({
    mutationFn: async (input: { email: string; redirectTo?: string }) => {
      const { error } = await supabase.auth.signInWithOtp({
        email: input.email,
        options: { emailRedirectTo: input.redirectTo ?? window.location.origin },
      });
      if (error) throw error;
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSettled: () => {
      qc.invalidateQueries();
    },
  });
}

export function useUploadAvatar(perfilId: number) {
  return useMutation({
    mutationFn: async (file: File) => {
      const ext = file.name.split(".").pop() ?? "png";
      const path = `${perfilId}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      return data.publicUrl;
    },
  });
}

export function widgetFromBloco(bloco: Bloco): Widget {
  return {
    id: bloco.id,
    tipo: bloco.tipo,
    titulo: bloco.titulo,
    conteudo: bloco.conteudo as WidgetConteudo,
    colunas: bloco.colunas,
    linhas: bloco.linhas,
    ordem: bloco.ordem,
  };
}
