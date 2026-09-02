import { ArrowUpRight, Copy, Image as ImageIcon, MapPin, Play, Type } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  ImagemConteudo,
  LinkConteudo,
  MapaConteudo,
  TextoConteudo,
  VideoConteudo,
  Widget,
  WidgetTipo,
} from "@/lib/widgets";

function LinkWidget({ conteudo }: { conteudo: LinkConteudo }) {
  return (
    <a
      href={conteudo.url}
      target="_blank"
      rel="noreferrer noopener"
      className="flex h-full flex-col justify-between gap-3 p-6"
    >
      <ArrowUpRight className="size-6 text-primary" />
      <span className="text-base font-bold leading-snug text-foreground">{conteudo.rotulo}</span>
    </a>
  );
}

function ImagemWidget({ conteudo }: { conteudo: ImagemConteudo }) {
  return (
    <a
      href={conteudo.url}
      target="_blank"
      rel="noreferrer noopener"
      className="group relative flex h-full min-h-44 items-end overflow-hidden"
    >
      <img
        src={conteudo.url}
        alt={conteudo.rotulo ?? "Imagem"}
        loading="lazy"
        className="absolute inset-0 size-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
      />
      {conteudo.rotulo && (
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      )}
      {conteudo.rotulo && (
        <div className="relative p-6">
          <p className="text-sm font-semibold text-foreground">{conteudo.rotulo}</p>
        </div>
      )}
    </a>
  );
}

function TextoWidget({ conteudo }: { conteudo: TextoConteudo }) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(conteudo.texto);
      setCopiado(true);
      toast.success("Copiado!", { description: "Conteúdo copiado para a área de transferência." });
      setTimeout(() => setCopiado(false), 1500);
    } catch {
      toast.error("Erro ao copiar");
    }
  };

  return (
    <div className="flex h-full flex-col justify-between gap-4 p-6">
      <div className="flex items-center gap-2 text-primary">
        <Type className="size-5" />
        <span className="text-xs font-semibold uppercase tracking-widest">Texto</span>
      </div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground sm:text-base">
        {conteudo.texto}
      </p>
      {conteudo.tipo_copia && (
        <Button type="button" size="sm" variant="secondary" onClick={copiar} className="self-start">
          {copiado ? "Copiado" : "Copiar"}
        </Button>
      )}
    </div>
  );
}

function MapaWidget({ conteudo }: { conteudo: MapaConteudo }) {
  const mapaUrl = `https://www.google.com/maps?q=${conteudo.lat},${conteudo.lng}&z=15&output=embed`;

  return (
    <a
      href={`https://www.google.com/maps?q=${conteudo.lat},${conteudo.lng}`}
      target="_blank"
      rel="noreferrer noopener"
      className="relative flex h-full min-h-44 items-end overflow-hidden rounded-3xl"
    >
      <iframe
        title="Mapa"
        src={mapaUrl}
        loading="lazy"
        className="absolute inset-0 size-full border-0"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
      <div className="relative flex items-end gap-2 p-5">
        <MapPin className="size-5 text-primary" />
        <p className="text-sm font-semibold text-foreground">{conteudo.endereco}</p>
      </div>
    </a>
  );
}

function VideoWidget({ conteudo }: { conteudo: VideoConteudo }) {
  const youtubeEmbed = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    );
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    return url;
  };

  return (
    <a
      href={conteudo.url}
      target="_blank"
      rel="noreferrer noopener"
      className="group relative flex h-full min-h-44 items-end overflow-hidden"
    >
      <iframe
        src={youtubeEmbed(conteudo.url)}
        title={conteudo.rotulo ?? "Vídeo"}
        loading="lazy"
        className="absolute inset-0 size-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      {conteudo.rotulo && (
        <div className="relative flex items-center gap-2 p-6">
          <span className="text-sm font-semibold text-foreground">{conteudo.rotulo}</span>
        </div>
      )}
    </a>
  );
}

export function WidgetBody({ widget }: { widget: Widget }) {
  switch (widget.tipo) {
    case "link":
      return <LinkWidget conteudo={widget.conteudo as LinkConteudo} />;
    case "imagem":
      return <ImagemWidget conteudo={widget.conteudo as ImagemConteudo} />;
    case "texto":
      return <TextoWidget conteudo={widget.conteudo as TextoConteudo} />;
    case "mapa":
      return <MapaWidget conteudo={widget.conteudo as MapaConteudo} />;
    case "video":
      return <VideoWidget conteudo={widget.conteudo as VideoConteudo} />;
    default:
      return (
        <div className="flex h-full items-center justify-center p-6 text-muted-foreground">
          Tipo não suportado: {widget.tipo}
        </div>
      );
  }
}

export function widgetTipoRotulo(tipo: WidgetTipo): string {
  const rotulos: Record<WidgetTipo, string> = {
    link: "Link",
    imagem: "Imagem",
    texto: "Texto",
    mapa: "Mapa",
    video: "Vídeo",
  };
  return rotulos[tipo];
}
