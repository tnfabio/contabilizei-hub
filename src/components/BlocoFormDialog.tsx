import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowUpRight, Copy, Image as ImageIcon, MapPin, Play, Type } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { WidgetTipo, WidgetConteudo } from "@/lib/widgets";

type FormValues = {
  tipo: WidgetTipo;
  titulo?: string;
  colunas: number;
  linhas: number;
  ordem: number;
  conteudo: WidgetConteudo;
};

const emptyConteudo: Record<WidgetTipo, WidgetConteudo> = {
  link: { url: "", rotulo: "" },
  imagem: { url: "", rotulo: "" },
  texto: { texto: "", tipo_copia: false },
  mapa: { lat: -23.55, lng: -46.63, endereco: "" },
  video: { url: "", rotulo: "" },
};

interface BlocoFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: {
    tipo: WidgetTipo;
    titulo?: string;
    colunas: number;
    linhas: number;
    ordem: number;
    conteudo: WidgetConteudo;
  }) => void;
  initial?: {
    tipo: WidgetTipo;
    titulo?: string;
    colunas: number;
    linhas: number;
    ordem: number;
    conteudo: WidgetConteudo;
  } | null;
}

export function BlocoFormDialog({ open, onOpenChange, onSubmit, initial }: BlocoFormDialogProps) {
  const [tipo, setTipo] = useState<WidgetTipo>(initial?.tipo ?? "link");

  const form = useForm<FormValues>({
    defaultValues: {
      tipo: initial?.tipo ?? "link",
      titulo: initial?.titulo ?? "",
      colunas: initial?.colunas ?? 1,
      linhas: initial?.linhas ?? 1,
      ordem: initial?.ordem ?? 0,
      conteudo: initial?.conteudo ?? emptyConteudo["link"],
    },
  });

  useEffect(() => {
    if (open) {
      setTipo(initial?.tipo ?? "link");
      form.reset({
        tipo: initial?.tipo ?? "link",
        titulo: initial?.titulo ?? "",
        colunas: initial?.colunas ?? 1,
        linhas: initial?.linhas ?? 1,
        ordem: initial?.ordem ?? 0,
        conteudo: initial?.conteudo ?? emptyConteudo[initial?.tipo ?? "link"],
      });
    }
  }, [open, initial, form]);

  const validate = (values: FormValues): boolean => {
    switch (values.tipo) {
      case "link": {
        const c = values.conteudo as { url?: string; rotulo?: string };
        if (!c?.url) {
          toast.error("URL é obrigatória");
          return false;
        }
        if (!c?.rotulo) {
          toast.error("Rótulo é obrigatório");
          return false;
        }
        return true;
      }
      case "imagem": {
        const c = values.conteudo as { url?: string };
        if (!c?.url) {
          toast.error("URL da imagem é obrigatória");
          return false;
        }
        return true;
      }
      case "texto": {
        const c = values.conteudo as { texto?: string };
        if (!c?.texto) {
          toast.error("Texto é obrigatório");
          return false;
        }
        return true;
      }
      case "mapa": {
        const c = values.conteudo as { endereco?: string; lat?: number; lng?: number };
        if (!c?.endereco) {
          toast.error("Endereço é obrigatório");
          return false;
        }
        if (c.lat == null || c.lng == null) {
          toast.error("Latitude e longitude são obrigatórias");
          return false;
        }
        return true;
      }
      case "video": {
        const c = values.conteudo as { url?: string };
        if (!c?.url) {
          toast.error("URL do vídeo é obrigatória");
          return false;
        }
        return true;
      }
      default:
        return false;
    }
  };

  const handleSubmit = form.handleSubmit((values) => {
    if (!validate(values)) return;
    onSubmit({
      tipo: values.tipo,
      titulo: values.titulo || undefined,
      colunas: values.colunas,
      linhas: values.linhas,
      ordem: values.ordem,
      conteudo: values.conteudo,
    });
    onOpenChange(false);
  });

  const renderConteudoFields = () => {
    switch (tipo) {
      case "link":
        return (
          <>
            <FormField
              control={form.control}
              name="conteudo.url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="conteudo.rotulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rótulo</FormLabel>
                  <FormControl>
                    <Input placeholder="Meu link" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case "imagem":
        return (
          <>
            <FormField
              control={form.control}
              name="conteudo.url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da imagem</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="conteudo.rotulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rótulo (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Imagem do projeto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case "texto":
        return (
          <>
            <FormField
              control={form.control}
              name="conteudo.texto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Digite seu texto..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="conteudo.tipo_copia"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <input
                    id="tipo-copia"
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="h-4 w-4 rounded border-input"
                  />
                  <label htmlFor="tipo-copia" className="text-sm text-foreground">
                    Permitir cópia
                  </label>
                </FormItem>
              )}
            />
          </>
        );
      case "mapa":
        return (
          <>
            <FormField
              control={form.control}
              name="conteudo.endereco"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input placeholder="Av. Paulista, 1000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="conteudo.lat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="conteudo.lng"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        );
      case "video":
        return (
          <>
            <FormField
              control={form.control}
              name="conteudo.url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do vídeo (YouTube)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="conteudo.rotulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rótulo (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Aula gratuita" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Editar bloco" : "Novo bloco"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select
                    onValueChange={(v) => {
                      field.onChange(v);
                      setTipo(v as WidgetTipo);
                      form.setValue("conteudo", emptyConteudo[v as WidgetTipo]);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="link">Link</SelectItem>
                      <SelectItem value="imagem">Imagem</SelectItem>
                      <SelectItem value="texto">Texto</SelectItem>
                      <SelectItem value="mapa">Mapa</SelectItem>
                      <SelectItem value="video">Vídeo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Título visível" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="colunas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colunas</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="linhas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Linhas</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {renderConteudoFields()}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
