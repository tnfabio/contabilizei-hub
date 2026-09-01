import { Github, Instagram, Linkedin, Youtube, MapPin, ArrowUpRight, Play } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import avatar from "@/assets/avatar.jpg";
import mapDark from "@/assets/map-dark.jpg";
import showcaseCover from "@/assets/showcase.jpg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Widget } from "@/lib/widgets";

const networks = {
  linkedin: { label: "LinkedIn", Icon: Linkedin },
  instagram: { label: "Instagram", Icon: Instagram },
  github: { label: "GitHub", Icon: Github },
  youtube: { label: "YouTube", Icon: Youtube },
} as const;

function ProfileWidget({ content }: { content: Record<string, unknown> }) {
  return (
    <div className="flex h-full flex-col justify-between gap-5 p-6">
      <div className="flex min-w-0 items-center gap-4">
        <img
          src={avatar}
          alt={`Foto de ${String(content['full_name'])}`}
          width={512}
          height={512}
          className="size-20 shrink-0 rounded-[1.75rem] object-cover ring-2 ring-primary/40 sm:size-24"
        />
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {String(content['full_name'])}
          </h1>
          <p className="truncate text-sm text-muted-foreground">@{String(content['username'])}</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{String(content['bio'])}</p>
      <div className="flex flex-wrap gap-2">
        {(content['tags'] as string[]).map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-foreground"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function SocialWidget({ content }: { content: Record<string, unknown> }) {
  const key = String(content['network']) as keyof typeof networks;
  const net = networks[key] ?? networks.linkedin;
  return (
    <a
      href={String(content['url'])}
      target="_blank"
      rel="noreferrer noopener"
      className="flex h-full flex-col items-center justify-center gap-3 p-6"
    >
      <net.Icon className="size-9 text-primary" strokeWidth={1.75} />
      <span className="text-sm font-semibold text-foreground">{net.label}</span>
    </a>
  );
}

function ShowcaseWidget({ content }: { content: Record<string, unknown> }) {
  return (
    <a
      href={String(content['url'])}
      target="_blank"
      rel="noreferrer noopener"
      className="group relative flex h-full min-h-44 items-end overflow-hidden"
    >
      <img
        src={showcaseCover}
        alt={String(content['title'])}
        loading="lazy"
        width={1024}
        height={576}
        className="absolute inset-0 size-full object-cover opacity-70 transition-opacity group-hover:opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      <div className="relative flex w-full items-end justify-between gap-4 p-6">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            {String(content['subtitle'])}
          </p>
          <h2 className="mt-1 text-lg font-bold text-foreground sm:text-xl">{String(content['title'])}</h2>
        </div>
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
          <Play className="size-4" />
        </span>
      </div>
    </a>
  );
}

function NewsletterWidget({ content }: { content: Record<string, unknown> }) {
  const [email, setEmail] = useState("");
  return (
    <form
      className="flex h-full flex-col justify-center gap-4 p-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (!email) return;
        toast.success("Inscrição confirmada!", { description: `Enviaremos novidades para ${email}.` });
        setEmail("");
      }}
    >
      <div>
        <h2 className="text-lg font-bold text-foreground">{String(content['title'])}</h2>
        <p className="text-sm text-muted-foreground">{String(content['subtitle'])}</p>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 rounded-2xl border border-border/70 bg-background/40 p-1.5">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          className="border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
        <Button type="submit" className="shrink-0 rounded-xl">
          Assinar
        </Button>
      </div>
    </form>
  );
}

function MapWidget({ content }: { content: Record<string, unknown> }) {
  return (
    <div className="relative h-full min-h-40">
      <img
        src={mapDark}
        alt={`Mapa de ${String(content['city'])}`}
        loading="lazy"
        width={512}
        height={512}
        className="absolute inset-0 size-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
      <div className="relative flex h-full flex-col justify-end gap-1 p-5">
        <MapPin className="size-5 text-primary" />
        <p className="text-sm font-semibold text-foreground">{String(content['city'])}</p>
      </div>
    </div>
  );
}

function LinkWidget({ content }: { content: Record<string, unknown> }) {
  return (
    <a
      href={String(content['url'])}
      target="_blank"
      rel="noreferrer noopener"
      className="flex h-full flex-col justify-between gap-3 p-6"
    >
      <ArrowUpRight className="size-6 text-primary" />
      <span className="text-base font-bold leading-snug text-foreground">{String(content['label'])}</span>
    </a>
  );
}

export function WidgetBody({ widget }: { widget: Widget }) {
  switch (widget.type) {
    case "profile":
      return <ProfileWidget content={widget.content} />;
    case "social":
      return <SocialWidget content={widget.content} />;
    case "showcase":
      return <ShowcaseWidget content={widget.content} />;
    case "newsletter":
      return <NewsletterWidget content={widget.content} />;
    case "map":
      return <MapWidget content={widget.content} />;
    case "link":
      return <LinkWidget content={widget.content} />;
  }
}
